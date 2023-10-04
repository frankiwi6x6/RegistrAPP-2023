import { Injectable } from '@angular/core';
import { supabase } from '../../../supabase.config';
import { api_url, DB_PASSWORD } from 'db_info';
@Injectable({
  providedIn: 'root',
})
export class ProfesorInfoService {
  constructor() {}

  getProfesorInfo(id: string) {

    return fetch(api_url + '/profesor?id_usuario=eq.' + id, {
      method: 'GET',
      headers: {
        'apikey': `${DB_PASSWORD}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('No se pudo acceder a la base de datos');
        }
        return response.json();
      })
      .then(data => {
     
        return data;
      })
      .catch(error => {
        console.error('Error:', error);
        throw error;
      });
  }
  async getSeccionesYAsignaturas(profesorId: string): Promise<any> {
    try {

      const { data: secciones, error: seccionesError } = await supabase
        .from('seccion')
        .select('*')
        .eq('id_profesor', profesorId);

      if (seccionesError) {
        console.error('Error al obtener las secciones del profesor:', seccionesError);
        throw seccionesError;
      }

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