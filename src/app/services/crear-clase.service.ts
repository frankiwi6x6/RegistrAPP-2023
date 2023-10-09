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
}
