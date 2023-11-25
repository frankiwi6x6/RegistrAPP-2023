import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'RegistrAPP',
  webDir: './www', 
  plugins: {
    BarcodeScanner: {
      CAMERA_USAGE_DESCRIPTION: "Permitir acceso a la cámara para escanear códigos QR",
    },
  },
};

export default config;
