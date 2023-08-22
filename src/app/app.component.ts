import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {}
 
}
export const usuarios = [
  {
    username: 'testAlumno',
    password: 'password',
    tipo_usuario: 'alumno',
    first_name: 'Test',
    last_name: 'User'
  },
  {
    username: 'testProfesor',
    password: 'password',
    tipo_usuario: 'profesor',
    first_name: 'Test',
    last_name: 'User'
  }
];
