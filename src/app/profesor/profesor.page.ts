import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import * as QRCode from 'qrcode';
import { ProfesorInfoService } from '../services/profesor-info.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-profesor',
  templateUrl: 'profesor.page.html',
  styleUrls: ['profesor.page.scss']
})

export class ProfesorPage implements OnInit {

  currentUser: any;
  profesorInfo: any;
  userId: string;
  profesorId: string;
  mostrarTabla: boolean = false;
  seccionesYAsignaturas: any;

  constructor(
    private router: Router,
    private userService: UserService,
    private profesorInfoService: ProfesorInfoService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();

    // Llama al servicio para obtener la información del profesor
    this.getProfesorInfo();
  }

  logout(): void {
    console.log('Cerrando sesión');
    this.userService.setCurrentUser(undefined);
    this.router.navigate(['/home']);
  }

  generateQRCode(): void {
    const qrText = JSON.stringify(this.currentUser);

    QRCode.toCanvas(document.getElementById('qrcodeCanvas'), qrText, (error) => {
      if (error) {
        console.error('Error al generar el código QR:', error);
      }
    });
  }

  getProfesorInfo(): void {
    this.userId = this.currentUser.id;

    this.profesorInfoService
      .getProfesorInfo(this.userId)
      .then((result) => {
        this.profesorInfo = result;
        
      })
      .catch((error) => {
        console.error('Error al obtener la información del profesor:', error);
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
    this.getSeccionesYAsignaturas(); // Llama a tu función para obtener secciones y asignaturas
    this.mostrarTabla = true; // Muestra la tabla
  }
  registrarAsistencia(seccion: any): void {
    // Aquí puedes agregar la lógica para registrar la asistencia de la sección.
    // Puedes mostrar un cuadro de diálogo, un formulario o realizar cualquier acción
    // necesaria para registrar la asistencia de los estudiantes de esta sección.
    // También puedes utilizar el ID de la sección (seccion.id) para identificarla.

    // Ejemplo de acción ficticia (mostrar un mensaje)
    const asignatura = this.buscarAsignatura(seccion.id_asignatura);
    alert(`Registrando asistencia para ${asignatura} - Sección ${seccion.nombre}`);
  }
}