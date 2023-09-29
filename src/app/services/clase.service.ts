import { Injectable } from '@angular/core';
import { supabase } from '../../../supabase.config';

@Injectable({
  providedIn: 'root',
})

export class ClaseService {
  constructor() { }

  async getAsignaturasInscritasPorAlumno(alumnoId: string): Promise<any[]> {
    try {
      const { data: alumnoSecciones, error: alumnoSeccionesError } = await supabase
        .from('alumno_seccion')
        .select('id_seccion')
        .eq('id_alumno', alumnoId);

      if (alumnoSeccionesError) {
        console.error('Error al obtener las secciones inscritas por el alumno:', alumnoSeccionesError);
        throw alumnoSeccionesError;
      }

      const seccionIds = alumnoSecciones.map((seccion) => seccion.id_seccion);
      const { data: asignaturas, error: asignaturasError } = await supabase
        .from('seccion')
        .select('id_asignatura')
        .in('id', seccionIds);

      if (asignaturasError) {
        console.error('Error al obtener las asignaturas inscritas por el alumno:', asignaturasError);
        throw asignaturasError;
      }

      const asignaturaIds = asignaturas.map((seccion) => seccion.id_asignatura);
      const { data: asignaturasCompletas, error: asignaturasCompletasError } = await supabase
        .from('asignatura')
        .select('*')
        .in('id', asignaturaIds);

      if (asignaturasCompletasError) {
        console.error('Error al obtener los detalles de las asignaturas inscritas por el alumno:', asignaturasCompletasError);
        throw asignaturasCompletasError;
      }
      return asignaturasCompletas || [];
    } catch (error) {
      console.error('Error en el servicio ClaseService:', error);
      throw error;
    }
  }
}