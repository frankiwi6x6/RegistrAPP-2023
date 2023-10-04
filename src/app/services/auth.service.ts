import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private logueado = false;

  login() {
    this.logueado = true;
  }

  logout() {
    this.logueado = false;
  }

  isLogueado(): boolean {
    return this.logueado;
  }
}
