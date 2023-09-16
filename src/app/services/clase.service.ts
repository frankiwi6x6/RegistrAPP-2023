import { Injectable } from '@angular/core';
import { supabase } from '../../../supabase.config';

@Injectable({
  providedIn: 'root',
})

export class ClaseService {
  constructor() { }

  async getAsignaturasInscritasPorAlumno(alumnoId: string): Promise<any[]> {
    try {
      // 1. Obtén las id_seccion a las que está inscrito el alumno
      const { data: alumnoSecciones, error: alumnoSeccionesError } = await supabase
        .from('alumno_seccion')
        .select('id_seccion')
        .eq('id_alumno', alumnoId);

      if (alumnoSeccionesError) {
        console.error('Error al obtener las secciones inscritas por el alumno:', alumnoSeccionesError);
        throw alumnoSeccionesError;
      }

      // 2. Utiliza las id_seccion para buscar las asignaturas correspondientes en la tabla secciones
      const seccionIds = alumnoSecciones.map((seccion) => seccion.id_seccion);
      const { data: asignaturas, error: asignaturasError } = await supabase
        .from('seccion')
        .select('id_asignatura')
        .in('id', seccionIds);

      if (asignaturasError) {
        console.error('Error al obtener las asignaturas inscritas por el alumno:', asignaturasError);
        throw asignaturasError;
      }

      // 3. Utiliza las asignatura_id para buscar los detalles completos de las asignaturas
      const asignaturaIds = asignaturas.map((seccion) => seccion.id_asignatura);
      const { data: asignaturasCompletas, error: asignaturasCompletasError } = await supabase
        .from('asignatura')
        .select('*')
        .in('id', asignaturaIds);

      if (asignaturasCompletasError) {
        console.error('Error al obtener los detalles de las asignaturas inscritas por el alumno:', asignaturasCompletasError);
        throw asignaturasCompletasError;
      }

      // Retorna las asignaturas completas inscritas por el alumno
      return asignaturasCompletas || [];
    } catch (error) {
      console.error('Error en el servicio ClaseService:', error);
      throw error;
    }
  }
}