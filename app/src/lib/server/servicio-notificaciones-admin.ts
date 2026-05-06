import { env } from '$env/dynamic/private';
import { prisma } from '$lib/infrastructure/prisma/client';

type DatosNotificacionAdmin = {
	titulo: string;
	resumen: string;
	detalles: Array<{ etiqueta: string; valor: string }>;
};

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

function normalizarListaCorreos(value: string | undefined): string[] {
	if (!value) return [];
	return value
		.split(',')
		.map((item) => item.trim())
		.filter((item) => item.length > 0);
}

async function obtenerCorreosAdminsDesdeDB(): Promise<string[]> {
	const rows = await prisma.contacto.findMany({
		where: {
			tipo_contacto: 'email',
			usuario: {
				rol: 'administrador',
				estado: { not: 'inactivo' }
			}
		},
		select: { valor: true }
	});

	return [...new Set(rows.map((row) => row.valor.trim()).filter((email) => email.length > 0))];
}

async function obtenerCorreosDestinatarios(): Promise<string[]> {
	const fromEnv = normalizarListaCorreos(env.ADMIN_ALERTS_EMAILS);
	if (fromEnv.length > 0) return fromEnv;
	return obtenerCorreosAdminsDesdeDB();
}

function renderHtml(payload: DatosNotificacionAdmin): string {
	const detalleHtml = payload.detalles
		.map((detalle) => `<li><strong>${detalle.etiqueta}:</strong> ${detalle.valor}</li>`)
		.join('');

	return `
		<div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.5;">
			<h2 style="margin-bottom: 8px;">${payload.titulo}</h2>
			<p style="margin-top: 0;">${payload.resumen}</p>
			<ul>${detalleHtml}</ul>
		</div>
	`;
}

function renderText(payload: DatosNotificacionAdmin): string {
	const detalleText = payload.detalles.map((detalle) => `- ${detalle.etiqueta}: ${detalle.valor}`).join('\n');
	return `${payload.titulo}\n\n${payload.resumen}\n\n${detalleText}`;
}

async function enviarEmail(destinatarios: string[], payload: DatosNotificacionAdmin): Promise<void> {
	const apiKey = env.RESEND_API_KEY;
	const sender = env.ADMIN_ALERTS_EMAIL_FROM || 'Conectando Corazones <onboarding@conectando-corazones.app>';

	if (!apiKey) {
		console.warn('[ServicioNotificacionesAdmin] RESEND_API_KEY no configurada. Se omite envío de email.');
		return;
	}

	if (destinatarios.length === 0) {
		console.warn('[ServicioNotificacionesAdmin] No hay destinatarios administradores para notificar.');
		return;
	}

	const response = await fetch(RESEND_ENDPOINT, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			from: sender,
			to: destinatarios,
			subject: payload.titulo,
			html: renderHtml(payload),
			text: renderText(payload)
		})
	});

	if (!response.ok) {
		const detail = await response.text().catch(() => '');
		throw new Error(`Error enviando email admin (${response.status}): ${detail}`);
	}
}

async function notificar(payload: DatosNotificacionAdmin): Promise<void> {
	try {
		const destinatarios = await obtenerCorreosDestinatarios();
		await enviarEmail(destinatarios, payload);
	} catch (error) {
		console.error('[ServicioNotificacionesAdmin] Falló notificación a admins:', error);
	}
}

export async function notificarSolicitudVerificacionAdmin(input: {
	usuarioId: number;
	username?: string;
	tipoSolicitud: string;
	cantidadArchivos?: number;
}): Promise<void> {
	const panelUrl = env.APP_BASE_URL ? `${env.APP_BASE_URL}/admin` : '/admin';
	await notificar({
		titulo: 'Nueva solicitud de verificación pendiente',
		resumen: 'Una institución cargó documentación y requiere revisión administrativa.',
		detalles: [
			{ etiqueta: 'Usuario ID', valor: String(input.usuarioId) },
			{ etiqueta: 'Username', valor: input.username || 'Sin dato' },
			{ etiqueta: 'Tipo', valor: input.tipoSolicitud },
			{ etiqueta: 'Archivos adjuntos', valor: String(input.cantidadArchivos ?? 0) },
			{ etiqueta: 'Panel de revisión', valor: panelUrl }
		]
	});
}

export async function notificarNuevaCuentaInstitucionAdmin(input: {
	usuarioId: number;
	username?: string;
	email?: string;
}): Promise<void> {
	const panelUrl = env.APP_BASE_URL ? `${env.APP_BASE_URL}/admin` : '/admin';
	await notificar({
		titulo: 'Nueva cuenta institucional registrada',
		resumen: 'Se creó una nueva cuenta de institución y puede requerir gestión administrativa.',
		detalles: [
			{ etiqueta: 'Usuario ID', valor: String(input.usuarioId) },
			{ etiqueta: 'Username', valor: input.username || 'Sin dato' },
			{ etiqueta: 'Email', valor: input.email || 'Sin dato' },
			{ etiqueta: 'Panel de gestión', valor: panelUrl }
		]
	});
}

export async function notificarNuevoReporteAdmin(input: {
	tipoObjeto: 'Usuario' | 'Proyecto';
	idObjeto: number;
	motivo: string;
	reportanteId: number;
	reportanteUsername?: string;
}): Promise<void> {
	const panelUrl = env.APP_BASE_URL ? `${env.APP_BASE_URL}/admin` : '/admin';
	await notificar({
		titulo: `Nuevo reporte sobre ${input.tipoObjeto.toLowerCase()}`,
		resumen: 'Se recibió un nuevo reporte que requiere revisión administrativa.',
		detalles: [
			{ etiqueta: 'Tipo de objeto', valor: input.tipoObjeto },
			{ etiqueta: 'ID objeto reportado', valor: String(input.idObjeto) },
			{ etiqueta: 'Motivo', valor: input.motivo },
			{ etiqueta: 'Reportante ID', valor: String(input.reportanteId) },
			{ etiqueta: 'Reportante', valor: input.reportanteUsername || 'Sin dato' },
			{ etiqueta: 'Panel de reportes', valor: panelUrl }
		]
	});
}

export async function notificarProyectoEnAuditoriaAdmin(input: {
	proyectoId: number;
	tituloProyecto?: string;
	solicitudId: number;
	colaboradorId: number;
	colaboradorUsername?: string;
}): Promise<void> {
	const panelUrl = env.APP_BASE_URL ? `${env.APP_BASE_URL}/admin` : '/admin';
	await notificar({
		titulo: 'Proyecto escalado a auditoría',
		resumen:
			'Un proyecto pasó automáticamente a estado de auditoría tras rechazos en la solicitud de cierre.',
		detalles: [
			{ etiqueta: 'Proyecto ID', valor: String(input.proyectoId) },
			{ etiqueta: 'Proyecto', valor: input.tituloProyecto || 'Sin dato' },
			{ etiqueta: 'Solicitud de cierre ID', valor: String(input.solicitudId) },
			{ etiqueta: 'Colaborador que rechazó', valor: String(input.colaboradorId) },
			{ etiqueta: 'Username colaborador', valor: input.colaboradorUsername || 'Sin dato' },
			{ etiqueta: 'Panel de administración', valor: panelUrl }
		]
	});
}
