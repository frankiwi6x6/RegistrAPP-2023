import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { api_url, DB_PASSWORD } from 'db_info';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  getUserInfo(username: string, password: string): Observable<any> {
    const URL = `${api_url}/usuario?username=eq.${username}&password=eq.${password}`;;
    const headers = new HttpHeaders({
      'apikey': `${DB_PASSWORD}`,
    });
    return this.httpClient.get(URL, { headers }).pipe(
      catchError((error) => {
        console.error('Error:', error);
        return throwError('No se pudo acceder a la base de datos');
      })
    );
  }
  patchUserType(id: number, tipo_usuario: string): Observable<any> {
    const URL = `${api_url}/usuario?id=eq.${id}`;
    const headers = new HttpHeaders({
      'apikey': `${DB_PASSWORD}`,
    });
    const body = {
      tipo_usuario: tipo_usuario
    };
    return this.httpClient.patch(URL, body, { headers }).pipe(
      catchError((error) => {
        console.error('Error:', error);
        return throwError('No se pudo acceder a la base de datos');
      })
    );
  }
  addUser(tabla: string, data: any): Observable<any> {
    const URL = `${api_url}/${tabla}`;
    const headers = new HttpHeaders({
      'apikey': `${DB_PASSWORD}`,
    });

    return this.httpClient.post(URL, data, { headers }).pipe(
      catchError((error) => {
        console.error('Error:', error);
        return throwError('No se pudo acceder a la base de datos');
      })
    );
  }

  register(data: any): Observable<any> {
    const URL = `${api_url}/usuario`;
    const headers = new HttpHeaders({
      'apikey': `${DB_PASSWORD}`,
    });

    return this.httpClient.post(URL, data, { headers }).pipe(
      catchError((error) => {
        console.error('Error:', error);
        return throwError('No se pudo acceder a la base de datos');
      })
    );
  }


}
