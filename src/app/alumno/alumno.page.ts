import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ClaseService } from '../services/clase.service'; // Importa el servicio ClaseService
import { AlumnoInfoService } from '../services/alumno-info.service'; 
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';


@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.page.html',
  styleUrls: ['./alumno.page.scss'],
})


export class AlumnoPage implements OnInit {

  currentUser: any;
  asignaturasInscritas: any[] = [];
  alumnoInfo: any;

  constructor(
    private router: Router,
    private userService: UserService,
    private claseService: ClaseService,
    private alumnoInfoService: AlumnoInfoService,
  ) { }

  ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();
    this.loadAsignaturasInscritas();
    this.loadAlumnoInfo();
  }
  async loadAlumnoInfo() {
    try {
      this.alumnoInfo = await this.alumnoInfoService.getAlumnoInfo(this.currentUser.id);
    } catch (error) {
      console.error('Error al cargar la información del alumno:', error);
    }
  }



  async loadAsignaturasInscritas() {
    try {
      const asignaturas = await this.claseService.getAsignaturasInscritasPorAlumno(this.currentUser.id);

      this.asignaturasInscritas = asignaturas;
    } catch (error) {
      console.error('Error al cargar las asignaturas inscritas por el alumno:', error);
    }
  }
  async scanQRCode() {
    const result = await BarcodeScanner.startScan();
    if (result.hasContent) {
      // El código QR ha sido escaneado con éxito, result.text contiene el contenido.
      console.log('Código QR escaneado:', result.content);
    } else {
      // El escaneo fue cancelado o no se encontró ningún código QR.
      console.log('Escaneo de código QR cancelado o sin contenido.');
    }
  }
  


  logout(): void {
    console.log('Cerrando sesión');
    this.userService.setCurrentUser(undefined);
    this.router.navigate(['/home']);
  }

}
