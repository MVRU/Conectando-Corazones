export interface EstadisticasProyectos {
	totalDineroRecaudado: number;
	totalBeneficiarios: number;
	promedioProgreso: number;
	proyectosEnAuditoria: {
		id: string;
		titulo: string;
		motivo: string;
		fecha: string;
	}[];
	distribucionEstado: { label: string; count: number; percentage: number; color: string }[];
	distribucionCategoria: { label: string; count: number; percentage: number }[];
	proyectosDestacados: {
		id: string;
		titulo: string;
		estado: string;
		progreso: number;
		beneficiarios: number;
		imagen?: string;
	}[];
}

export interface EstadisticasCalendario {
	verificacion: {
		estado: 'verificada' | 'pendiente' | 'expirado';
		fechaRenovacion: string;
		diasRestantes: number;
	};
	projectTimeline: {
		id: string;
		titulo: string;
		fechaInicio: string;
		fechaFin: string;
		estado: string;
		color: string;
	}[];
	proximosVencimientos: {
		id: string;
		titulo: string;
		fecha: string;
		tipo: 'finalizacion_proyecto' | 'verificacion' | 'otro';
	}[];
}

export interface EstadisticasColaboradores {
	totalActivos: number;
	nuevosEsteMes: number;
	retencion: number;
	distribucionCategorias: { label: string; count: number; percentage: number }[];
	distribucionUbicacion: { label: string; count: number; percentage: number }[];
	topColaboradores: {
		id: string;
		nombre: string;
		rol: string;
		avatarUrl: string;
		aportes: string;
		proyectos: number;
	}[];
}

export interface EstadisticasInstituciones {
	institucionesAyudadas: {
		id: string;
		nombre: string;
		cantidadProyectos: number;
		ranking?: number; // 1, 2, 3 para top 3
	}[];
	colaboraciones: {
		pendientes: number;
		aprobadas: number;
		rechazadas: number;
		total: number;
	};
}

export interface ColaboradorDashboardData {
	info: {
		nombre: string;
		tipo: string;
		fecha: string;
		ubicacion: string;
	};
	metricas: {
		proyectosTotales: number;
		institucionesAlcanzadas: number;
		nuevasInstituciones: number;
		diasProximoCierre: number;
		solicitudesPendientes: number;
		mensajesNoLeidos: number;
		proyectosPendienteCierre: number;
		proyectosParaCierre?: {
			id: string;
			titulo: string;
			fechaFin: string;
			estado: string;
		}[];
		estadisticasColaboradores?: EstadisticasColaboradores;
		estadisticasProyectos?: EstadisticasProyectos;
		estadisticasCalendario?: EstadisticasCalendario;
		estadisticasInstituciones?: EstadisticasInstituciones;
	};
	seguimientoObjetivos: {
		id: string;
		nombre: string;
		fechaFin: string;
		objetivos: {
			id: string;
			descripcion: string; // por ejemplo: "Recaudación"
			tipo: 'monetaria' | 'voluntariado' | 'especie';
			progreso: number; // %
			actual: number;
			meta: number;
			unidad: string; // por ejemplo: "$" o "voluntarios"
		}[];
	}[];
	estadisticasAyuda: {
		voluntariado: number; // Horas totales
		monetaria: number; // Pesos totales
		especie: number; // Unidades totales
		totalProyectos: number;
		distribucion: {
			voluntariado: number; // Cantidad de proyectos
			monetaria: number; // Cantidad de proyectos
			especie: number; // Cantidad de proyectos
		};
	};
	topColaboradores: {
		id: string;
		nombre: string;
		avatarUrl?: string; // opcional
		aportes: number;
		rol: string;
	}[];
	ultimasResenas: {
		id: string;
		usuario: string;
		avatarUrl?: string;
		calificacion: number;
		comentario: string;
		fecha: string;
	}[];
	heatmapActividad: {
		fecha: string;
		intensidad: number;
	}[];
	proyectosComunidad: {
		id: string;
		titulo: string;
		institucion: string;
		categoria: string;
		ubicacion: string;
		coincidencia: number;
		imagen?: string;
	}[];
}
