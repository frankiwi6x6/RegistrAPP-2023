import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  "appId": "io.ionic.starter",
  "appName": "ProyectoSemestral",
  "webDir": "www",
  "plugins": {
    "QRScanner": {
      "androidScheme": "https"
    }
  },
  "server": {
    androidScheme: 'https'

  }

};

export default config;
