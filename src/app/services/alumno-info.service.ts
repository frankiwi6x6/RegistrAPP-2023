import { Injectable } from '@angular/core';
import { api_url, DB_PASSWORD } from 'db_info';

@Injectable({
  providedIn: 'root',
})
export class AlumnoInfoService {
  constructor() { }

  getAlumnoInfo(id: string) {

    return fetch(api_url + '/alumno?id_usuario=eq.' + id, {
      method: 'GET',
      headers: {
        'apikey': `${DB_PASSWORD}` // Aquí se agrega la API key en la cabecera
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('No se pudo acceder a la base de datos');
        }
        return response.json();
      })
      .then(data => {
        // Aquí puedes trabajar con los datos de la base de datos
        return data;
      })
      .catch(error => {
        console.error('Error:', error);
        throw error;
      });
  }
}
