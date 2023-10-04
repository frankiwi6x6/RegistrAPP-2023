import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DB_PASSWORD, api_url } from 'db_info';

@Injectable({
  providedIn: 'root'
})
export class CrearClaseService {

  constructor(private http: HttpClient) { }

  crearClase(data: any): Observable<any> {
    const tabla = 'clase';
    const url: string = api_url + '/' + tabla;


    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'apikey': DB_PASSWORD
    });

    return this.http.post(url, data, { headers });
  }
}
