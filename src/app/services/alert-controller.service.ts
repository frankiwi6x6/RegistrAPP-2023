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
  async showAlert() {


    await this.alertCtrl.create({
      header: this.tipoError,
      message: this.mensajeError,
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
