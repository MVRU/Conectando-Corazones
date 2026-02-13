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
		username: string;
		rol: string;
		avatarUrl: string;
		aportes: string;
		proyectos: number;
	}[];
}

export interface InstitucionDashboardData {
	info: {
		nombre: string;
		tipo: string;
		fecha: string;
		ubicacion: string;
		estaVerificado: boolean;
		bio?: string;
	};
	metricas: {
		proyectosTotales: number;
		colaboradoresActivos: number;
		diasProximoCierre: number;
		solicitudesPendientes: number;
		mensajesNoLeidos: number;
		proyectosPendienteCierre: number;
		estadisticasColaboradores?: EstadisticasColaboradores;
		estadisticasProyectos?: EstadisticasProyectos;
		estadisticasCalendario?: EstadisticasCalendario;
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
		voluntariado: number;
		monetaria: number;
		especie: number;
		totalBeneficiarios: number;
	};
	topColaboradores: {
		id: string;
		nombre: string;
		username: string;
		avatarUrl?: string; // opcional
		aportes: number;
		rol: string;
	}[];
	actividadReciente: {
		id: string;
		titulo: string;
		descripcion: string;
		fecha: string;
		tipo: 'proyecto' | 'colaboracion' | 'evidencia';
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
