import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { usuarios } from '../app.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.page.html',
  styleUrls: ['./recuperar-contrasena.page.scss'],
})
export class RecuperarContrasenaPage {

  username: string = '';
  password: string = '';
  confirmarPassword: string = '';
  mensajeError: string = '';
  tipoError: string = '';
  constructor(
    private router: Router,
    private _auth: AuthService,
    private _user: UserService,
    private alertCtrl: AlertController) { }
  async showAlert() {


    await this.alertCtrl.create({
      header: this.tipoError,
      message: this.mensajeError,
      buttons: [{
        text: 'Entendido',
        role: 'OK',
        cssClass: 'alertButton',
        handler: () => { }
      }]
    }).then(res => {
      res.present();
    })
  }

  recuperarContrasena(): void {
    if (this.password !== this.confirmarPassword) {
      this.mensajeError = 'Las contraseñas no coinciden';
      this.tipoError = 'Error.';
      this.showAlert();
    } else {
      this._user.getUserInfo(this.username, this.password).subscribe(
        (user) => {
          if (user) {
            if (user.password === this.password) {
              this.mensajeError = 'La contraseña nueva no puede ser igual a la anterior';
              this.tipoError = 'Error.';
              this.showAlert();
            } else {
              this.tipoError = 'Contraseña actualizada';
              this.mensajeError = 'La contraseña se ha actualizado correctamente';
              this.showAlert();
              this._user.passwordRecovery(this.username, this.password).subscribe(
                () => {
                  // Contraseña actualizada en la base de datos
                },
                (error) => {
                  console.error('Error al actualizar la contraseña en la base de datos:', error);
                  // Maneja el error apropiadamente
                }
              );
              this.router.navigate(['/login']);
            }
          } else {
            this.mensajeError = 'El usuario no existe';
            this.tipoError = 'Error.';
            this.showAlert();
          }
        },
        (error) => {
          console.error('Error al recuperar información del usuario:', error);
          // Maneja el error apropiadamente
        }
      );
    }
  }
  retroceder(): void {
    this.router.navigateByUrl('login');
  }
}
