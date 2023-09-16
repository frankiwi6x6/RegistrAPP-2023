import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoadingPagePageRoutingModule } from './loading-page-routing.module';

import { LoadingPagePage } from './loading-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadingPagePageRoutingModule
  ],
  declarations: [LoadingPagePage]
})
export class LoadingPagePageModule {}
