import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import * as QRCode from 'qrcode';
import { ProfesorInfoService } from '../services/profesor-info.service';
import { CrearClaseService } from '../services/crear-clase.service';
import { AlertControllerService } from '../services/alert-controller.service';
import { AuthService } from '../services/auth.service';
import { AsistenciaService } from '../services/asistencia.service';
import { SeguridadService } from '../services/seguridad.service';

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
  codigoSeguridad: number;


  constructor(
    private router: Router,
    private _auth: AuthService,
    private profesorInfoService: ProfesorInfoService,
    private _clase: CrearClaseService,
    private _seguridad: SeguridadService,
    private alertas: AlertControllerService,

  ) { }

  ngOnInit() {
    this._auth.getCurrentUser().then(user => {
      if (user) {
        this.userInfo = user;
        console.log(this.userInfo);
        this.ahora = new Date();
        this.fecha = this.ahora.getFullYear() + '-' + (this.ahora.getMonth() + 1) + '-' + this.ahora.getDate();
        this.loadProfesorInfo();
        if (this.profesorInfo !== undefined) {
          this.getSeccionesYAsignaturas();
        } else {
          this.loadProfesorInfo();
        }
        this.iniciarObtenerAsistenciaAutomatica();
      } else {
        this.router.navigateByUrl('login');
      }
    });
  }

  logout() {
    this._auth.logout();
    this.infoClase = '';
    this.userInfo = '';
    this.router.navigateByUrl('login');
  }

  generateQRCode(id_clase: string, codigo_seguridad: string): void {
    this.qrCreado = true;
    const qrText = JSON.stringify({ id_clase: id_clase, codigo_seguridad: codigo_seguridad });
    setTimeout(() => {
      QRCode.toCanvas(document.getElementById('qrcodeCanvas'), qrText, (error:any) => {
        if (error) {
          console.error('Error al generar el código QR:', error);
        } else {
          this.qrCreado = true;
        }
      });

    }, 25
    );
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
    this._clase.comprobarClase(id, dia)
      .subscribe(
        (data) => {
          if (data === 'La clase ya existe para esta sección y fecha.') {
            this.alertas.showAlert('Error al crear la clase',data);
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

    if (this.infoClase === undefined) {
      this.obtenerInformacionDeClase(seccion.id, fecha);
    } else {
      this.alertas.showAlert('Error al crear clase:', 'Ya se ha creado clase para esta sección hoy.');
    }
  }

  private obtenerFechaActual(): string {
    const ahora = new Date();
    return ahora.getFullYear() + '-' + (ahora.getMonth() + 1) + '-' + ahora.getDate();
  }

  private obtenerInformacionDeClase(idSeccion: any, fecha: string): void {
    this._clase.comprobarClase(idSeccion, fecha).subscribe(
      (respuesta) => {
        if (respuesta.length > 0) {
          this.infoClase = respuesta[0];
          this.alertas.showAlert('Error al crear clase:', 'Ya se ha iniciado el registro para esta clase.');
          console.log(this.infoClase);
          this.obtenerAsistencia(this.infoClase.id);
          this.obtenerInfoSeguridad(this.infoClase.id, fecha);
        } else {
          const data = {
            id_seccion: idSeccion,
            fecha: fecha
          };
          // La fila no existe, así que la creamos
          this._clase.crearClase(data).subscribe(
            (creacion) => {
              console.log('Registro exitoso:', creacion);
              this.alertas.showAlert('Exito al crear la clase!','Se ha registrado la clase exitosamente');

              this.infoClase = creacion;
              this._clase.comprobarClase(idSeccion, fecha).subscribe(
                (respuesta) => {
                  this.infoClase = respuesta[0];
                  console.log(this.infoClase);
                  this.obtenerAsistencia(this.infoClase.id);
                  this.obtenerInfoSeguridad(this.infoClase.id, fecha);
                });



            },
            (error) => {
              console.error('Error al crear clase:', error);
              this.alertas.showAlert('Error al crear la clase','No se pudo crear la clase.');
            }
          );

        }
      },
      (error) => {
        console.error('Error al comprobar la clase:', error);
        this.alertas.showAlert('Error al crear la clase','No se pudo comprobar la clase.');
      }
    );
  }


  // Función para obtener la asistencia con la ID de la clase
  obtenerAsistencia(idClase: string): void {
    const fecha = this.obtenerFechaActual();
    this._clase.getAlumnosPresentes(idClase, fecha).subscribe(
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
    };
    this._seguridad.postSeguridad(data).subscribe(
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
    this._seguridad.getSeguridad(id_clase).subscribe(
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
          // Llamar a la función para actualizar el código de seguridad
          this.actualizarCodigoSeguridad(this.infoClase.id);
          this.tiempoRestante = 10;
        }
        if (this.tiempoRestante > 0) {
          this.tiempoRestante--; // Restar 1 segundo
        }
        if (this.tiempoRestante === 0) {
          this.tiempoRestante = 10;
        }
      }
    }, intervalo);
  }
  private generarCodigoSeguridad(): number {
    const min = 10000000; // Número mínimo de 8 dígitos
    const max = 99999999; // Número máximo de 8 dígitos
    const numeroAlAzar: number = Math.floor(Math.random() * (max - min + 1)) + min;
    return numeroAlAzar;
  }


  private actualizarCodigoSeguridad(id_clase: string) {
    if (this.codigoSeguridad === undefined) {
      this.crearSeguridad(id_clase);
    }
    const codigo = this.generarCodigoSeguridad();
    this._seguridad.patchSeguridad(codigo, id_clase).subscribe(
      (respuesta) => {
        console.log('Código de seguridad actualizado:', respuesta);

        this._seguridad.getSeguridad(id_clase).subscribe(
          (respuesta) => {
            this.codigoSeguridad = respuesta[0].codigo;
            console.log(this.codigoSeguridad);
            this.generateQRCode(id_clase, this.codigoSeguridad.toString());
          },
          (error) => {
            console.error('Error al obtener información de seguridad:', error);
            console.log(error);
          }
        );
      },
      (error) => {
        console.error('Error al actualizar código de seguridad:', error);
      }
    );
  }

}