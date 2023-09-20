import { Injectable } from '@angular/core';
import { supabase } from '../../../supabase.config';

@Injectable({
  providedIn: 'root',
})
export class ProfesorInfoService {
  constructor() {}

  async getProfesorInfo(profesorId: string): Promise<any> {
    try {
      // Obtén la información del profesor
      const { data: profesor, error: profesorError } = await supabase
        .from('profesor')
        .select('*')
        .eq('id_usuario', profesorId)
        .single();

      if (profesorError) {
        console.error('Error al obtener la información del profesor:', profesorError);
        throw profesorError;
      }

      return profesor;
    } catch (error) {
      console.error('Error en el servicio ProfesorInfoService:', error);
      throw error;
    }
  }

  async getSeccionesYAsignaturas(profesorId: string): Promise<any> {
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

      // Obtén las asignaturas relacionadas con las secciones
      const asignaturaIds = secciones.map((seccion) => seccion.id_asignatura);
      const { data: asignaturas, error: asignaturasError } = await supabase
        .from('asignatura')
        .select('*')
        .in('id', asignaturaIds);

      if (asignaturasError) {
        console.error('Error al obtener las asignaturas del profesor:', asignaturasError);
        throw asignaturasError;
      }

      return {
        secciones,
        asignaturas,
      };
    } catch (error) {
      console.error('Error en el servicio ProfesorInfoService:', error);
      throw error;
    }
  }
}