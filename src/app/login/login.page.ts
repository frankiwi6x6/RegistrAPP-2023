import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { AuthService } from '../services/auth.service';
import { AlertControllerService } from '../services/alert-controller.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  infoUser: any = null;
  username: string = '';
  password: string = '';


  constructor(
    private router: Router,
    private _user: UsuarioService,
    private _auth: AuthService,
    private alertas: AlertControllerService
  ) { }

  ngOnInit() {
  }


  login() {
    if (this.username === '' || this.password === '') {
      console.log('Debe ingresar un usuario');
      this.mostrarAlerta('Credenciales vacías', 'Debe rellenar los campos de usuario y contraseña');
    }
    if (this.username !== '' && this.password !== '') {
      this._auth.logout();
      console.log('login');
      this._user.getUserInfo(this.username, this.password)
        .subscribe(
          (data) => {
            this.infoUser = data[0];
            console.log(this.infoUser);
            if (this.infoUser === undefined) {
              console.log('Usuario no encontrado');
              this.mostrarAlerta('Usuario no encontrado', 'Verifique su contrañeña y/o usuario');
            } else {
              console.log('Usuario encontrado');
              this._auth.setCurrentUser(this.infoUser);

              if (this.infoUser.tipo_usuario === 'profesor') {
                console.log('Usuario profesor');
                this.router.navigateByUrl(this.infoUser.tipo_usuario);
              } else {
                console.log('Usuario alumno');
                this.router.navigateByUrl(this.infoUser.tipo_usuario);
              }
            }
            this.username = '';
            this.password = '';


          },
          (error) => {
            console.error('Error al obtener información del usuario:', error);
          }
        );
    }

  }
  recuperarContrasenna(): void {
    console.log('recuperarContrasenna');
    this.router.navigateByUrl('recuperar-contrasena');

  }
  private mostrarAlerta(tipoError: string, mensaje: string) {
    this.alertas.tipoError = tipoError;
    this.alertas.mensajeError = mensaje;
    this.alertas.showAlert();
  }
}
