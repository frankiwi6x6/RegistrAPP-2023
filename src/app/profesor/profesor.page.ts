// profesor.page.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profesor', // Asegúrate de usar 'app-profesor' como selector
  templateUrl: 'profesor.page.html',
  styleUrls: ['profesor.page.scss']
})
export class ProfesorPage {

  currentUser: any;

  logout():void{
    console.log('Cerrando sesión');
    this.userService.setCurrentUser(undefined);
    this.router.navigate(['/home']);
  }
  constructor(private router: Router, private userService: UserService) { 
    this.currentUser = this.userService.getCurrentUser();
  }
}
