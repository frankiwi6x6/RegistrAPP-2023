import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ClaseService } from '../services/clase.service';
import { AlumnoInfoService } from '../services/alumno-info.service';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AsistenciaService } from '../services/asistencia.service';
import { AlertControllerService } from '../services/alert-controller.service';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.page.html',
  styleUrls: ['./alumno.page.scss'],
})


export class AlumnoPage implements OnInit {

  userInfo: any = ''
  seccionesInscritas: any[] = [];
  alumnoInfo: any = null;
  idClase: string = '';
  isPresente: any = '';


  TIPO_ERROR = 'Error al marcar asistencia.';
  TIPO_IS_PRESENTE = 'Usted ya está presente.'
  MSJ_SIN_USUARIO = 'No existe un usuario logueado, reinicie la aplicacion e intentelo nuevamente.';
  MSJ_SIN_ID_CLASE = 'Debes ingresar el código de la asignatura.';
  MSJ_IS_PRESENTE = 'Ya se ha registrado su asistencia.';
  MSJ_ERROR_MARCADO = 'Ocurrió un error al marcar asistencia.';

  constructor(
    private router: Router,
    private _auth: AuthService,
    private claseService: ClaseService,
    private _alumno: AlumnoInfoService,
    private asistencia: AsistenciaService,
    private alertas: AlertControllerService
  ) { }

  ngOnInit() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser !== null) {
      this.userInfo = JSON.parse(currentUser);
    }
    this.obtenerInfoDelAlumno(this.userInfo.id);



  }


  obtenerInfoDelAlumno(id: string) {
    this._alumno.getAllAlumnoInfo(id)
      .subscribe(
        (data) => {
          this.alumnoInfo = data[0];
          this.seccionesInscritas = this.alumnoInfo.alumno_seccion


          console.log(this.alumnoInfo)
          console.log(this.seccionesInscritas)


        },
        (error) => {
          console.error('Error al obtener información del alumno:', error);
        }
      );
  }

  async marcarAsistencia() {
    if (!this.alumnoInfo) {
      this.mostrarError(this.TIPO_ERROR, this.MSJ_SIN_USUARIO);
      return;
    }
    if (this.idClase === '') {
      this.mostrarError(this.TIPO_ERROR, this.MSJ_SIN_ID_CLASE);
      return;
    }
    try {
      const respuesta = await this.asistencia.getEstadoAlumno(this.idClase, this.alumnoInfo.id).toPromise();

      if (respuesta[0].isPresente) {
        this.mostrarError(this.TIPO_IS_PRESENTE, this.MSJ_IS_PRESENTE);
        return;
      } else {
        const ahora = new Date();
        const fecha = ahora.getFullYear() + '-' + (ahora.getMonth() + 1) + '-' + ahora.getDate();
        const hora = ahora.getHours() + ':' + ahora.getMinutes() + ':' + ahora.getSeconds();

        const data: any = {
          isPresente: true,
          hora: hora
        };
        const actualizacionExitosa = await this.asistencia.patchAsistenciaPorFechaYAlumno(this.idClase, fecha, this.alumnoInfo.id, data).toPromise();

        if (actualizacionExitosa) {
          console.log('Ya está presente en esta clase.');
          // Puedes mostrar un mensaje o tomar otras acciones aquí
        } else {
          console.log('Actualización exitosa:', actualizacionExitosa);
        }
      }
    } catch (error) {
      console.error('Error al marcar asistencia:', error);
      this.mostrarError(this.TIPO_ERROR, this.MSJ_ERROR_MARCADO);
    }
    // if (this.alumnoInfo) {
    //   if (this.idClase === '') {
    //     this.alertas.tipoError = 'Error al marcar asistencia.';
    //     this.alertas.mensajeError = 'Debes ingresar el código de la asignatura.';
    //     this.alertas.showAlert();
    //     return;
    //   } else {
    //     this.asistencia.getEstadoAlumno(this.idClase, this.alumnoInfo.id)
    //       .subscribe(
    //         (respuesta) => {
    //           this.isPresente = respuesta[0].isPresente;
    //           console.log(this.isPresente);
    //         },
    //         (error) => {
    //           console.error('Error al obtener información del alumno:', error);
    //         }
    //       );
    //     if (this.isPresente === true) {
    //       this.alertas.tipoError = 'Error al marcar asistencia.';
    //       this.alertas.mensajeError = 'Ya se ha registrado su asistencia.';
    //       this.alertas.showAlert();
    //       return;
    //     } else {
    //       const ahora = new Date();
    //       const fecha = ahora.getFullYear() + '-' + (ahora.getMonth() + 1) + '-' + ahora.getDate();
    //       const hora = ahora.getHours() + ':' + ahora.getMinutes() + ':' + ahora.getSeconds();

    //       const data: any = {
    //         isPresente: true,
    //         hora: hora
    //       };

    //       this.asistencia.patchAsistenciaPorFechaYAlumno(this.idClase, fecha, this.alumnoInfo.id, data)
    //         .subscribe(
    //           (respuesta) => {
    //             // Verifica si isPresente es true en la respuesta
    //             if (respuesta) {
    //               console.log('Ya está presente en esta clase.');
    //               // Aquí puedes mostrar un mensaje o tomar alguna otra acción
    //             } else {
    //               console.log('Actualización exitosa:', respuesta);
    //             }
    //           },
    //           (error) => {
    //             // Maneja los errores aquí
    //             console.error('Error en la actualización:', error);
    //             this.alertas.tipoError = 'Error al marcar asistencia.';
    //             this.alertas.mensajeError = 'Usted no pertenece a esta clase.';
    //             this.alertas.showAlert();
    //             return;
    //           }
    //         );
    //     }
    //   }
    // } else {
    //   this.alertas.tipoError = 'Error al marcar asistencia.';
    //   this.alertas.mensajeError = 'No existe un usuario logueado, reinicie la aplicacion e intentelo nuevamente.';
    //   this.alertas.showAlert();
    //   console.error('this.alumnoInfo no está definido. Asegúrate de cargar la información del alumno antes de llamar a marcarAsistencia().');
    //   return;
    // }
  }

  private mostrarError(tipoError: string, mensaje: string) {
    this.alertas.tipoError = tipoError;
    this.alertas.mensajeError = mensaje;
    this.alertas.showAlert();
  }



  logout() {
    this._auth.logout();
    this.router.navigateByUrl('login');
  }
}
