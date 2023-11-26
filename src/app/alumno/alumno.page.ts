import { Component, NgZone, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { DialogService } from '../services/dialog.service';
import { Router } from '@angular/router';

import { FilePicker } from '@capawesome/capacitor-file-picker';
import { AlumnoInfoService } from '../services/alumno-info.service';
import {
  Barcode,
  BarcodeFormat,
  BarcodeScanner,
  LensFacing,
} from '@capacitor-mlkit/barcode-scanning';
import { AsistenciaService } from '../services/asistencia.service';
import { AlertControllerService } from '../services/alert-controller.service';
import { AuthService } from '../services/auth.service';
import { SeguridadService } from '../services/seguridad.service';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { type } from 'os';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map, of } from 'rxjs';


@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.page.html',
  styleUrls: ['./alumno.page.scss'],
})


export class AlumnoPage implements OnInit {

  public readonly barcodeFormat = BarcodeFormat;
  public readonly lensFacing = LensFacing;

  public formGroup = new UntypedFormGroup({
    formats: new UntypedFormControl([]),
    lensFacing: new UntypedFormControl(LensFacing.Back),
    googleBarcodeScannerModuleInstallState: new UntypedFormControl(0),
    googleBarcodeScannerModuleInstallProgress: new UntypedFormControl(0),
  });
  public barcodes: Barcode[] = [];
  public isSupported = false;
  public isPermissionGranted = false;
  QR: any = '';
  userInfo: any = ''
  seccionesInscritas: any[] = [];
  alumnoInfo: any = null;
  idClase: string = '';
  isPresente: any = '';
  codigoSeguridad: number;
  codigoDB: number;
  alumnoPresente: boolean = false;
  resultadoScanner: any = '';
  content_visibility = ''
  consoleLogs: string;

  TIPO_ERROR = 'Error al marcar asistencia.';
  TIPO_IS_PRESENTE = 'Usted ya está presente.'
  TIPO_EXITO = 'Exito al marcar asistencia.'
  MSJ_EXITO = 'Se ha registrado su asistencia de manera exitosa.';
  MSJ_SIN_USUARIO = 'No existe un usuario logueado, reinicie la aplicacion e intentelo nuevamente.';
  MSJ_SIN_ID_CLASE = 'Debes ingresar el código de la asignatura.';
  MSJ_IS_PRESENTE = 'Ya se ha registrado su asistencia.';
  MSJ_ERROR_MARCADO = 'Ocurrió un error al marcar asistencia.';
  MSJ_CODIGO_NO_VALIDO = 'El código de seguridad ingresado no es válido'
  MSJ_CODIGO_VACIO = 'Debe ingresar un código de seguridad.'


  constructor(
    private router: Router,
    private _auth: AuthService,
    private _alumno: AlumnoInfoService,
    private asistencia: AsistenciaService,
    private _seguridad: SeguridadService,
    private alertas: AlertControllerService,
    private readonly ngZone: NgZone,
    private readonly dialogService: DialogService
  ) { }

  ngOnInit() {
    this.installGoogleBarcodeScannerModule();
    BarcodeScanner.isSupported().then((result: any) => {
      this.isSupported = result.supported;
    });
    BarcodeScanner.checkPermissions().then((result: any) => {
      this.isPermissionGranted = result.camera === 'granted';
    });
    BarcodeScanner.removeAllListeners().then(() => {
      BarcodeScanner.addListener(
        'googleBarcodeScannerModuleInstallProgress',
        (event: any) => {
          this.ngZone.run(() => {
            console.log('googleBarcodeScannerModuleInstallProgress', event);
            this.addToConsoleLogs('googleBarcodeScannerModuleInstallProgress ' + event);
            const { state, progress } = event;
            this.formGroup.patchValue({
              googleBarcodeScannerModuleInstallState: state,
              googleBarcodeScannerModuleInstallProgress: progress,
            });
          });
        }
      );
    });

    this._auth.getCurrentUser().then(user => {
      if (user) {
        this.userInfo = user;
        console.log(this.userInfo);
        this.obtenerInfoDelAlumno(this.userInfo.id);

      } else {
        this.router.navigateByUrl('login');
      }
    });
  }

  obtenerInfoDelAlumno(id: string) {
    this._alumno.getAllAlumnoInfo(id)
      .subscribe(
        (data: any) => {
          this.alumnoInfo = data[0];
          this.seccionesInscritas = this.alumnoInfo.alumno_seccion;
          this.addToConsoleLogs('Información del alumno obtenida con éxito');
          console.log(this.alumnoInfo);
          console.log(this.seccionesInscritas);
        },
        (error: any) => {
          this.addToConsoleLogs('Error al obtener información del alumno');
          console.error('Error al obtener información del alumno:', error);
        }
      );
  }

  async marcarAsistencia(idClase: string, codigoDeSeguridad: string) {
    this.addToConsoleLogs('Iniciando marcado de asistencia');

    if (!this.alumnoInfo) {
      this.alertas.showAlert(this.TIPO_ERROR, this.MSJ_SIN_USUARIO);
      return;
    }

    if (idClase === '') {
      this.alertas.showAlert(this.TIPO_ERROR, this.MSJ_SIN_ID_CLASE);
      return;
    }

    try {
      const respuesta = await this.asistencia.getEstadoAlumno(idClase, this.alumnoInfo.id).toPromise();

      if (respuesta[0].isPresente) {
        this.alertas.showAlert(this.TIPO_IS_PRESENTE, this.MSJ_IS_PRESENTE);
        this.alumnoPresente = true;
        return;
      } else {
        // Llamamos a obtenerCodigoSeguridad antes de intentar marcar la asistencia
        const codigoSeguridadDB: number | undefined = await this.obtenerCodigoSeguridad(idClase).toPromise();

        // Convertir codigoDeSeguridad a número si es una cadena
        const codigoDeSeguridadNum: number | undefined = parseInt(codigoDeSeguridad);

        const ahora = new Date();
        const fecha = ahora.getFullYear() + '-' + (ahora.getMonth() + 1) + '-' + ahora.getDate();
        const hora = ahora.getHours() + ':' + ahora.getMinutes() + ':' + ahora.getSeconds();

        const data: any = {
          isPresente: true,
          hora: hora
        };

        // Comparamos con el código de seguridad obtenido de la base de datos
        if (
          codigoDeSeguridadNum !== undefined &&
          codigoSeguridadDB !== undefined &&
          codigoDeSeguridadNum === codigoSeguridadDB
        ) {
          const actualizacionExitosa = await this.asistencia.patchAsistenciaPorFechaYAlumno(idClase, fecha, this.alumnoInfo.id, data).toPromise();

          if (actualizacionExitosa) {
            console.log('Ya está presente en esta clase.');
            this.addToConsoleLogs('Ya está presente en esta clase.');

          } else {
            console.log('Actualización exitosa:', actualizacionExitosa);

            this.addToConsoleLogs('Marcado de asistencia exitoso');
            this.alertas.showAlert(this.TIPO_EXITO, this.MSJ_EXITO);
            this.alumnoPresente = true;
          }
        } else {
          if (codigoDeSeguridad === undefined) {
            this.alertas.showAlert(this.TIPO_ERROR, this.MSJ_CODIGO_VACIO);
            this.addToConsoleLogs('Código de seguridad vacío');
          } else {
            this.alertas.showAlert(this.TIPO_ERROR, this.MSJ_CODIGO_NO_VALIDO);
            this.addToConsoleLogs('Código de seguridad no válido');
          }
        }
      }
    } catch (error) {
      this.addToConsoleLogs('Error al marcar asistencia');
      console.error('Error al marcar asistencia:', error);
      this.alertas.showAlert(this.TIPO_ERROR, this.MSJ_ERROR_MARCADO);
    }
  }



  private obtenerCodigoSeguridad(id_clase: string): Observable<number | undefined> {
    return this._seguridad.getSeguridad(id_clase).pipe(
      map((respuesta: any) => respuesta[0]?.codigo),
      catchError((error: any) => {
        console.error('Error al obtener información de seguridad:', error);
        this.addToConsoleLogs('Error al obtener información de seguridad ' + error);
        return of(undefined); // Devolver Observable con valor undefined en caso de error
      })
    );
  }


  logout() {
    this.userInfo = undefined;
    this._auth.logout();
    this.router.navigateByUrl('login');
  }

  public async scan(): Promise<void> {
    try {
      const formats: any = this.barcodeFormat.QrCode;
      const { barcodes } = await BarcodeScanner.scan({
        formats,
      });

      if (barcodes.length > 0) {
        this.barcodes = barcodes;
        this.QR = JSON.parse(this.barcodes[0].rawValue);

        // Mostramos los datos del QR en la consola
        console.log('ID clase:', this.QR.id_clase);
        console.log('Código de seguridad:', this.QR.codigo_seguridad);

        // Asegúrate de que el usuario confirme antes de marcar la asistencia
        const confirmacion = await this.mostrarConfirmacion();

        if (confirmacion) {
          // Al hacer clic en "Aceptar"
          this.addToConsoleLogs('Confirmando asistencia...');
          this.marcarAsistencia(this.QR.id_clase, this.QR.codigo_seguridad);
        } else {
          // Al hacer clic en "Cancelar"
          this.addToConsoleLogs('Confirmación cancelada');
        }
      }
    } catch (error) {
      this.addToConsoleLogs('Error al escanear');
      this.alertas.tipoError = 'Error al escanear';
      this.alertas.mensajeError = `${error}`;
    }
  }

  async mostrarConfirmacion(): Promise<boolean> {
    const mensaje =
      '¿Estás seguro de que deseas marcar la asistencia con este código QR?';

    // Mostramos los datos del QR en la consola
    console.log('ID clase:', this.QR.id_clase);
    console.log('Código de seguridad:', this.QR.codigo_seguridad);

    const confirmacion = window.confirm(mensaje);

    // Mostramos en la consola si se aceptó o se canceló
    console.log('Confirmación:', confirmacion ? 'Aceptada' : 'Cancelada');

    return confirmacion;
  }


  public async installGoogleBarcodeScannerModule(): Promise<void> {
    await BarcodeScanner.installGoogleBarcodeScannerModule();
  }

  private addToConsoleLogs(log: string) {
    this.consoleLogs += `${log}\n`;
  }

}