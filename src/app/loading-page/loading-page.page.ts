import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-loading-page',
  templateUrl: './loading-page.page.html',
  styleUrls: ['./loading-page.page.scss'],
})
export class LoadingPagePage implements OnInit {

  constructor(private router: Router) {
    setTimeout(() => {
      this.router.navigateByUrl('login');
    }, 2000)
  }

  ngOnInit() {
  }

}
