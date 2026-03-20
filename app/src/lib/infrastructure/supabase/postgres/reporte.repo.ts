import type { ReporteRepository, ReporteFilters } from '$lib/domain/repositories/ReporteRepository';
import type { MotivoReporte } from '$lib/domain/types/Reporte';
import { Reporte } from '$lib/domain/entities/Reporte';
import { prisma } from '$lib/infrastructure/prisma/client';
import type { Prisma } from '@prisma/client';

type ReporteConRelaciones = Prisma.ReporteGetPayload<{
	include: {
		reportante: { select: { id_usuario: true; username: true; url_foto: true } };
		admin: { select: { id_usuario: true; username: true } };
	};
}>;

export class PostgresReporteRepository implements ReporteRepository {
	private toReporte(raw: ReporteConRelaciones): Reporte {
		return new Reporte({
			id_reporte: raw.id_reporte,
			tipo_objeto: raw.tipo_objeto as 'Usuario' | 'Proyecto',
			id_objeto: raw.id_objeto,
			motivo: raw.motivo as MotivoReporte,
			descripcion: raw.descripcion,
			created_at: raw.created_at || undefined,
			estado: (raw.estado as 'pendiente' | 'verificado' | 'desestimado') ?? 'pendiente',
			fecha_resolucion: raw.fecha_resolucion || undefined,
			comentario_resolucion: raw.comentario_resolucion,
			reportante_id: raw.reportante_id,
			admin_id: raw.admin_id,
			reportante: raw.reportante,
			admin: raw.admin
		});
	}

	async create(reporte: Reporte): Promise<Reporte> {
		const created = await prisma.reporte.create({
			data: {
				tipo_objeto: reporte.tipo_objeto,
				id_objeto: reporte.id_objeto,
				motivo: reporte.motivo,
				descripcion: reporte.descripcion,
				estado: reporte.estado,
				reportante_id: reporte.reportante_id
			},
			include: {
				reportante: { select: { id_usuario: true, username: true, url_foto: true } },
				admin: { select: { id_usuario: true, username: true } }
			}
		});
		return this.toReporte(created);
	}

	async findById(id: number): Promise<Reporte | null> {
		const r = await prisma.reporte.findUnique({
			where: { id_reporte: id },
			include: {
				reportante: { select: { id_usuario: true, username: true, url_foto: true } },
				admin: { select: { id_usuario: true, username: true } }
			}
		});
		return r ? this.toReporte(r) : null;
	}

	async findByReportanteAndObjeto(
		reportante_id: number,
		tipo_objeto: 'Usuario' | 'Proyecto',
		id_objeto: number
	): Promise<Reporte | null> {
		const r = await prisma.reporte.findFirst({
			where: { reportante_id, tipo_objeto, id_objeto }
		});
		if (!r) return null;
		return new Reporte({
			id_reporte: r.id_reporte,
			tipo_objeto: r.tipo_objeto as 'Usuario' | 'Proyecto',
			id_objeto: r.id_objeto,
			motivo: r.motivo as MotivoReporte,
			descripcion: r.descripcion,
			created_at: r.created_at || undefined,
			estado: r.estado as 'pendiente' | 'verificado' | 'desestimado',
			fecha_resolucion: r.fecha_resolucion || undefined,
			comentario_resolucion: r.comentario_resolucion,
			reportante_id: r.reportante_id,
			admin_id: r.admin_id
		});
	}

	async findAll(filters: ReporteFilters = {}): Promise<{ data: Reporte[]; total: number }> {
		const where: Prisma.ReporteWhereInput = {};
		
		if (filters.estado) where.estado = filters.estado;
		if (filters.tipo_objeto) where.tipo_objeto = filters.tipo_objeto;
		if (filters.reportante_id) where.reportante_id = filters.reportante_id;
		if (filters.desde || filters.hasta) {
			where.created_at = {};
			if (filters.desde) (where.created_at as Prisma.DateTimeFilter).gte = filters.desde;
			if (filters.hasta) (where.created_at as Prisma.DateTimeFilter).lte = filters.hasta;
		}

		const [data, total] = await prisma.$transaction([
			prisma.reporte.findMany({
				where,
				include: {
					reportante: { select: { id_usuario: true, username: true, url_foto: true } },
					admin: { select: { id_usuario: true, username: true } }
				},
				orderBy: { created_at: 'desc' },
				skip: filters.offset ?? 0,
				take: filters.limit ?? 20
			}),
			prisma.reporte.count({ where })
		]);

		// Enriquecer con nombres de objetos (Proyectos/Usuarios)
		const proyectoIds = data
			.filter((r) => r.tipo_objeto.toLowerCase() === 'proyecto')
			.map((r) => r.id_objeto);
		const usuarioIds = data
			.filter((r) => r.tipo_objeto.toLowerCase() === 'usuario')
			.map((r) => r.id_objeto);

		const [proyectos, usuarios] = await Promise.all([
			prisma.proyecto.findMany({
				where: { id_proyecto: { in: proyectoIds } },
				select: { id_proyecto: true, titulo: true, url_portada: true }
			}),
			prisma.usuario.findMany({
				where: { id_usuario: { in: usuarioIds } },
				select: { id_usuario: true, username: true, nombre: true, apellido: true, url_foto: true }
			})
		]);

		const nombresMap = new Map<string, string>();
		const imagenesMap = new Map<string, string | null>();

		proyectos.forEach((p) => {
			nombresMap.set(`proyecto:${p.id_proyecto}`, p.titulo);
			imagenesMap.set(`proyecto:${p.id_proyecto}`, p.url_portada ?? null);
		});
		usuarios.forEach((u) => {
			nombresMap.set(`usuario:${u.id_usuario}`, u.username);
			imagenesMap.set(`usuario:${u.id_usuario}`, u.url_foto ?? null);
		});

		return {
			data: data.map((r) => {
				const reporte = this.toReporte(r);
				reporte.nombre_objeto = nombresMap.get(`${r.tipo_objeto.toLowerCase()}:${r.id_objeto}`);
				reporte.imagen_objeto = imagenesMap.get(`${r.tipo_objeto.toLowerCase()}:${r.id_objeto}`) ?? null;
				return reporte;
			}),
			total
		};
	}

	async save(reporte: Reporte): Promise<Reporte> {
		const updated = await prisma.reporte.update({
			where: { id_reporte: reporte.id_reporte! },
			data: {
				estado: reporte.estado,
				admin_id: reporte.admin_id,
				fecha_resolucion: reporte.fecha_resolucion,
				comentario_resolucion: reporte.comentario_resolucion
			},
			include: {
				reportante: { select: { id_usuario: true, username: true, url_foto: true } },
				admin: { select: { id_usuario: true, username: true } }
			}
		});
		return this.toReporte(updated);
	}
}
