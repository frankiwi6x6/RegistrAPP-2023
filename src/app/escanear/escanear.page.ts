import { Component } from '@angular/core';
import { ZBarOptions, ZBar } from '@ionic-native/zbar/ngx';
@Component({
  selector: 'app-escanear',
  templateUrl: './escanear.page.html',
  styleUrls: ['./escanear.page.scss'],
})
export class EscanearPage {
  optionZbar: any;
  scannedOutput: any;
  constructor(
    private zbarPlugin: ZBar
  ) {
    this.optionZbar = {
      flash: 'off',
      drawSight: false
    }
  }
  barcodeScanner() {
    this.zbarPlugin.scan(this.optionZbar)
      .then(respone => {
        console.log(respone);
        this.scannedOutput = respone;
      })
      .catch(error => {
        alert(error);
      });
  }
}