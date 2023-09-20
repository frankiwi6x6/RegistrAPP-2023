import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { usuarios } from '../app.component';
import { UserService } from '../services/user.service';
import { AlertController } from '@ionic/angular';
import { supabase } from '../../../supabase.config';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  username: string = '';
  password: string = '';
  mensajeError: string = '';
  tipoError: string = '';

  constructor(private router: Router, private userService: UserService, private alertCtrl: AlertController) {
    
  }

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

  async login(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('usuario')
        .select('*')
        .eq('username', this.username)
        .single(); 

      if (error) {
        console.error('Error al consultar datos:', error);
        this.tipoError = 'Error al iniciar sesión.';
        this.mensajeError = 'Ocurrió un error al consultar los datos del usuario.';
        this.showAlert();
      } else if (data) {
        if (data.password === this.password) {
          this.tipoError = 'Inicio de sesión exitoso!';
          
          console.log('El usuario es ' + data.tipo_usuario)
          this.userService.setCurrentUser(data);
          localStorage.setItem('usuario', JSON.stringify(this.userService.getCurrentUser()));
          if (data.tipo_usuario === 'alumno') {
            this.router.navigate(['/alumno']);
          } else if (data.tipo_usuario === 'profesor') {
            this.router.navigate(['/profesor']);
          }
          this.username = '';
          this.password = '';
        } else {
          console.log('Contraseña incorrecta');
          this.tipoError = 'Error al iniciar sesión.';
          this.mensajeError = 'La contraseña no es correcta, intentelo nuevamente.'
          this.showAlert();
        }
      } else {
        console.log('Usuario no encontrado');
        this.tipoError = 'Error al iniciar sesión.';
        this.mensajeError = 'Usuario no encontrado, intentelo nuevamente.'
        this.showAlert();
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      this.tipoError = 'Error al iniciar sesión.';
      this.mensajeError = 'Ocurrió un error al iniciar sesión.';
      this.showAlert();
    }
  }

  passwordRecovery(): void {
    this.router.navigate(['/recuperar-contrasena']);
  }

}
