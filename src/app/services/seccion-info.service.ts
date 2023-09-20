import { Injectable } from '@angular/core';
import { supabase } from '../../../supabase.config';

@Injectable({
  providedIn: 'root'
})

export class SeccionInfoService {
  constructor() {}

  async getSeccionesDelProfesor(profesorId: string): Promise<any[]> {
    try {
      // Obtén las secciones relacionadas con el profesor
      const { data: secciones, error: seccionesError } = await supabase
        .from('seccion')
        .select('*')
        .eq('id_profesor', profesorId);

      if (seccionesError) {
        console.error('Error al obtener las secciones del profesor:', seccionesError);
        throw seccionesError;
      }

      return secciones;
    } catch (error) {
      console.error('Error en el servicio SeccionInfoService:', error);
      throw error;
    }
  }
}