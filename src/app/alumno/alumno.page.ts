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
        if (this.alumnoPresente === false) {
          setInterval(() => {
            if (this.idClase !== '' && this.alumnoPresente === false) {
              this.obtenerCodigoSeguridad(this.idClase);
            }
          }, 5000);
        }
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
          this.seccionesInscritas = this.alumnoInfo.alumno_seccion
          console.log(this.alumnoInfo)
          console.log(this.seccionesInscritas)
        },
        (error: any) => {
          console.error('Error al obtener información del alumno:', error);
        }
      );
  }

  async marcarAsistencia(idClase: string, codigoDeSeguridad: string) {
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
        const ahora = new Date();
        const fecha = ahora.getFullYear() + '-' + (ahora.getMonth() + 1) + '-' + ahora.getDate();
        const hora = ahora.getHours() + ':' + ahora.getMinutes() + ':' + ahora.getSeconds();
        await this.obtenerCodigoSeguridad(idClase)
        const data: any = {
          isPresente: true,
          hora: hora
        };
        if (parseInt(codigoDeSeguridad) === this.codigoDB) {
          const actualizacionExitosa = await this.asistencia.patchAsistenciaPorFechaYAlumno(idClase, fecha, this.alumnoInfo.id, data).toPromise();
          if (actualizacionExitosa) {
            console.log('Ya está presente en esta clase.');
          } else {
            console.log('Actualización exitosa:', actualizacionExitosa);
            this.alertas.showAlert(this.TIPO_EXITO, this.MSJ_EXITO);
            this.alumnoPresente = true;
          }
        } else {
          if (codigoDeSeguridad === undefined) {
            this.alertas.showAlert(this.TIPO_ERROR, this.MSJ_CODIGO_VACIO);
          } else {
            this.alertas.showAlert(this.TIPO_ERROR, this.MSJ_CODIGO_NO_VALIDO);
          }
        }
      }
    } catch (error) {
      console.error('Error al marcar asistencia:', error);
      this.alertas.showAlert(this.TIPO_ERROR, this.MSJ_ERROR_MARCADO);
    }
  }

  async escanearQR() {
    this.router.navigateByUrl('alumno/scanner');
  }


  private obtenerCodigoSeguridad(id_clase: string) {
    this._seguridad.getSeguridad(id_clase).subscribe(
      (respuesta: any) => {
        this.codigoDB = respuesta[0].codigo;
        console.log(this.codigoDB);
      },
      (error: any) => {
        console.error('Error al obtener información de seguridad:', error);
        console.log(error);
      }
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
      this.barcodes = barcodes;
      this.QR = JSON.parse(this.barcodes[0].rawValue);
      //   this.alertas.tipoError = 'Resultado del escaneo';
      //   this.alertas.mensajeError = `ID clase: ${this.QR.id_clase}, ${typeof this.QR.id_clase }`  + `
      //   Código de seguridad: ${this.QR.codigo_seguridad} ${typeof this.QR.codigo_seguridad }
      //   `;
      // this.alertas.showAlert();
      this.idClase = this.QR.id_clase;
      await this.alertas.showAlert("Esta es su clase?", `ID: ${this.idClase}, Contraseña: , ${this.QR.codigo_seguridad}`)

      console.log(this.idClase);
      console.log(this.codigoSeguridad);

      this.marcarAsistencia(this.QR.id_clase, this.QR.codigo_seguridad);

    }
    catch (error) {
      // this.alertas.tipoError = 'Error al escanear';
      // this.alertas.mensajeError = `${error}`;
    }
  }
  public async installGoogleBarcodeScannerModule(): Promise<void> {
    await BarcodeScanner.installGoogleBarcodeScannerModule();
  }



}