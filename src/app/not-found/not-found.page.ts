import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.page.html',
  styleUrls: ['./not-found.page.scss'],
})
export class NotFoundPage implements OnInit {
  tipo_usuario: string | null
  userInfo: any = ''
  constructor(
    private router: Router,
    private _user: UserService
  ) { }

  ngOnInit() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser !== null) {
      this.userInfo = JSON.parse(currentUser);
    }else{
      this.userInfo = null
    }
  }
  volverAHome() {

    if (this.userInfo !== null) {
      if (this.userInfo.tipo_usuario === 'alumno') {
        this.router.navigateByUrl('alumno')
      } else {
        this.router.navigateByUrl('profesor')
      }
    } else {
      this.router.navigateByUrl('login')
    }
  }

}
