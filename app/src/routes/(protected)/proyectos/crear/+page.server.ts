import type { PageServerLoad } from './$types';
import { PostgresCategoriaRepository } from '$lib/infrastructure/supabase/postgres/categoria.repo';
import { GetAllCategorias } from '$lib/domain/use-cases/maestros/GetAllCategorias';
import { PostgresTipoParticipacionRepository } from '$lib/infrastructure/supabase/postgres/tipo-participacion.repo';
import { GetAllTiposParticipacion } from '$lib/domain/use-cases/maestros/GetAllTiposParticipacion';
import { prisma } from '$lib/infrastructure/prisma/client';
import { redirect } from '@sveltejs/kit';
import { AuthGuard } from '$lib/infrastructure/auth/AuthGuard';

/**
 * Carga de datos para la creación de proyectos.
 * Requiere rol 'institucion' verificada. La protección base se maneja en hooks.server.ts via AuthGuard.
 */
export const load: PageServerLoad = async ({ locals }) => {
	const usuario = locals.usuario!; // Garantizado por AuthGuard en hooks

	// Verificación adicional de rol (defensa en profundidad)
	if (usuario.rol !== 'institucion') {
		throw redirect(303, AuthGuard.getPanelRedirect(usuario));
	}

	// 2. Instanciar repositorios
	const categoriaRepo = new PostgresCategoriaRepository();
	const tipoRepo = new PostgresTipoParticipacionRepository();

	// 3. Instanciar casos de uso
	const getAllCategorias = new GetAllCategorias(categoriaRepo);
	const getAllTipos = new GetAllTiposParticipacion(tipoRepo);

	// 4. Ejecutar consultas en paralelo
	const [categorias, tiposParticipacion, verificacion, proyectosEnCurso] = await Promise.all([
		getAllCategorias.execute(),
		getAllTipos.execute(),
		prisma.verificacion.findFirst({
			where: { usuario_id: usuario.id_usuario, estado: 'aprobada' },
			orderBy: { created_at: 'desc' }
		}),
		prisma.proyecto.count({
			where: {
				institucion_id: usuario.id_usuario,
				estado: { descripcion: 'en_curso' }
			}
		})
	]);

	return {
		categorias: categorias.map((c) => ({ ...c })),
		tiposParticipacion: tiposParticipacion.map((t) => ({ ...t })),
		estaVerificado: !!verificacion || usuario.estado_verificacion === 'aprobada',
		limiteProyectosAlcanzado: proyectosEnCurso >= 5
	};
};
