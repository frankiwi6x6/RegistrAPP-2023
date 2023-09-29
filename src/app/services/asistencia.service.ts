import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DB_PASSWORD, api_url } from 'db_info';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  constructor(private http: HttpClient) { }

  postAsistencia(id_alumno: number): Observable<any> {
    const tabla = 'asistencia_duplicate';
    const url: string = api_url + '/' + tabla;
    const data = {
      "id_clase": 1,
      "id_alumno": id_alumno // No es necesario usar { id_alumno }
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'apikey': DB_PASSWORD
    });

    return this.http.post(url, data, { headers });
  }
}