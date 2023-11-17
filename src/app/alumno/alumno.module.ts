import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AlumnoPageRoutingModule } from './alumno-routing.module';
import { AlumnoPage } from './alumno.page';
import { BarcodeScanningModalComponent } from './scanner/barcode-scaning-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlumnoPageRoutingModule,],
  declarations: [AlumnoPage, BarcodeScanningModalComponent],
})
export class AlumnoPageModule { }
