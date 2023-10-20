import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DB_PASSWORD, api_url } from 'db_info';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {

  constructor(
    private http: HttpClient
  ) { }
  postSeguridad(data: any): Observable<any> {
    const tabla = 'clase_seguridad';
    const url: string = `${api_url}/${tabla}`;
    const headers = {
      'Content-Type': 'application/json',
      'apikey': DB_PASSWORD
    };
    return this.http.post(url, data, { headers })
  }

  getSeguridad(id_clase: string): Observable<any> {
    const tabla = 'clase_seguridad';
    const url: string = `${api_url}/${tabla}?select=*&clase_id=eq.${id_clase}`;
    console.log(url)
    const headers = {
      'apikey': DB_PASSWORD
    };
    return this.http.get(url, { headers });
  }

  patchSeguridad(codigoSeguridad: number, id_clase: string): Observable<any> {
    const tabla = 'clase_seguridad';
    const url: string = `${api_url}/${tabla}?select=*&clase_id=eq.${id_clase}`;
    const headers = {
      'Content-Type': 'application/json',
      'apikey': DB_PASSWORD
    };
    const data = {
      codigo: codigoSeguridad
    }
    return this.http.patch(url, data, { headers })
  }
}
