import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import * as QRCode from 'qrcode';
import { ProfesorInfoService } from '../services/profesor-info.service';
import { CrearClaseService } from '../services/crear-clase.service';
import { AlertControllerService } from '../services/alert-controller.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profesor',
  templateUrl: 'profesor.page.html',
  styleUrls: ['profesor.page.scss']
})

export class ProfesorPage implements OnInit {
  userInfo: any = '';
  profesorInfo: any;
  userId: string;
  profesorId: string;
  mostrarTabla: boolean = false;
  qrCreado: boolean = false;
  infoClase: any;
  claseCreada: boolean = false;
  seccionesYAsignaturas: any;
  ahora: Date
  fecha: string = '2000-01-01'
  constructor(
    private router: Router,
    private _auth: AuthService,
    private profesorInfoService: ProfesorInfoService,
    private clase: CrearClaseService,
    private alertas: AlertControllerService
  ) { }

  ngOnInit() {
    this.ahora = new Date();
    this.fecha = this.ahora.getFullYear() + '-' + (this.ahora.getMonth() + 1) + '-' + this.ahora.getDate();
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser !== null) {
      this.userInfo = JSON.parse(currentUser);
    }
    this.loadProfesorInfo();
  }



  logout() {
    this._auth.logout();
    this.router.navigateByUrl('login');
  }



  generateQRCode(id_clase: string): void {
    const qrText = JSON.stringify(id_clase);

    QRCode.toCanvas(document.getElementById('qrcodeCanvas'), qrText, (error) => {
      if (error) {
        console.error('Error al generar el código QR:', error);
      }
    });
  }

  async loadProfesorInfo() {
    this.profesorInfoService.getProfesorInfo(this.userInfo.id)
      .then(data => {
        this.profesorInfo = data[0];
      })

  }


  getSeccionesYAsignaturas(): void {
    this.profesorId = this.profesorInfo.id;

    this.profesorInfoService
      .getSeccionesYAsignaturas(this.profesorId)
      .then((result) => {
        this.seccionesYAsignaturas = result;

      })
      .catch((error) => {
        console.error('Error al obtener secciones y asignaturas:', error);
      });
  }

  buscarAsignatura(idSeccion: string): string | undefined {
    const asignatura = this.seccionesYAsignaturas.asignaturas.find((a: {
      id: string;
      nombre: string;
    }) => a.id === idSeccion);
    return asignatura ? asignatura.nombre : 'Asignatura no encontrada';
  }

  mostrarTablaAsistencia(): void {
    this.getSeccionesYAsignaturas();
    this.mostrarTabla = true;
  }

  obtenerInfoDeLaClase(id: string, dia: string) {

    this.clase.comprobarClase(id, dia)

      .subscribe(
        (data) => {
          this.infoClase = data[0];
          console.log(this.infoClase);
          this.claseCreada = true;
        },
        (error) => {
          console.error('Error al obtener información del alumno:', error);
        }
      );
  }
  registrarAsistencia(seccion: any): void {

    this.fecha = this.ahora.getFullYear() + '-' + (this.ahora.getMonth() + 1) + '-' + this.ahora.getDate();

    const data: any = {
      id_seccion: seccion.id,
      fecha: this.fecha

    };
    this.obtenerInfoDeLaClase(seccion.id, this.fecha);
    if (this.infoClase === undefined) {
      this.clase.crearClase(data)
        .subscribe(
          (respuesta) => {
            // Maneja la respuesta exitosa aquí
            console.log('Registro exitoso:', respuesta);
            this.alertas.tipoError = 'Registro exitoso!';
            this.alertas.mensajeError = 'Se ha registrado la clase exitosamente.';
            this.alertas.showAlert();
            // this.generateQRCode(respuesta[0].id);
            this.obtenerInfoDeLaClase(seccion.id, this.fecha);
          },
          (error) => {

          }
        );


    } else {
      this.alertas.tipoError = 'Error al crear clase.';
      this.alertas.mensajeError = 'Ya se ha creado clase para esta seccion hoy.';
      this.alertas.showAlert();

      // const asignatura = this.buscarAsignatura(seccion.id_asignatura);
      // this.generateQRCode(seccion.id_asignatura)
      // alert(`Registrando asistencia para ${asignatura} - Sección ${seccion.nombre}`);
    }
    setTimeout(() => {

    }, 1000);


  }
}
