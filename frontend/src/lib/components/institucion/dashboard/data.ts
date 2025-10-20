// -*- DECISIÓN DE DISEÑO: Centralizamos el mock de datos para facilitar reemplazos por peticiones reales.
import {
	Bell,
	Briefcase,
	Gauge,
	LayoutGrid,
	Lightbulb,
	LogOut,
	MessageSquare,
	Plus,
	ShieldCheck,
	TrendingUp,	
	Users
} from 'lucide-svelte';

import type {
	AidType,
	ChatItem,
	ChatMetadataMap,
	ChatThread,
	ActiveCollaborator,
	InstitutionIdentity,
	Metric,
	NavItem,
	ObservationItem,
	ProgressSegment,
	ProjectItem,
	CollaborationRequest,
	ReportingStatus,
	VerificationDocument,
	VerificationSummary,
	ViewMode
} from './types';
import { ERROR_COLOR, GREEN, PRIMARY_500, WARNING_COLOR } from './tokens';

export const metrics: Metric[] = [
	{ label: 'Proyectos totales', value: '1', icon: Briefcase, color: PRIMARY_500 },
	{ label: 'Colaboradores totales', value: '0', icon: Users, color: WARNING_COLOR },
	{ label: 'Próx. Finalización', value: '20 días', icon: Gauge, color: ERROR_COLOR }
];

export const navItems: NavItem[] = [
	{ label: 'Mi panel', icon: LayoutGrid, view: 'dashboard' },
	{ label: 'Proyectos', icon: Briefcase, view: 'projects' },
	{ label: 'Mensajes', icon: MessageSquare, view: 'chat' },
	{ label: 'Verificación', icon: ShieldCheck, view: 'profile' }
];

export const quickActionLabels: string[] = [
	'Ver solicitudes',
	'Cargar evidencia',
	'Mis proyectos',
	'Mis chats',
	'Ver progresos',
	'Solicitar cierre'
];

export const chatItems: ChatItem[] = [
	{
		id: 1,
		name: 'Luz para Aprender',
		lastMessage: 'Pendiente de aprobación del presupuesto.',
		time: 'Hace 5m',
		statusColor: ERROR_COLOR,
		isUnread: true
	},
	{
		id: 2,
		name: 'Patio de Colores',
		lastMessage: 'Borrador',
		time: 'Hace 2h',
		statusColor: PRIMARY_500,
		isUnread: false
	}
];

export const chatThreads: ChatThread[] = [
	{
		chatId: 1,
		subject: 'Luz para Aprender',
		messages: [
			{
				id: 101,
				author: 'Mariano · Lumina Cooperativa (Colaborador)',
				content:
					'¡Un gusto, Patricia! Desde Lumina Cooperativa confirmamos la donación de los cables y soportes. Estarán listos para retirar el miércoles por la mañana.',
				sentAt: '2025-11-03T08:30:00-05:00',
				direction: 'incoming'
			},
			{
				id: 102,
				author: 'Clara · Sembrar Futuro (Colaboradora)',
				content:
					'Buenos días, nosotros enviaremos las lámparas LED mañana. Son de bajo consumo y larga duración. Les comparto el comprobante de entrega apenas salga el envío!',
				sentAt: '2025-11-03T08:41:00-05:00',
				direction: 'incoming'
			},
			{
				id: 103,
				author: 'Lucas · Voluntario UTN (Colaborador)',
				content: 'Con Sofía podemos pasar el viernes a la escuela para comenzar la instalación. Si todo está en condiciones, en un día dejamos las tres aulas listas.',
				sentAt: '2025-11-03T08:45:00-05:00',
				direction: 'incoming'
			},
			{
				id: 104,
				author: 'Sofía · Voluntaria UTN (Colaboradora)',
				content: 'Sí, y podemos registrar fotos del antes y después para subir como evidencia al sistema. Así queda trazado todo el proceso!',
				sentAt: '2025-11-03T08:47:00-05:00',
				direction: 'incoming'
			},
			{
				id: 105,
				author: 'Patricia · Escuela Esperanza (Institución)',
				content: 'Mil gracias a todos! ❤️ Los chicos van a estar felices. Apenas finalicen los trabajos, validamos el proyecto en la plataforma.',
				sentAt: '2025-11-03T08:50:00-05:00',
				direction: 'outgoing'
			}
		]
	},
	{
		chatId: 2,
		subject: 'Patio de Colores',
		messages: [
			{
				id: 201,
				author: 'Conectando Corazones (Sistema)',
				content: '¡Este proyecto es un borrador!',
				sentAt: '2025-02-14T15:12:00-05:00',
				direction: 'incoming'
			}
		]
	}
];

export const projectItems: ProjectItem[] = [
	{
		id: 1,
		name: 'Luz para Aprender',
		status: 'En Curso',
		date: '30/10/2025',
		statusColor: GREEN
	},
	{
		id: 2,
		name: 'Patio de Colores',
		status: 'Borrador',
		date: '25/11/2025',
		statusColor: PRIMARY_500
	}
];

export const collaborationRequests: CollaborationRequest[] = [
];

export const activeCollaborators: ActiveCollaborator[] = [
        {
                id: 'active-lumina-cooperativa',
                name: 'Lumina Cooperativa',
                role: 'Mariano Ponce · Empresa eléctrica',
                email: 'alianzas@luminacooperativa.com.ar',
                joinedAt: '03/11/2025',
                contribution:
                        'Instalación del cableado principal y supervisión de soportes en los pabellones A y B conforme a normas IRAM.'
        },
 {
                id: 'active-sembrar-futuro',
                name: 'Sembrar Futuro',
                role: 'Clara Medina · ONG',
                email: 'coordinacion@sembrarfuturo.org',
                joinedAt: '03/11/2025',
                contribution:
                        'Donación de 60 lámparas LED y coordinación del transporte hasta la Escuela Esperanza.'
        },
        {
                id: 'active-lucas-ferreyra',
                name: 'Lucas Ferreyra',
                role: 'Voluntario UTN FRRo · Ing. Eléctrica',
                email: 'lucas.ferreyra@frro.utn.edu.ar',
                joinedAt: '03/11/2025',
                contribution:
                        'Asistencia en tendido interno, pruebas de seguridad y mentoría para el personal de mantenimiento.'
        },
        {
                id: 'active-sofia-mansilla',
                name: 'Sofía Mansilla',
                role: 'Voluntaria UTN FRRo · Ing. Eléctrica',
                email: 'sofia.mansilla@frro.utn.edu.ar',
                joinedAt: '03/11/2025',
                contribution:
                        'Coordinación de instalación de luminarias y talleres básicos de mantenimiento para docentes.'
        }
];



export const luzParaAprenderProgress: ProgressSegment[] = [
	{ label: 'Donación monetaria', percent: 15, grad: 'green' },
	{ label: 'Lámparas LED', percent: 40, grad: 'blue' },
	{ label: 'Electricistas', percent: 80, grad: 'purple' }
];

export const ayudaTypes: AidType[] = [
	{
		label: 'Voluntariado',
		percent: 32,
		grad: 'purple',
		insight: '2 voluntarios activos'
	},
	{
		label: 'Monetaria',
		percent: 33,
		grad: 'green',
		insight: '$50.000 ARS comprometidos'
	},
	{
		label: 'En especie',
		percent: 35,
		grad: 'blue',
		insight: 'Cables y lámparas de luz LED'
	}
];

export const filterLabels = ['Período', 'Categoría', 'Estado', 'Tipo de ayuda', 'Ubicación'];

export const profileHighlights = {
        verification: {
                icon: ShieldCheck,
                title: 'Verificación Exitosa'
        },
        pendingReview: {
                icon: Lightbulb,
                title: 'Aspectos a mejorar'
        },
        logout: LogOut
};

export const callToActionIcon = Plus;
export const notificationIcon = Bell;
export const trendingIcon = TrendingUp;

export const quickActionIcon = LayoutGrid;

export const viewModeLabels: Record<ViewMode, string> = {
	dashboard: 'Mi panel',
	collaborations: 'Colaboraciones',
	projects: 'Proyectos',
	chat: 'Mensajes',
	profile: 'Perfil',
	settings: 'Configuración'
};

export const institutionIdentity: InstitutionIdentity = {
        name: 'Escuela Esperanza',
        registrationId: 'CUIT 30-71234567-4',
        sector: 'Educación primaria',
        location: 'Rosario, Santa Fe, Argentina',
        legalRepresentative: {
                name: 'Patricia González',
                idType: 'DNI',
                idNumber: '23.456.789',
                email: 'patricia.gonzalez@escuelaesperanza.org'
        },
        contactPhone: '+54 9 341 555 1234',
        website: 'https://escuelaesperanza.org'
};

export const verificationSummary: VerificationSummary = {
        status: 'Verificada',
        description:
                'La identidad institucional y del representante legal fueron confirmadas manualmente por el equipo administrador.',
        method: 'Validación manual de documentación oficial',
        lastReview: '12 de octubre de 2025',
        nextReview: '12 de octubre de 2026',
        reviewer: 'Carolina Torres (Administradora de confianza)',
        reliabilityLevel: 'Alta',
        documentsReviewed: 4
};

export const verificationDocuments: VerificationDocument[] = [
        {
                label: 'Acta constitutiva y estatuto actualizado',
                status: 'Aprobado',
                detail: 'Documento firmado y sellado en julio de 2024.'
        },
        {
                label: 'Identificación del representante legal (DNI)',
                status: 'Aprobado',
                detail: 'Fotografía a color verificada manualmente.'
        },
        {
                label: 'Constancia de CUIT',
                status: 'Aprobado',
                detail: 'Número fiscal coincide con la documentación presentada.'
        },
        {
                label: 'Comprobante de domicilio institucional',
                status: 'Aprobado',
                detail: 'Servicio eléctrico emitido en junio de 2025 a nombre de la institución.'
        }
];

export const chatMetadata: ChatMetadataMap = {
	1: {
		chatId: 1,
		institution: {
			id: 'institucion-escuela-esperanza',
			name: 'Escuela Esperanza',
			role: 'Institución',
			kind: 'institucion',
			description: 'Comunidad educativa liderada por Patricia González, directora del plantel.',
			contact: 'Patricia González • Directora'
		},
		collaborators: [
			{
				id: 'colaborador-lumina-cooperativa',
				name: 'Lumina Cooperativa',
				role: 'Colaborador',
				kind: 'empresa',
				description: 'Empresa especialista en soluciones energéticas comunitarias.',
				contact: 'Equipo de proyectos estratégicos'
			},
			{
				id: 'colaborador-sembrar-futuro',
				name: 'Sembrar Futuro',
				role: 'Colaborador',
				kind: 'ong',
				description: 'ONG que dona lámparas LED y acompaña el despliegue comunitario.',
				contact: 'Coordinación de donaciones'
			},
			{
				id: 'voluntario-lucas-utn',
				name: 'Lucas Ferreyra',
				role: 'Colaborador',
				kind: 'voluntario',
				description: 'Estudiante de ingeniería eléctrica de la UTN FRRo.',
				contact: 'Lucas Ferreyra • UTN FRRo'
			},
			{
				id: 'voluntaria-sofia-utn',
				name: 'Sofía Mansilla',
				role: 'Colaborador',
				kind: 'voluntario',
				description: 'Estudiante de ingeniería eléctrica de la UTN FRRo.',
				contact: 'Sofía Mansilla • UTN FRRo'
			}
		],
		attachments: [
			{
				id: 'galeria-escuela-exterior',
				name: 'Fachada actual del colegio',
				category: 'galeria',
				fileType: 'image',
				description: 'Fotografía de la entrada principal antes de la instalación eléctrica.',
				uploadedAt: '2025-02-11'
			},
			{
				id: 'galeria-salon-nocturno',
				name: 'Aula iluminada con lámparas LED',
				category: 'galeria',
				fileType: 'image',
				description: 'Registro fotográfico del piloto nocturno realizado con voluntarios.',
				uploadedAt: '2025-02-16'
			},
			{
				id: 'evidencia-factura-led-001',
				name: 'Factura lámparas LED - febrero',
				category: 'evidencia',
				fileType: 'pdf',
				description: 'Factura emitida por proveedor de luminarias homologadas.',
				uploadedAt: '2025-02-12'
			},
			{
				id: 'evidencia-comprobante-transf-002',
				name: 'Comprobante transferencia Sembrar Futuro',
				category: 'evidencia',
				fileType: 'pdf',
				description: 'Documento que acredita la donación recibida para la compra de materiales.',
				uploadedAt: '2025-02-14'
			}
		]
	}
};

export const adminObservations: ObservationItem[] = [
        {
                message: 'Documentación completa y vigente. Mantener copias digitalizadas con firmas visibles.',
                recordedAt: '12/10/2025 10:45 (GMT-3)',
                type: 'info'
        }
];

export const reportingStatus: ReportingStatus = {
        hasReports: false,
        message: 'Sin reportes ni denuncias de la comunidad. La institución está catalogada como confiable.',
        lastUpdate: '12 de octubre de 2025',
        riskLevel: 'none'
};	

export const filtersResetLabel = 'Limpiar';