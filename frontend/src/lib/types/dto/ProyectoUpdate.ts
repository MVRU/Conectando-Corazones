import type { ParticipacionPermitidaUpdate } from './ParticipacionPermitidaUpdate';
import type { UbicacionExistenteUpdate, UbicacionNuevaCreate } from './UbicacionUpdate';

/**
 * DTO para actualizar un proyecto existente.
 * Solo incluye los campos que pueden ser modificados
 */
export interface ProyectoUpdate {
  id_proyecto: number;
  
  // Campos editables
  descripcion: string;
  url_portada?: string;
  fecha_fin_tentativa: Date; // Solo puede retrasarse, no adelantarse
  beneficiarios?: number; // Solo puede aumentar, nunca disminuir
  
  // Participaciones: objetivos solo pueden aumentar, se pueden agregar nuevas
  participaciones_actualizadas?: ParticipacionPermitidaUpdate[];
  participaciones_nuevas?: ParticipacionPermitidaUpdate[];
  
  // Ubicaciones: solo referencia editable en existentes, se pueden agregar nuevas completas
  ubicaciones_actualizadas?: UbicacionExistenteUpdate[]; // Solo actualiza referencia
  ubicaciones_nuevas?: UbicacionNuevaCreate[]; // Crea ubicación completa
}
