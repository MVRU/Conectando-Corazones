export interface InstitucionDashboardData {
	info: {
		nombre: string;
		tipo: string;
		fecha: string;
		ubicacion: string;
	};
	metrics: {
		proyectosTotales: number;
		colaboradoresActivos: number;
		diasProximoCierre: number;
	};
	seguimientoObjetivos: {
		id: string;
		nombre: string;
		fechaFin: string;
		objetivos: {
			id: string;
			descripcion: string; // e.g. "Recaudación"
			tipo: 'monetaria' | 'voluntariado' | 'especie';
			progreso: number; // %
			actual: number;
			meta: number;
			unidad: string; // e.g. "$" or "voluntarios"
		}[];
	}[];
	estadisticasAyuda: {
		voluntariado: number;
		monetaria: number;
		especie: number;
		totalBeneficiarios: number;
	};
	topColaboradores: {
		id: string;
		nombre: string;
		avatarUrl?: string; // Optional
		aportes: number;
		rol: string;
	}[];
	actividadReciente: {
		id: string;
		titulo: string;
		descripcion: string;
		fecha: string;
		tipo: 'proyecto' | 'colaboracion' | 'sistema';
	}[];
	ultimasResenas: {
		id: string;
		usuario: string;
		avatarUrl?: string;
		calificacion: number;
		comentario: string;
		fecha: string;
	}[];
	aspectosMejorar: {
		id: string;
		proyecto: string;
		sugerencias: string[];
	}[];
}
