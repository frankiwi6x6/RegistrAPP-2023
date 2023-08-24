import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QRScanner, QRScannerStatus } from '@capacitor-community/barcode-scanner';
import { UserService } from '../user.service';

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.page.html',
  styleUrls: ['./alumno.page.scss'],
})
export class AlumnoPage {

  currentUser: any;

  constructor(private router: Router, private userService: UserService) {
    this.currentUser = this.userService.getCurrentUser();
  }

  async scanQRCode() {
    const status: QRScannerStatus = await QRScanner.prepare();

    if (status.authorized) {
      const result = await QRScanner.startScan();

      if (!result.cancelled) {
        console.log('Código QR escaneado:', result.content);
        // Puedes hacer algo con el resultado aquí
      }
    } else if (status.denied) {
      console.log('El acceso a la cámara está denegado');
      // Puedes mostrar un mensaje al usuario
    } else {
      console.log('No se pudo acceder a la cámara');
    }
  }

  logout(): void {
    console.log('Cerrando sesión');
    this.userService.setCurrentUser(undefined);
    this.router.navigate(['/home']);
  }
}
