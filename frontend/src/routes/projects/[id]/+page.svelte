<script lang="ts">
	import { setBreadcrumbs, BREADCRUMB_ROUTES } from '$lib/stores/breadcrumbs';
	import { mockProyectos } from '$lib/mocks/mock-proyectos';
	import { page } from '$app/stores';
	import { error } from '@sveltejs/kit';

	import ProjectHeader from '$lib/components/projects/ProjectHeader.svelte';
	import DetallesProyecto from '$lib/components/projects/DetallesProyecto.svelte';
	import ProyectoProgreso from '$lib/components/projects/ProyectoProgreso.svelte';
	import type { Proyecto } from '$lib/types/Proyecto';
	import { ESTADO_LABELS } from '$lib/types/Estado';

	let proyecto: Proyecto | null = null;

	$: {
		const id = $page.params.id;
		const encontrado = mockProyectos.find((p) => p.id_proyecto?.toString() === id);

		if (encontrado) {
			proyecto = encontrado;
			setBreadcrumbs([
				BREADCRUMB_ROUTES.home,
				BREADCRUMB_ROUTES.projects,
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

	// * Fechas como objetos Date para evitar conversiones innecesarias

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

	function getColorUrgencia(urgencia: string) {
		return (
			{
				Alta: 'text-red-600 bg-red-100',
				Media: 'text-yellow-600 bg-yellow-100',
				Baja: 'text-green-600 bg-green-100'
			}[urgencia] || 'text-gray-600 bg-gray-100'
		);
	}

	function getColorEstado(estado: string) {
		return (
			{
				Abierto: 'text-green-600 bg-green-100',
				'Próximo a cerrar': 'text-orange-600 bg-orange-100',
				Cerrado: 'text-gray-600 bg-gray-100',
				Completado: 'text-blue-600 bg-blue-100'
			}[estado] || 'text-gray-600 bg-gray-100'
		);
	}

	// Cálculo del estado temporal basado en fechas (igual que en ProyectoCard y ProjectHeader)
	function getEstadoTemporal(proyecto: Proyecto | null): string {
		if (!proyecto) return 'En curso';

		const hoy = new Date();
		const inicio = toDateOrNull(proyecto.created_at);
		const cierre = toDateOrNull(proyecto.fecha_fin_tentativa);

		if (inicio && cierre) {
			if (hoy > cierre) return 'Finalizado';
			if (hoy >= inicio && hoy <= cierre) return 'En ejecución';

			const diff = inicio.getTime() - hoy.getTime();
			const dias = Math.ceil(diff / (1000 * 60 * 60 * 24));
			if (dias <= 0) return 'Hoy comienza';
			if (dias === 1) return 'Comienza mañana';
			if (dias < 7) return `En ${dias} días`;
			const semanas = Math.floor(dias / 7);
			return semanas === 1 ? 'En 1 semana' : `En ${semanas} semanas`;
		}

		return proyecto.estado?.descripcion ? ESTADO_LABELS[proyecto.estado.descripcion] : 'En curso';
	}
</script>

<svelte:head>
	<title>{proyecto?.titulo || 'Proyecto'} - Conectando Corazones</title>
	<meta name="description" content={proyecto?.descripcion || 'Detalle del proyecto'} />
</svelte:head>

{#if proyecto}
	<main class="min-h-screen bg-gray-50 pb-24 pt-10 text-gray-800">
		<div class="animate-fade-up mx-auto w-full max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
			<!-- Header del proyecto -->
			<ProjectHeader {proyecto} {getColorUrgencia} {getColorEstado} />

			<div class="grid grid-cols-1 gap-10 lg:grid-cols-3">
				<!-- Columna principal -->
				<div class="animate-fade-up space-y-10 lg:col-span-2">
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
									{(proyecto.participacion_permitida?.length || 0) === 1
										? 'Participación'
										: 'Participaciones'}
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
									{#each proyecto.participacion_permitida as p}
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
													{p.unidad === 'dinero'
														? `$${(p.actual || 0).toLocaleString('es-AR')} / $${p.objetivo.toLocaleString('es-AR')}`
														: `${p.actual || 0} / ${p.objetivo} ${p.unidad === 'personas' ? 'voluntarios' : p.unidad}`}
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

				<!-- Columna lateral -->
				<div class="animate-fade-up space-y-6" style="animation-delay: 100ms">
					<div class="rounded-xl border border-gray-200 bg-white p-6 shadow">
						<h3 class="mb-4 text-lg font-semibold">Estado del Proyecto</h3>
						<div class="space-y-3">
							<div class="flex items-center justify-between">
								<span class="text-sm text-gray-600">Estado:</span>
								<span
									class="text-sm font-medium {getEstadoTemporal(proyecto) === 'Finalizado'
										? 'text-blue-600'
										: getEstadoTemporal(proyecto) === 'En ejecución'
											? 'text-green-600'
											: 'text-orange-600'}"
								>
									{getEstadoTemporal(proyecto)}
								</span>
							</div>
							<div class="flex items-center justify-between">
								<span class="text-sm text-gray-600">Institución:</span>
								<span class="text-sm font-medium">
									{proyecto.institucion?.nombre_legal || 'N/A'}
								</span>
							</div>
							<div class="flex items-center justify-between">
								<span class="text-sm text-gray-600">Ubicación:</span>
								<span class="text-sm font-medium">
									{proyecto.direccion?.localidad?.nombre || 'N/A'}
								</span>
							</div>
						</div>
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
