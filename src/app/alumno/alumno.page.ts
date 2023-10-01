import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ClaseService } from '../services/clase.service'; // Importa el servicio ClaseService
import { AlumnoInfoService } from '../services/alumno-info.service';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AsistenciaService } from '../services/asistencia.service';

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.page.html',
  styleUrls: ['./alumno.page.scss'],
})


export class AlumnoPage implements OnInit {

  currentUser: any;
  asignaturasInscritas: any[] = [];
  alumnoInfo: any = null;
  codigoAsignatura: string = '';
  constructor(
    private router: Router,
    private userService: UserService,
    private claseService: ClaseService,
    private alumnoInfoService: AlumnoInfoService,
    private asistencia: AsistenciaService
  ) { }

  ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();
    this.obtenerInfoDelAlumno(this.currentUser.id);
    this.loadAsignaturasInscritas();
  }

  obtenerInfoDelAlumno(id: string) {
    this.alumnoInfoService.getAlumnoInfo(id)
      .subscribe(
        (data) => {
          this.alumnoInfo = data[0];
        },
        (error) => {
          console.error('Error al obtener información del alumno:', error);
        }
      );
  }

  mostrarInfo() {
    console.log(this.alumnoInfo);
  }


  async loadAsignaturasInscritas() {
    try {
      const asignaturas = await this.claseService.getAsignaturasInscritasPorAlumno(this.currentUser.id);

      this.asignaturasInscritas = asignaturas;
    } catch (error) {
      console.error('Error al cargar las asignaturas inscritas por el alumno:', error);
    }
  }

  async marcarAsistencia() {
<<<<<<< HEAD
    if (this.alumnoInfo) {
      // Calcula la fecha y hora exactas en este momento
      const ahora = new Date();
      const fecha = ahora.getFullYear() + '-' + (ahora.getMonth() + 1) + '-' + ahora.getDate();
      const hora = ahora.getHours() + ':' + ahora.getMinutes() + ':' + ahora.getSeconds();

      // Datos que deseas enviar en la solicitud POST
      const data: any = {
        id_asignatura: this.codigoAsignatura,
        fecha: fecha,
        hora: hora,
        id_alumno: this.alumnoInfo.id,
      };
=======
    const result = await BarcodeScanner.startScan();
    if (result.hasContent) {
      console.log('Código QR escaneado:', result.content);
      if (this.alumnoInfo) {
        const data: any = {
          id_clase: result.content,
          id_alumno: this.alumnoInfo.id,
        };
>>>>>>> 291030395539377b1ce31519838bbf8926a4ee83

        // Realizamos la solicitud POST
        this.asistencia.postAsistencia(data)
          .subscribe(
            (respuesta) => {
              console.log('Respuesta:', respuesta);
            },
            (error) => {
              console.error('Error en la solicitud:', error);
            }
          );
      } else {
        console.error('this.alumnoInfo no está definido. Asegúrate de cargar la información del alumno antes de llamar a marcarAsistencia().');
      }
    } else {
      console.log('Escaneo de código QR cancelado o sin contenido.');
    }
  }




  logout(): void {
    console.log('Cerrando sesión');
    this.userService.setCurrentUser(undefined);
    this.router.navigate(['/home']);
  }

}
