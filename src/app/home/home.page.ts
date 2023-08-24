import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { usuarios } from '../app.component'; // Cambia la ruta de acuerdo a tu estructura
import { UserService } from '../user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  username: string = '';
  password: string = '';
  mensajeError: string ='';
  error: boolean = true;
  color: string ='';
  
  constructor(private router: Router, private userService: UserService) { }

  login(): void {
    const user = usuarios.find(u => u.username === this.username);
    
    if (user) {
      if (user.password === this.password) {
        
        this.color = 'exitoso';
        console.log('El usuario es ' + user.tipo_usuario)
        this.error = false;
        this.userService.setCurrentUser(user);

        if (user.tipo_usuario === 'alumno') {
          this.router.navigate(['/alumno']);
        } else if (user.tipo_usuario === 'profesor') {
          this.router.navigate(['/profesor']);
        }
        this.username = '';
        this.password = '';
        
      
      } else {
        console.log('Contraseña incorrecta');
        this.error = true;
        this.color = 'error';
        this.mensajeError = 'La contraseña no es correcta, intentelo nuevamente.'
      }
    } else {
      console.log('Usuario no encontrado');
      this.error = true;
      this.color = 'error';
      this.mensajeError = 'Usuario no encontrado, intentelo nuevamente.'
    }
    console.log('El color es: '+ this.color)
  }
}
