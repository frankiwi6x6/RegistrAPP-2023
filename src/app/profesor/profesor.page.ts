import { Component, OnInit, numberAttribute } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import * as QRCode from 'qrcode';
import { ProfesorInfoService } from '../services/profesor-info.service';
import { CrearClaseService } from '../services/crear-clase.service';
import { AlertControllerService } from '../services/alert-controller.service';
import { AuthService } from '../services/auth.service';
import { AsistenciaService } from '../services/asistencia.service';

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
  asistenciaAlumnos: any[] = [];
  infoSeguridad: any;
  constructor(
    private router: Router,
    private _auth: AuthService,
    private profesorInfoService: ProfesorInfoService,
    private clase: CrearClaseService,
    private alertas: AlertControllerService,
    private _asistencia: AsistenciaService
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
          this.claseCreada = true;

          this.crearSeguridad(this.infoClase.id);
        },
        (error) => {
          console.error('Error al obtener información del alumno:', error);
        }
      );
  }
  registrarAsistencia(seccion: any): void {
    const fecha = this.obtenerFechaActual();
    const data = {
      id_seccion: seccion.id,
      fecha,
    };

    if (this.infoClase === undefined) {
      this.crearYRegistrarClase(data, seccion.id);
    } else {
      this.mostrarError('Ya se ha creado clase para esta sección hoy.');
      // Puedes realizar otras acciones aquí, como generar un código QR.
    }
  }

  private obtenerFechaActual(): string {
    const ahora = new Date();
    const fecha = ahora.getFullYear() + '-' + (ahora.getMonth() + 1) + '-' + ahora.getDate();

    return fecha;
  }

  private crearYRegistrarClase(data: any, idSeccion: any): void {

    setTimeout(() => {
      this.clase.crearClase(data)
        .subscribe(
          (respuesta) => {
            console.log('Registro exitoso:', respuesta);
            this.mostrarExito('Se ha registrado la clase exitosamente.');
            this.obtenerInfoDeLaClase(idSeccion, data.fecha);



          },
          (error) => {
            console.error('Error al crear clase:', error);
            this.mostrarError('Ya se ha iniciado el registro para esta clase.');
            this.obtenerInfoDeLaClase(idSeccion, data.fecha);

          }

        );
    }, 2000);

    this.obtenerInfoSeguridad(this.infoClase.id, this.infoClase.fecha)
    this.obtenerAsistencia(this.infoClase.id)
  }

  private mostrarExito(mensaje: string): void {
    this.alertas.tipoError = 'Registro exitoso';
    this.alertas.mensajeError = mensaje;
    this.alertas.showAlert();
  }

  private mostrarError(mensaje: string): void {
    this.alertas.tipoError = 'Error al crear clase';
    this.alertas.mensajeError = mensaje;
    this.alertas.showAlert();
  }

  obtenerAsistencia(idClase: string) {
    const fecha = this.obtenerFechaActual();

    this.clase.getAlumnosPresentes(idClase, fecha).subscribe(
      (respuesta) => {
        this.asistenciaAlumnos = respuesta;
        console.log(respuesta);
      },
      (error) => {
        console.error('Error al obtener información del alumno:', error);
        console.log(error);
      }
    );

  }
  crearSeguridad(id_clase: string) {
    const numeroAlAzar = 88888888;
    const fecha = this.obtenerFechaActual();
    const data = {
      clase_id: id_clase,
      codigo: numeroAlAzar,
      fecha: fecha
    }
    this.clase.postSeguridad(data).subscribe(
      (respuesta) => {
        console.log(respuesta);
      },
      (error) => {
        console.error('Error al creaer fila en seguridad:', error);
        console.log(error);
      }
    );
  }
  obtenerInfoSeguridad(id_clase: string, fecha: string) {
    this.clase.getSeguridad(id_clase, fecha).subscribe(
      (respuesta) => {
        this.infoSeguridad = respuesta;
        console.log(this.infoSeguridad);
      },
      (error) => {
        console.error('Error al obtener información del alumno:', error);
        console.log(error);
      })
  }
}
