import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserKey = 'currentUser';

  async setCurrentUser(user: any) {
    const userString = JSON.stringify(user);
    await Preferences.set({ key: this.currentUserKey, value: userString });
  }

  async getCurrentUser(): Promise<any> {
    const { value } = await Preferences.get({ key: this.currentUserKey });
    return value ? JSON.parse(value) : null;
  }

  async logout() {
    await Preferences.remove({ key: this.currentUserKey });
    console.log('Cerrando sesión...');
  }
}