<script lang="ts">
	import type { Proyecto } from '$lib/types/Proyecto';
	import type { EstadoDescripcion } from '$lib/types/Estado';
	import type { Colaboracion } from '$lib/types/Colaboracion';
	import type { ParticipacionPermitida } from '$lib/types/ParticipacionPermitida';

	import { setBreadcrumbs, BREADCRUMB_ROUTES } from '$lib/stores/breadcrumbs';
	import { mockProyectos } from '$lib/mocks/mock-proyectos';
	import { page } from '$app/stores';
	import { error } from '@sveltejs/kit';

	import ProyectoHeader from '$lib/components/proyectos/ProyectoHeader.svelte';
	import DetallesProyecto from '$lib/components/proyectos/DetallesProyecto.svelte';
	import ProyectoProgreso from '$lib/components/proyectos/ProyectoProgreso.svelte';
	import { getEstadoCodigo, estadoLabel } from '$lib/utils/util-estados';
	import { getProvinciaFromLocalidad } from '$lib/utils/util-ubicaciones';
	import { getUbicacionPrincipal } from '$lib/utils/util-proyectos';
	import { colaboracionesVisibles, obtenerNombreColaborador } from '$lib/utils/util-colaboraciones';
	import { ordenarPorProgreso } from '$lib/utils/util-progreso';
	import { getUbicacionTexto } from '$lib/utils/util-proyectos';

	let proyecto: Proyecto;
	let provinciaNombre: string = 'Provincia';
	let ubicacionPrincipal: ReturnType<typeof getUbicacionPrincipal>;
	let colaboracionesActivas: Colaboracion[] = [];
	let participacionesOrdenadas: ParticipacionPermitida[] = [];

	$: ubicacionPrincipal = proyecto ? getUbicacionPrincipal(proyecto) : undefined;
	$: provinciaNombre =
		getProvinciaFromLocalidad(ubicacionPrincipal?.direccion?.localidad)?.nombre ?? 'Provincia';
	$: colaboracionesActivas = colaboracionesVisibles(proyecto?.colaboraciones ?? []);
	$: participacionesOrdenadas = ordenarPorProgreso(proyecto?.participacion_permitida ?? []);

	$: {
		const id = $page.params.id;
		const encontrado = mockProyectos.find((p) => p.id_proyecto?.toString() === id);

		if (encontrado) {
			proyecto = encontrado;
			setBreadcrumbs([
				BREADCRUMB_ROUTES.home,
				BREADCRUMB_ROUTES.proyectos,
				{ label: proyecto.titulo }
			]);
		} else {
			throw error(404, 'Proyecto no encontrado');
		}
	}

	function calcularEstadoObjetivo(
		actual: number,
		objetivo: number
	): 'completo' | 'parcial' | 'pendiente' {
		if (actual >= objetivo) return 'completo';
		if (actual > 0) return 'parcial';
		return 'pendiente';
	}

	// -*- Helper para normalizar fechas // TODO: pasar a archivo utils
	function toDateOrNull(fecha: string | Date | undefined | null): Date | null {
		if (!fecha) return null;
		if (fecha instanceof Date) return isNaN(fecha.getTime()) ? null : fecha;
		const d = new Date(fecha);
		return isNaN(d.getTime()) ? null : d;
	}

	function diasRestantes(fechaFin: string | Date | undefined): number {
		const fin = toDateOrNull(fechaFin);
		if (!fin) return 0;
		const hoy = new Date();
		const diferencia = fin.getTime() - hoy.getTime();
		return Math.max(Math.ceil(diferencia / (1000 * 60 * 60 * 24)), 0);
	}

	function formatearFecha(fecha: string | Date | undefined): string {
		const d = toDateOrNull(fecha);
		if (!d) return 'Fecha no disponible';
		return d.toLocaleDateString('es-ES', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function getColorEstado(estado: EstadoDescripcion) {
		return (
			{
				en_curso: 'text-green-600 bg-green-100',
				pendiente_solicitud_cierre: 'text-orange-600 bg-orange-100',
				en_revision: 'text-gray-600 bg-gray-100',
				en_auditoria: 'text-gray-600 bg-gray-100',
				completado: 'text-blue-600 bg-blue-100',
				cancelado: 'text-gray-600 bg-gray-100'
			}[estado] || 'text-gray-600 bg-gray-100'
		);
	}

	$: estadoCodigo = proyecto ? getEstadoCodigo(proyecto.estado, proyecto.estado_id) : 'en_curso';
	$: colorEstado = getColorEstado(estadoCodigo);
</script>

<svelte:head>
	<title>{proyecto?.titulo || 'Proyecto'} - Conectando Corazones</title>
	<meta name="description" content={proyecto?.descripcion || 'Detalle del proyecto'} />
</svelte:head>

{#if proyecto}
	<main class="min-h-screen bg-gray-50 pb-24 pt-10 text-gray-800">
		<div class="animate-fade-up mx-auto w-full max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
			<!-- Header del proyecto -->
			<ProyectoHeader {proyecto} {getColorEstado} />

			<div class="grid grid-cols-1 gap-10 lg:grid-cols-3">
				<!-- Columna principal -->
				<div class="animate-fade-up order-2 space-y-10 lg:order-1 lg:col-span-2">
					<!-- Progreso del proyecto -->
					<section
						class="rounded-xl border border-gray-200 bg-white p-6 shadow transition-shadow hover:shadow-lg"
					>
						<h2 class="mb-4 text-2xl font-semibold">Progreso del Proyecto</h2>
						<ProyectoProgreso {proyecto} variant="extended" />

						<div class="mt-8">
							<h3
								class="mb-4 flex flex-wrap items-center justify-between text-lg font-medium text-gray-900"
							>
								<span>
									{(proyecto.participacion_permitida?.length || 0) === 1 ? 'Objetivo' : 'Objetivos'}
								</span>
								<div class="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-600 md:mt-0">
									{#if proyecto.created_at}
										<div class="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5">
											<svg
												class="h-4 w-4 text-gray-600"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
											<span class="text-xs font-medium text-gray-700">
												Inicio: {formatearFecha(proyecto.created_at)}
											</span>
										</div>
									{/if}
									{#if proyecto.fecha_fin_tentativa}
										<div class="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5">
											<svg
												class="h-4 w-4 text-gray-600"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
											<span class="text-xs font-medium text-gray-700">
												Finaliza: {formatearFecha(proyecto.fecha_fin_tentativa)}
											</span>
										</div>
										<div class="rounded-full bg-blue-50 px-3 py-1.5">
											<span class="text-xs font-semibold text-blue-700">
												{diasRestantes(proyecto.fecha_fin_tentativa)} días restantes
											</span>
										</div>
									{/if}
								</div>
							</h3>

							{#if proyecto.participacion_permitida?.length}
								<ul class="space-y-4">
									{#each participacionesOrdenadas as p (p.id_participacion_permitida)}
										{@const porcentaje = Math.round(((p.actual || 0) / p.objetivo) * 100)}
										<li
											class="flex items-start gap-4 rounded-xl border border-gray-100 p-5 shadow-sm transition hover:border-gray-200"
										>
											<!-- Ícono -->
											<div class="flex-shrink-0">
												{#if calcularEstadoObjetivo(p.actual || 0, p.objetivo) === 'completo'}
													<div
														class="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700"
													>
														✅
													</div>
												{:else if calcularEstadoObjetivo(p.actual || 0, p.objetivo) === 'parcial'}
													<div
														class="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-700"
													>
														⏳
													</div>
												{:else}
													<div
														class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500"
													>
														📦
													</div>
												{/if}
											</div>

											<!-- Contenido -->
											<div class="flex w-full flex-col">
												<p class="font-medium text-gray-800">
													{p.unidad_medida === 'dinero'
														? `$${(p.actual || 0).toLocaleString('es-AR')} / $${p.objetivo.toLocaleString('es-AR')}`
														: `${p.actual || 0} / ${p.objetivo} ${p.unidad_medida === 'personas' ? 'voluntarios' : p.unidad_medida}`}
												</p>
												<div class="mt-1 flex justify-between text-xs text-gray-500">
													<span>{porcentaje}% alcanzado</span>
												</div>
											</div>
										</li>
									{/each}
								</ul>
							{:else}
								<p class="text-sm text-gray-500">
									No hay participaciones definidas para este proyecto.
								</p>
							{/if}
						</div>
					</section>

					<!-- Detalles del proyecto -->
					<section
						class="rounded-xl border border-gray-200 bg-white p-6 shadow transition-shadow hover:shadow-lg"
					>
						<DetallesProyecto {proyecto} {formatearFecha} />
					</section>
				</div>

				<!-- Columna Lateral -->
				<div class="animate-fade-up order-1 space-y-6 lg:order-2" style="animation-delay: 100ms">
					<div class="rounded-xl border border-gray-200 bg-white p-6 shadow">
						<h3 class="mb-5 text-lg font-semibold text-gray-900">Información</h3>
						<div class="space-y-4">
							<div class="flex justify-between border-b border-gray-100 pb-3">
								<span class="text-sm text-gray-600">Estado</span>
								<span
									class={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${colorEstado}`}
								>
									<svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
										<circle cx="10" cy="10" r="8" />
									</svg>
									{estadoLabel(estadoCodigo)}
								</span>
							</div>
							<div class="flex justify-between border-b border-gray-100 pb-3">
								<span class="text-sm text-gray-600">Institución</span>
								<span class="text-sm font-medium text-gray-800">
									{proyecto.institucion?.nombre_legal || 'N/A'}
								</span>
							</div>
							<div class="flex justify-between">
								<span class="text-sm text-gray-600">Ubicación</span>
								<span class="text-sm font-medium text-gray-800">
									{getUbicacionTexto(proyecto)}
								</span>
							</div>
						</div>
					</div>

					<!-- Colaboradores -->
					<div class="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100">
						<h3 class="mb-5 text-lg font-semibold text-gray-900">Solicitudes de colaboración</h3>
						{#if colaboracionesActivas.length}
							<ul class="space-y-3">
								{#each colaboracionesActivas as colab (colab.id_colaboracion)}
									<li class="flex justify-between border-b border-gray-100 pb-2 last:border-b-0">
										<span class="text-sm text-gray-700">
											{obtenerNombreColaborador(colab.colaborador)}
										</span>
										<span
											class={`text-xs font-semibold ${
												colab.estado === 'aprobada'
													? 'bg-emerald-50 text-emerald-600'
													: 'bg-amber-50 text-amber-600'
											} rounded-full px-2.5 py-1`}
										>
											{colab.estado === 'aprobada' ? 'Aprobada' : 'Pendiente'}
										</span>
									</li>
								{/each}
							</ul>
						{:else}
							<p class="text-sm text-gray-500">No hay colaboradores activos.</p>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</main>
{:else}
	<main class="min-h-screen bg-gray-50 pb-24 pt-10 text-gray-800">
		<div class="mx-auto w-full max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
			<p>Cargando proyecto...</p>
		</div>
	</main>
{/if}

<style>
	@keyframes fade-up {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-up {
		animation: fade-up 0.5s ease-out both;
	}
</style>
