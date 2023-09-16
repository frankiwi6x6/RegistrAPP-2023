import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoadingPagePage } from './loading-page.page';

const routes: Routes = [
  {
    path: '',
    component: LoadingPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoadingPagePageRoutingModule {}
