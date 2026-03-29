import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, fetch, url }) => {
	// 1. Guard de seguridad: usuario autenticado
	if (!locals.usuario) {
		throw redirect(303, '/iniciar-sesion');
	}

	const esAdmin = locals.usuario.rol === 'administrador';

	// 2. Cargar reportes del servidor con filtros de la URL
	const estadosValidos = ['pendiente', 'verificado', 'desestimado'];
	const estadoParam = url.searchParams.get('estado');
	let estado = '';
	if (estadoParam === null) {
		estado = 'pendiente';
	} else if (estadosValidos.includes(estadoParam)) {
		estado = estadoParam;
	} else if (estadoParam === 'todos') {
		estado = '';
	} else {
		estado = 'pendiente';
	}

	const limitParam = url.searchParams.get('limit') ?? '20';
	const offsetParam = url.searchParams.get('offset') ?? '0';

	const limitNum = parseInt(limitParam);
	const offsetNum = parseInt(offsetParam);

	const limitFinal = isNaN(limitNum) || limitNum <= 0 ? 20 : Math.min(limitNum, 100);
	const offsetFinal = isNaN(offsetNum) || offsetNum < 0 ? 0 : offsetNum;

	// El filtro de tipo_objeto solo lo maneja la UI de admin
	let tipo_objeto = '';
	if (esAdmin) {
		const tiposValidos = ['Usuario', 'Proyecto'];
		const tipoParam = url.searchParams.get('tipo_objeto');
		if (tipoParam === 'todos' || tipoParam === null) {
			tipo_objeto = '';
		} else if (tiposValidos.includes(tipoParam)) {
			tipo_objeto = tipoParam;
		}
	}

	const params = new URLSearchParams({
		limit: limitFinal.toString(),
		offset: offsetFinal.toString()
	});
	if (estado) params.set('estado', estado);
	if (esAdmin && tipo_objeto) params.set('tipo_objeto', tipo_objeto);

	try {
		const res = await fetch(`/api/reportes?${params.toString()}`);
		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			throw new Error(err.error || 'Error al cargar reportes.');
		}
		const result = await res.json();

		return {
			esAdmin,
			reportes: result.data || [],
			total: result.total || 0,
			filtros: {
				estado,
				tipo_objeto: esAdmin ? tipo_objeto : '',
				limit: limitFinal,
				offset: offsetFinal
			}
		};
	} catch (error) {
		console.error('Error cargando reportes en SSR:', error);
		return {
			esAdmin,
			reportes: [],
			total: 0,
			error: error instanceof Error ? error.message : 'No se pudieron cargar los reportes.',
			filtros: {
				estado,
				tipo_objeto: esAdmin ? tipo_objeto : '',
				limit: limitFinal,
				offset: offsetFinal
			}
		};
	}
};
