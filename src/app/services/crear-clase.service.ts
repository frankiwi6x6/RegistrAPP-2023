import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DB_PASSWORD, api_url } from 'db_info';

@Injectable({
  providedIn: 'root'
})
export class CrearClaseService {

  constructor(private http: HttpClient) { }
  tabla: string = 'clase';

  crearClase(data: any): Observable<any> {

    const url: string = api_url + '/' + this.tabla;


    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'apikey': DB_PASSWORD
    });

    return this.http.post(url, data, { headers });
  }

  comprobarClase(id_seccion: string, fecha: string): Observable<any> {
    const url: string = `${api_url}/${this.tabla}?id_seccion=eq.${id_seccion}&fecha=eq.${fecha}`;
    console.log(url);
    const headers = new HttpHeaders({
      'apikey': `${DB_PASSWORD}`,
    });

    return this.http.get(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error:', error);
        return throwError('No se pudo acceder a la base de datos');
      })
    );
  }

  getAlumnosPresentes(id_clase: string, fecha: string): Observable<any> {
    const tabla = 'asistencia';
    const url: string = `${api_url}/${tabla}?select=alumno(nombre,apellido),isPresente&fecha=eq.${fecha}&id_clase=eq.${id_clase}`;
    console.log(url)
    const headers = {
      'apikey': DB_PASSWORD
    };

    return this.http.get(url, { headers });
  }

  postSeguridad(data: any): Observable<any> {
    const tabla = 'clase_seguridad';
    const url: string = `${api_url}/${tabla}`;
    const headers = {
      'Content-Type': 'application/json',
      'apikey': DB_PASSWORD
    };
    return this.http.post(url, data, { headers })
  }

  getSeguridad(id_clase: string, fecha: string): Observable<any> {
    const tabla = 'clase_seguridad';
    const url: string = `${api_url}/${tabla}?select=*&clase_id=eq.${id_clase}&fecha=eq.${fecha}`;
    console.log(url)
    const headers = {
      'apikey': DB_PASSWORD
    };
    return this.http.get(url, { headers });
  }
}
