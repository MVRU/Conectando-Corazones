import type { Proyecto } from '$lib/types/Proyecto';
import type { TipoParticipacionDescripcion } from '$lib/types/TipoParticipacion';
import { mockCategorias } from '$lib/mocks/mock-categorias';
import { obtenerLocalidadesDisponibles } from '$lib/utils/util-ubicaciones';

/**
 * Composable para gestionar el estado de filtros de proyectos.
 */
export function createProyectosFiltros() {
	// Datos derivados para filtros (constantes)
	const categoriasDisponibles = ['Todas', ...mockCategorias.map((c) => c.descripcion)].sort();

	/**
	 * Calcula las localidades disponibles basadas en los proyectos y provincia seleccionada
	 */
	function calcularLocalidadesDisponibles(
		proyectos: Proyecto[],
		provincia: string
	): string[] {
		return obtenerLocalidadesDisponibles(proyectos, provincia);
	}

	return {
		// Datos derivados
		categoriasDisponibles,
		
		// Funciones de utilidad
		calcularLocalidadesDisponibles
	};
}

/**
 * Valores iniciales para los filtros de proyectos.
 * Útil para resetear filtros o inicializar estado.
 */
export const FILTROS_INICIALES = {
	mostrarFiltros: false,
	filtroParticipacion: 'Todos' as 'Todos' | TipoParticipacionDescripcion,
	categoriaSeleccionada: 'Todas',
	tipoUbicacion: 'Todas' as 'Todas' | 'Presencial' | 'Virtual',
	provinciaSeleccionada: 'Todas',
	localidadSeleccionada: 'Todas',
	fechaDesde: '',
	fechaHasta: '',
	estadoSeleccionado: 'Todos',
	criterioOrden: 'recientes' as 'recientes' | 'antiguos' | 'mayor_progreso' | 'menor_progreso'
};
