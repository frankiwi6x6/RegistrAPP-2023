import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertControllerService {

  tipoError: string = '';
  mensajeError: string = '';
  
  constructor(
    private alertCtrl: AlertController
  ) {


  }
  async showAlert(titulo:string, mensaje: string) {


    await this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: [{
        text: 'Entendido',
        role: 'OK',
        cssClass: 'alertButton',
        handler: () => { }
      }]
    }).then(res => {
      res.present();
    })
  }

}
