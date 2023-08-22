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

  constructor(private router: Router, private userService: UserService) { }

  login(): void {
    const user = usuarios.find(u => u.username === this.username);

    if (user) {
      if (user.password === this.password) {
        console.log('El usuario es ' + user.tipo_usuario)
        // Guardar el usuario actual en el servicio
        this.userService.setCurrentUser(user);

        if (user.tipo_usuario === 'alumno') {
          // Navegar a la página del alumno
          this.router.navigate(['/alumno']);
        } else if (user.tipo_usuario === 'profesor') {
          // Navegar a la página del profesor
          this.router.navigate(['/profesor']);
        }
        this.username = '';
        this.password = '';
        
      
      } else {
        console.log('Contraseña incorrecta');
      }
    } else {
      console.log('Usuario no encontrado');
    }
  }
}
