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

    this.loadProfesorInfo();
  }

  logout(): void {
    console.log('Cerrando sesión');
    this.userService.setCurrentUser(undefined);
    this.router.navigate(['/home']);
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
    this.profesorInfoService.getProfesorInfo(this.currentUser.id)
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
  registrarAsistencia(seccion: any): void {
   
    const asignatura = this.buscarAsignatura(seccion.id_asignatura);
    this.generateQRCode(seccion.id_asignatura)
    alert(`Registrando asistencia para ${asignatura} - Sección ${seccion.nombre}`);
  }
}