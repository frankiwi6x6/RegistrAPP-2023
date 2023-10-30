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
    const user = usuarios.find(u => u.username === this.username);
    if (this.password != this.confirmarPassword) {
      this.mensajeError = 'Las contraseñas no coinciden';
      this.tipoError = 'Error.';
      this.showAlert();
    } else {

      if (user) {
        if (user.password === this.password) {
          this.mensajeError = 'La contraseña nueva no puede ser igual a la anterior';
          this.tipoError = 'Error.';
          this.showAlert();
        } else {
          this.tipoError = 'Contraseña actualizada';
          this.mensajeError = 'La contraseña se ha actualizado correctamente';
          this.showAlert();
          this._auth.setCurrentUser(user);
          user.password = this.password;
          this.router.navigate(['/home']);
        }

      } else{
        this.mensajeError = 'El usuario no existe';
        this.tipoError = 'Error.';
        this.showAlert();  
      }




    }
  }
  retroceder(): void{
    this.router.navigateByUrl('login');
  }
}
