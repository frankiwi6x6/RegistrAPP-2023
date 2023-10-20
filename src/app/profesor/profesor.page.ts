import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import * as QRCode from 'qrcode';
import { ProfesorInfoService } from '../services/profesor-info.service';
import { CrearClaseService } from '../services/crear-clase.service';
import { AlertControllerService } from '../services/alert-controller.service';
import { AuthService } from '../services/auth.service';
import { AsistenciaService } from '../services/asistencia.service';
import { info } from 'console';

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
  fecha: string = '2000-01-01';
  asistenciaAlumnos: any[] = [];
  infoSeguridad: any;
  tiempoRestante: number = 10;
  intervalId: any;

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
    this.iniciarObtenerAsistenciaAutomatica();

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
      });
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
          if (data === 'La clase ya existe para esta sección y fecha.') {
            this.mostrarError(data);
          } else {
            this.infoClase = data[0];
            this.claseCreada = true;
            this.crearSeguridad(this.infoClase.id);
          }
        },
        (error) => {
          console.error('Error al obtener información de la clase:', error);
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
      this.obtenerInformacionDeClase(seccion.id, fecha);
    } else {
      this.mostrarError('Ya se ha creado clase para esta sección hoy.');
    }
  }

  private obtenerFechaActual(): string {
    const ahora = new Date();
    return ahora.toISOString().split('T')[0];
  }

  private obtenerInformacionDeClase(idSeccion: any, fecha: string): void {
    this.clase.comprobarClase(idSeccion, fecha).subscribe(
      (respuesta) => {
        if (respuesta.length > 0) {
          // La fila ya existe, no es necesario crearla nuevamente
          this.infoClase = respuesta[0];
          this.mostrarError('Ya se ha iniciado el registro para esta clase.');
          console.log(this.infoClase);
          // Obtén la asistencia usando la ID de la clase
          this.obtenerAsistencia(this.infoClase.id);
        } else {
          const data = {
            id_seccion: idSeccion,
            fecha: fecha
          };
          // La fila no existe, así que la creamos
          this.clase.crearClase(data).subscribe(
            (creacion) => {
              console.log('Registro exitoso:', creacion);
              this.mostrarExito('Se ha registrado la clase exitosamente.');

              // Almacena la ID de la clase creada
              this.infoClase = creacion;
              // Obtén la asistencia usando la ID de la clase
              this.obtenerAsistencia(this.infoClase.id);

              // Luego, puedes obtener información de seguridad
              this.clase.getSeguridad(idSeccion, fecha).subscribe(
                (seguridad) => {
                  this.infoSeguridad = seguridad;
                  console.log(this.infoSeguridad);
                },
                (error) => {
                  console.error('Error al obtener información de seguridad:', error);
                }
              );
            },
            (error) => {
              console.error('Error al crear clase:', error);
              this.mostrarError('No se pudo crear la clase.');
            }
          );
        }
      },
      (error) => {
        console.error('Error al comprobar la clase:', error);
        this.mostrarError('No se pudo comprobar la clase.');
      }
    );
  }

  // Función para obtener la asistencia con la ID de la clase
  obtenerAsistencia(idClase: string): void {
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

  crearSeguridad(id_clase: string) {
    const numeroAlAzar = 88888888;
    const fecha = this.obtenerFechaActual();
    const data = {
      clase_id: id_clase,
      codigo: numeroAlAzar,
      fecha: fecha
    };
    this.clase.postSeguridad(data).subscribe(
      (respuesta) => {
        console.log(respuesta);
      },
      (error) => {
        console.error('Error al crear fila en seguridad:', error);
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
        console.error('Error al obtener información de seguridad:', error);
        console.log(error);
      }
    );
  }


  private iniciarObtenerAsistenciaAutomatica(): void {
    const intervalo = 1000; // 1 segundo
    this.tiempoRestante = 10;
    this.intervalId = setInterval(() => {
      if (this.infoClase && this.infoClase.id) {


        if (this.tiempoRestante === 10) {
          // Llamar a la función para obtener la asistencia

          this.obtenerAsistencia(this.infoClase.id);

          this.tiempoRestante = 10;
        }
        if (this.tiempoRestante > 0) {
          this.tiempoRestante--; // Restar 1 segundo
        }
        if (this.tiempoRestante === 0) {
          // Llamar a la función para obtener la asistencia


          this.tiempoRestante = 10;
        }

      }
    }, intervalo);
  }
}