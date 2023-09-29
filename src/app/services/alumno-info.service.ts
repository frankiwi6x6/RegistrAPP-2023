import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { api_url, DB_PASSWORD } from 'db_info';
@Injectable({
  providedIn: 'root',
})
export class AlumnoInfoService {
  constructor(private http: HttpClient) { }

  getAlumnoInfo(id: string): Observable<any> {
    const url = `${api_url}/alumno?id_usuario=eq.${id}`;
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