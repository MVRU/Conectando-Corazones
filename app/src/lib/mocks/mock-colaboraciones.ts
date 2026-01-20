import type { Colaboracion } from '$lib/types/Colaboracion';
import type { ColaboradorDisyuncion } from '$lib/types/Usuario';
import { mockUsuarios } from '$lib/mocks/mock-usuarios';

const getColaborador = (id: number): ColaboradorDisyuncion | undefined => {
	const usuario = Object.values(mockUsuarios).find((u) => u.id_usuario === id);
	return usuario && usuario.rol === 'colaborador' ? (usuario as ColaboradorDisyuncion) : undefined;
};

export const mockColaboraciones: Colaboracion[] = [
	{
		id_colaboracion: 1,
		estado: 'aprobada',
		created_at: new Date('2025-03-05'),
		proyecto_id: 1,
		colaborador_id: 4,
		colaborador: getColaborador(4)
	},
	{
		id_colaboracion: 2,
		estado: 'pendiente',
		created_at: new Date('2025-03-10'),
		proyecto_id: 1,
		colaborador_id: 5,
		colaborador: getColaborador(5)
	},
	{
		id_colaboracion: 25,
		estado: 'aprobada',
		mensaje:
			'Como empresa nos interesa apoyar iniciativas educativas. Podemos aportar recursos materiales y voluntarios de nuestro equipo.',
		created_at: new Date('2025-03-08'),
		proyecto_id: 1,
		colaborador_id: 7,
		colaborador: getColaborador(7) // empresa_solidaria - Juan Carlos Mendoza
	},
	{
		id_colaboracion: 3,
		estado: 'aprobada',
		created_at: new Date('2025-02-15'),
		proyecto_id: 2,
		colaborador_id: 6,
		colaborador: getColaborador(6)
	},
	{
		id_colaboracion: 4,
		estado: 'aprobada',
		created_at: new Date('2025-01-25'),
		proyecto_id: 3,
		colaborador_id: 7,
		colaborador: getColaborador(7)
	},
	{
		id_colaboracion: 5,
		estado: 'aprobada',
		created_at: new Date('2025-04-05'),
		proyecto_id: 4,
		colaborador_id: 8,
		colaborador: getColaborador(8)
	},
	{
		id_colaboracion: 6,
		estado: 'aprobada',
		created_at: new Date('2025-03-20'),
		proyecto_id: 5,
		colaborador_id: 4,
		colaborador: getColaborador(4)
	},
	{
		id_colaboracion: 7,
		estado: 'aprobada',
		created_at: new Date('2025-02-28'),
		proyecto_id: 6,
		colaborador_id: 5,
		colaborador: getColaborador(5)
	},
	{
		id_colaboracion: 8,
		estado: 'aprobada',
		created_at: new Date('2025-05-10'),
		proyecto_id: 7,
		colaborador_id: 6,
		colaborador: getColaborador(6)
	},
	{
		id_colaboracion: 9,
		estado: 'aprobada',
		mensaje:
			'Tengo experiencia en talleres de arte y puedo contribuir con materiales y tiempo para enseñar técnicas de pintura.',
		created_at: new Date('2025-04-20'),
		proyecto_id: 8,
		colaborador_id: 4,
		colaborador: getColaborador(4) // maria_g - Proyecto completado
	},
	{
		id_colaboracion: 10,
		estado: 'aprobada',
		mensaje:
			'Me encantaría colaborar en la biblioteca digital aportando mi experiencia en catalogos y gestión de recursos digitales.',
		created_at: new Date('2024-09-01'),
		proyecto_id: 9,
		colaborador_id: 4,
		colaborador: getColaborador(4) // maria_g - Proyecto completado
	},
	{
		id_colaboracion: 11,
		estado: 'pendiente',
		mensaje:
			'Como biblioteca popular, tenemos muchos libros infantiles que podríamos donar y experiencia organizando actividades de lectura para niños.',
		created_at: new Date('2025-03-10'),
		proyecto_id: 2,
		colaborador_id: 5,
		colaborador: getColaborador(5) // biblioteca_popular
	},
	{
		id_colaboracion: 12,
		estado: 'pendiente',
		mensaje:
			'Nuestra fundación tiene amplia experiencia en proyectos educativos y podemos aportar recursos humanos, materiales didácticos y voluntarios especializados.',
		created_at: new Date('2025-03-12'),
		proyecto_id: 6,
		colaborador_id: 6,
		colaborador: getColaborador(6) // fundacion_manos_unidas
	},
	{
		id_colaboracion: 13,
		estado: 'pendiente',
		mensaje:
			'Como parte de nuestra responsabilidad social empresaria, queremos apoyar la educación infantil con donaciones económicas y voluntarios de nuestro equipo.',
		created_at: new Date('2025-03-13'),
		proyecto_id: 6,
		colaborador_id: 7,
		colaborador: getColaborador(7) // empresa_solidaria_sa
	},
	{
		id_colaboracion: 14,
		estado: 'pendiente',
		mensaje:
			'Soy docente jubilada y me encantaría colaborar con mi experiencia pedagógica. Puedo ayudar con clases de apoyo y actividades recreativas.',
		created_at: new Date('2025-03-14'),
		proyecto_id: 1,
		colaborador_id: 8,
		colaborador: getColaborador(8) // ana_martinez
	},
	{
		id_colaboracion: 15,
		estado: 'pendiente',
		mensaje:
			'Tengo experiencia en trabajo comunitario y me gustaría aportar tiempo de voluntariado los fines de semana para ayudar con las actividades del proyecto.',
		created_at: new Date('2025-03-15'),
		proyecto_id: 1,
		colaborador_id: 4,
		colaborador: getColaborador(4) // maria_gonzalez
	},
	{
		id_colaboracion: 16,
		estado: 'aprobada',
		mensaje:
			'Nuestra fundación tiene amplia experiencia en proyectos educativos y podemos aportar recursos humanos y materiales.',
		created_at: new Date('2025-02-28'),
		proyecto_id: 6,
		colaborador_id: 6,
		colaborador: getColaborador(6) // fundacion_manos_unidas
	},
	{
		id_colaboracion: 17,
		estado: 'pendiente',
		mensaje:
			'Como empresa comprometida con la RSE, queremos apoyar la educación con donaciones y voluntarios corporativos.',
		created_at: new Date('2025-03-16'),
		proyecto_id: 1,
		colaborador_id: 7,
		colaborador: getColaborador(7) // empresa_solidaria_sa
	},
	// Colaboraciones para proyecto 2
	{
		id_colaboracion: 18,
		estado: 'pendiente',
		mensaje:
			'Podemos donar alimentos no perecederos y coordinar jornadas de voluntariado para ayudar con la alimentación.',
		created_at: new Date('2025-03-17'),
		proyecto_id: 2,
		colaborador_id: 7,
		colaborador: getColaborador(7) // empresa_solidaria_sa
	},
	{
		id_colaboracion: 19,
		estado: 'aprobada',
		mensaje: 'Como nutricionista, puedo asesorar sobre alimentación saludable y planificar menús.',
		created_at: new Date('2025-02-20'),
		proyecto_id: 7,
		colaborador_id: 8,
		colaborador: getColaborador(8) // ana_martinez
	},

	{
		id_colaboracion: 20,
		estado: 'rechazada',
		mensaje: 'Quiero ayudar en lo que sea necesario.',
		justificacion:
			'El mensaje es muy genérico y no especifica cómo puede contribuir al proyecto específico.',
		created_at: new Date('2025-03-08'),
		proyecto_id: 1,
		colaborador_id: 4,
		colaborador: getColaborador(4) // maria_gonzalez
	},
	{
		id_colaboracion: 21,
		estado: 'rechazada',
		mensaje: 'Mi empresa puede ayudar con donaciones económicas grandes.',
		justificacion:
			'No cumple con los requisitos de transparencia financiera solicitados en las bases del proyecto.',
		created_at: new Date('2025-03-09'),
		proyecto_id: 1,
		colaborador_id: 7,
		colaborador: getColaborador(7) // empresa_solidaria_sa
	},
	{
		id_colaboracion: 22,
		estado: 'rechazada',
		mensaje: 'Tengo tiempo libre los martes por la tarde.',
		justificacion:
			'La disponibilidad ofrecida no se ajusta a los horarios requeridos por el proyecto.',
		created_at: new Date('2025-03-11'),
		proyecto_id: 2,
		colaborador_id: 8,
		colaborador: getColaborador(8) // ana_martinez
	},
	{
		id_colaboracion: 23,
		estado: 'pendiente',
		mensaje: 'Me encantaría colaborar para reducir la brecha digital.',
		created_at: new Date('2026-01-04'),
		proyecto_id: 12,
		colaborador_id: 4,
		colaborador: getColaborador(4) // maria_g
	},
	{
		id_colaboracion: 24,
		estado: 'rechazada',
		mensaje: 'Quiero ayudar en lo que sea necesario.',
		justificacion:
			'El mensaje es muy genérico y no especifica cómo puede contribuir al proyecto específico.',
		created_at: new Date('2026-01-04'),
		proyecto_id: 19,
		colaborador_id: 4,
		colaborador: getColaborador(4) // maria_g
	},
	{
		id_colaboracion: 25,
		estado: 'aprobada',
		mensaje: 'Colaboración para evaluación de cierre.',
		created_at: new Date('2025-04-01'),
		proyecto_id: 3,
		colaborador_id: 4,
		colaborador: getColaborador(4) // maria_g
	}
];
