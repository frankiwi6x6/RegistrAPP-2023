import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  constructor(
    private alertController: AlertController
  ) { }
  private mostrarError(tipoError: string, mensaje: string) {
    this.alertas.tipoError = tipoError;
    this.alertas.mensajeError = mensaje;
    this.alertas.showAlert();
  }
}
