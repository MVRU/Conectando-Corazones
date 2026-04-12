import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ServicioPanelAdmin } from '$lib/server/servicio-panel-admin';

const service = new ServicioPanelAdmin();

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.usuario?.rol !== 'administrador') {
		throw error(403, 'Acceso denegado');
	}

	const [kpis, onboarding, usuarios, auditoria] = await Promise.all([
		service.getKpis(),
		service.getOnboardingPendientes(),
		service.getUsuarios({}),
		service.getAuditoria({ page: 1, pageSize: 100 })
	]);

	return {
		kpis,
		onboarding,
		usuarios,
		logs: auditoria.items,
		auditoriaPaginacion: {
			total: auditoria.total,
			page: auditoria.page,
			pageSize: auditoria.pageSize
		}
	};
};
