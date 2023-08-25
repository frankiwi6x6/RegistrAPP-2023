import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';


@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.page.html',
  styleUrls: ['./alumno.page.scss'],
})
export class AlumnoPage {

  currentUser: any;

  constructor(private router: Router, private userService: UserService) {
    this.currentUser = this.userService.getCurrentUser();


  }
  escanear():void{
    this.router.navigate(['/escanear']);
  }



  logout(): void {
    console.log('Cerrando sesión');
    this.userService.setCurrentUser(undefined);
    this.router.navigate(['/home']);
  }
}
