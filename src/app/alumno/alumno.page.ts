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
    if (this.alumnoInfo) {
      if (this.idClase === '') {
        this.alertas.tipoError = 'Error al marcar asistencia.';
        this.alertas.mensajeError = 'Debes ingresar el código de la asignatura.';
        this.alertas.showAlert();
        return;
      } else {
        this.asistencia.getEstadoAlumno(this.idClase, this.alumnoInfo.id)
          .subscribe(
            (respuesta) => {
              this.isPresente = respuesta[0].isPresente;
              console.log(this.isPresente);
            },
            (error) => {
              console.error('Error al obtener información del alumno:', error);
            }
          );
        if (this.isPresente === true) {
          this.alertas.tipoError = 'Error al marcar asistencia.';
          this.alertas.mensajeError = 'Ya se ha registrado su asistencia.';
          this.alertas.showAlert();
          return;
        } else {
          const ahora = new Date();
          const fecha = ahora.getFullYear() + '-' + (ahora.getMonth() + 1) + '-' + ahora.getDate();
          const hora = ahora.getHours() + ':' + ahora.getMinutes() + ':' + ahora.getSeconds();

          const data: any = {
            isPresente: true,
            hora: hora
          };




          this.asistencia.patchAsistenciaPorFechaYAlumno(this.idClase, fecha, this.alumnoInfo.id, data)
            .subscribe(
              (respuesta) => {
                // Verifica si isPresente es true en la respuesta
                if (respuesta) {
                  console.log('Ya está presente en esta clase.');
                  // Aquí puedes mostrar un mensaje o tomar alguna otra acción
                } else {
                  console.log('Actualización exitosa:', respuesta);
                }
              },
              (error) => {
                // Maneja los errores aquí
                console.error('Error en la actualización:', error);
                this.alertas.tipoError = 'Error al marcar asistencia.';
                this.alertas.mensajeError = 'Usted no pertenece a esta clase.';
                this.alertas.showAlert();
                return;
              }
            );
        }
      }
    } else {
      this.alertas.tipoError = 'Error al marcar asistencia.';
      this.alertas.mensajeError = 'No existe un usuario logueado, reinicie la aplicacion e intentelo nuevamente.';
      this.alertas.showAlert();
      console.error('this.alumnoInfo no está definido. Asegúrate de cargar la información del alumno antes de llamar a marcarAsistencia().');
      return;
    }
  }




  logout(){
    this._auth.logout();
    this.router.navigateByUrl('login');
  }
}
