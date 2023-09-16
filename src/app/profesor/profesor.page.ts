import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import * as QRCode from 'qrcode';
import { ProfesorInfoService } from '../services/profesor-info.service';


@Component({
  selector: 'app-profesor',
  templateUrl: 'profesor.page.html',
  styleUrls: ['profesor.page.scss']
})

export class ProfesorPage implements OnInit {

  currentUser: any;
  profesorInfo: any;


  constructor(
    private router: Router,
    private userService: UserService,
    private profesorInfoService: ProfesorInfoService
  ) { }
  ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();
    this.loadProfesorInfo();
  }

  async loadProfesorInfo() {
    try {
      this.profesorInfo = await this.profesorInfoService.getProfesorInfo(this.currentUser.id);

    } catch (error) {
      console.error('Error al cargar la información del profesor:', error);
    }
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
}
