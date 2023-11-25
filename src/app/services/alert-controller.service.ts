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
  async showAlert(titulo: string, mensaje: string) {


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
  async mostrarConfirmacion(mensaje: string): Promise<boolean> {
    const alert = await this.alertCtrl.create({
      header: 'Confirmación',
      message: mensaje,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // El usuario canceló la confirmación
            return false;
          },
        },
        {
          text: 'Aceptar',
          handler: () => {
            // El usuario confirmó la acción
            return true;
          },
        },
      ],
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
    return role === 'confirm';
  }


}
