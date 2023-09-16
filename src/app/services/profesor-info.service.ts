import { Injectable } from '@angular/core';
import { supabase } from '../../../supabase.config';

@Injectable({
  providedIn: 'root'
})
export class ProfesorInfoService {

  constructor() {}

  async getProfesorInfo(userId: string): Promise<any> {
    try {
      
      const { data, error } = await supabase
        .from('profesor')
        .select('id, nombre, apellido, id_usuario, apellido_materno')
        .eq('id_usuario', userId);

      if (error) {
        console.error('Error al obtener la información del profesor:', error);
        throw error;
      }

     
      return data ? data[0] : null;
    } catch (error) {
      console.error('Error en el servicio ProfesorInfoService:', error);
      throw error;
    }
  }
}