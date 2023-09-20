import { Injectable } from '@angular/core';
import { supabase } from '../../../supabase.config';

@Injectable({
  providedIn: 'root'
})
export class AsignaturaInfoService {
  constructor() {}

  async getAsignaturasPorIds(asignaturaIds: number[]): Promise<any[]> {
    try {
      // Obtén las asignaturas relacionadas con los IDs proporcionados
      const { data: asignaturas, error: asignaturasError } = await supabase
        .from('asignatura')
        .select('*')
        .in('id', asignaturaIds);

      if (asignaturasError) {
        console.error('Error al obtener las asignaturas:', asignaturasError);
        throw asignaturasError;
      }

      return asignaturas;
    } catch (error) {
      console.error('Error en el servicio AsignaturaInfoService:', error);
      throw error;
    }
  }
}