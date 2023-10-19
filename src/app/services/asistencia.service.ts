import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DB_PASSWORD, api_url } from 'db_info';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  constructor(private http: HttpClient) { }

  patchAsistenciaPorFechaYAlumno(id_clase: string, fecha: string, idAlumno: number, data: any): Observable<any> {
    const tabla = 'asistencia';
    const url: string = `${api_url}/${tabla}?fecha=eq.${fecha}&id_alumno=eq.${idAlumno}&id_clase=eq.${id_clase}`;

    const headers = {
      'Content-Type': 'application/json',
      'apikey': DB_PASSWORD
    };

    return this.http.patch(url, data, { headers });
  }

  getAsistenciaPorFechaYAlumno(id_clase: string, fecha: string, idAlumno: number, data: any): Observable<any> {
    const tabla = 'asistencia';
    const url: string = `${api_url}/${tabla}?fecha=eq.${fecha}&id_alumno=eq.${idAlumno}&id_clase=eq.${id_clase}`;

    const headers = {
      'Content-Type': 'application/json',
      'apikey': DB_PASSWORD
    };

    return this.http.get(url, { headers });
  }
  getEstadoAlumno(id_clase: string, idAlumno: number,): Observable<any> {
    const tabla = 'asistencia';
    const url: string = `${api_url}/${tabla}?id_alumno=eq.${idAlumno}&id_clase=eq.${id_clase}&select=isPresente`;

    const headers = {
      'Content-Type': 'application/json',
      'apikey': DB_PASSWORD
    };

    return this.http.get(url, { headers });
  }




}