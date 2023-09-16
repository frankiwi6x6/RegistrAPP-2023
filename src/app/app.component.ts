import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() { }

}
export const usuarios = [
  {
    username: 'testAlumno', password: 'password', tipo_usuario: 'alumno',
    first_name: 'Test', last_name: 'User', carrera: 1
  },
  {
    username: 'testProfesor', password: 'password', tipo_usuario: 'profesor',
    first_name: 'Profesor', last_name: 'de prueba',
  },
  {
    username: 'franco', password: 'franco', tipo_usuario: 'profesor',
    first_name: 'Franco', last_name: 'Reyes'
  },
  {
    username: 'ivan', password: 'ivan', tipo_usuario: 'alumno',
    first_name: 'Iván', last_name: 'Díaz', carrera_id: 1
  },];

export const clases = [
  {
    id: 1,
    nombre: 'Programación de aplicaciones móviles',
  },
  {
    id: 2,
    nombre: 'Arquitectura',
  },
  {
    id: 3,
    nombre: 'Calidad de Software',
  },
  {
    id: 4,
    nombre: 'Estadística descriptiva',
  },
  {
    id: 5,
    nombre: 'Inglés Intermedio',
  },
  {
    id: 6,
    nombre: 'Ética profesional',
  },
  {
    id: 7,
    nombre: 'Proceso de portafolio',
  }
]
