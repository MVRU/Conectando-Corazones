<script lang="ts">
	import type { Proyecto } from '$lib/types/Proyecto';
	import type { Colaboracion } from '$lib/types/Colaboracion';
	import type { ParticipacionPermitida } from '$lib/types/ParticipacionPermitida';

	import { setBreadcrumbs, BREADCRUMB_ROUTES } from '$lib/stores/breadcrumbs';
	import { mockProyectos } from '$lib/mocks/mock-proyectos';
	import { page } from '$app/stores';
	import { error } from '@sveltejs/kit';

	import ProyectoHeader from '$lib/components/proyectos/ProyectoHeader.svelte';
	import ProyectoProgreso from '$lib/components/proyectos/ProyectoProgreso.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { getEstadoCodigo, estadoLabel } from '$lib/utils/util-estados';
	import { colaboracionesVisibles, obtenerNombreColaborador } from '$lib/utils/util-colaboraciones';
	import { ordenarPorProgreso } from '$lib/utils/util-progreso';
	import { formatearFecha } from '$lib/utils/validaciones';


	let proyecto: Proyecto;
	let colaboracionesActivas: Colaboracion[] = [];
	let participacionesOrdenadas: ParticipacionPermitida[] = [];

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

	function getColorCirculoEstado(estado: string): string {
		const colores: Record<string, string> = {
			en_curso: 'bg-green-500',
			en_revision: 'bg-yellow-500', 
			completado: 'bg-blue-500',
			cancelado: 'bg-red-500'
		};
		return colores[estado] || 'bg-gray-500';
	}

	$: estadoCodigo = proyecto ? getEstadoCodigo(proyecto.estado, proyecto.estado_id) : 'en_curso';
	$: colorCirculoEstado = getColorCirculoEstado(estadoCodigo);
</script>

<svelte:head>
	<title>{proyecto?.titulo || 'Proyecto'} - Conectando Corazones</title>
	<meta name="description" content={proyecto?.descripcion || 'Detalle del proyecto'} />
</svelte:head>

{#if proyecto}
	<main class="min-h-screen bg-gray-50 py-8">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<!-- 1. Encabezado visual -->
			<div class="mb-8">
				<ProyectoHeader {proyecto} />
			</div>

			<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
				<!-- Contenido principal -->
				<div class="space-y-8 lg:col-span-2">
					<!-- 2. Descripción principal -->
					<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
						<p class="text-lg leading-relaxed text-gray-700">
							{proyecto.descripcion}
						</p>
					</div>

					<!-- 3. Cuatro cards (2 arriba y 2 abajo) -->
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<!-- Personas alcanzadas -->
						<div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
							<div class="flex items-center gap-2">
								<span class="text-lg">👥</span>
								<h3 class="text-sm font-medium text-gray-600">Personas alcanzadas</h3>
							</div>
							<p class="mt-2 text-lg font-semibold text-gray-900">
								{proyecto.participacion_permitida?.reduce((total, p) => {
									if (p.unidad_medida === 'personas') {
										return total + (p.actual || 0);
									}
									return total;
								}, 0) || 0}
							</p>
							<p class="mt-1 text-sm text-gray-500">aprox.</p>
						</div>

						<!-- Categoría -->
						<div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
							<div class="flex items-center gap-2">
								<span class="text-lg">🏷️</span>
								<h3 class="text-sm font-medium text-gray-600">Categoría</h3>
							</div>
							<p class="mt-2 text-lg font-semibold text-gray-900">
								{proyecto.categorias?.[0]?.descripcion || 'Sin categoría'}
							</p>
						</div>

						<!-- Fecha de inicio -->
						<div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
							<div class="flex items-center gap-2">
								<span class="text-lg">📅</span>
								<h3 class="text-sm font-medium text-gray-600">Fecha de inicio</h3>
							</div>
							<p class="mt-2 text-lg font-semibold text-gray-900">
								{proyecto.created_at ? formatearFecha(proyecto.created_at) : 'No definida'}
							</p>
						</div>

						<!-- Fecha de cierre tentativa -->
						<div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
							<div class="flex items-center gap-2">
								<span class="text-lg">⏰</span>
								<h3 class="text-sm font-medium text-gray-600">Fecha de cierre tentativa</h3>
							</div>
							<p class="mt-2 text-lg font-semibold text-gray-900">
								{proyecto.fecha_fin_tentativa ? formatearFecha(proyecto.fecha_fin_tentativa) : 'No definida'}
							</p>
						</div>
					</div>

					<!-- 4. Progreso y Objetivos: Tarjeta unificada -->
					<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
						<!-- Progreso General -->
						<div class="mb-6">
							<h3 class="mb-3 text-lg font-medium text-gray-800">Progreso General</h3>
							<ProyectoProgreso {proyecto} variant="extended" />
						</div>

						<!-- Objetivos Específicos -->
						<div>
							<h3 class="mb-4 text-lg font-medium text-gray-800">Objetivos Específicos</h3>
							{#if proyecto.participacion_permitida?.length}
								<ul class="space-y-3">
									{#each participacionesOrdenadas as p (p.id_participacion_permitida)}
										{@const porcentaje = Math.round(((p.actual || 0) / p.objetivo) * 100)}
										<li class="flex items-start gap-3 rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50">
											<span class="text-lg">
												{#if calcularEstadoObjetivo(p.actual || 0, p.objetivo) === 'completo'}
													✅
												{:else if calcularEstadoObjetivo(p.actual || 0, p.objetivo) === 'parcial'}
													⏳
												{:else}
													📦
												{/if}
											</span>
											
											<div class="flex-1">
												<p class="font-medium text-gray-800">
													{#if p.unidad_medida === 'dinero'}
														${(p.actual || 0).toLocaleString('es-AR')} / ${p.objetivo.toLocaleString('es-AR')}
													{:else}
														{p.actual || 0} / {p.objetivo} {p.unidad_medida === 'personas' ? 'voluntarios' : p.unidad_medida}
													{/if}
												</p>
												<p class="text-sm text-gray-600">
													{porcentaje}% alcanzado
												</p>
											</div>
										</li>
									{/each}
								</ul>
							{:else}
								<p class="text-gray-500">No hay objetivos definidos para este proyecto.</p>
							{/if}
						</div>
					</div>
				</div>

				<!-- 5. Sidebar: Información -->
				<div class="lg:col-span-1">
					<div class="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg">
						<div class="mb-6 flex items-center gap-2">
							<span class="text-2xl">ℹ️</span>
							<h3 class="text-lg font-bold text-gray-900">Información del Proyecto</h3>
						</div>
						
						<div class="space-y-6">
							<!-- Institución -->
							<div class="relative">
								<div class="mb-2 flex items-center gap-2">
									<span class="text-sm">🏛️</span>
									<h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider">Institución</h4>
								</div>
								<div class="rounded-lg bg-white/70 p-3 shadow-sm border border-gray-100">
									<p class="text-sm font-semibold text-gray-900 leading-relaxed">
										{proyecto.institucion?.nombre_legal || 'No especificada'}
									</p>
								</div>
							</div>

							<!-- Estado -->
							<div class="relative">
								<div class="mb-2 flex items-center gap-2">
									<span class="text-sm">📊</span>
									<h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</h4>
								</div>
								<div class="rounded-lg bg-white/70 p-3 shadow-sm border border-gray-100">
									<div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
										<div class="h-3 w-3 rounded-full {colorCirculoEstado} shadow-sm"></div>
										<span class="text-sm font-semibold text-gray-800">
											{estadoLabel(estadoCodigo)}
										</span>
									</div>
								</div>
							</div>

							<!-- Ubicaciones -->
							<div class="relative">
								<div class="mb-3 flex items-center gap-2">
									<span class="text-sm">📍</span>
									<h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider">Ubicaciones</h4>
								</div>
								{#if proyecto.ubicaciones?.length}
									<div class="space-y-3">
										{#each proyecto.ubicaciones as proyectoUbicacion}
											{@const ubicacion = proyectoUbicacion.ubicacion}
											<div class="rounded-lg bg-white/70 p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
												<div class="flex items-start gap-2">
													<span class="text-xs mt-1">
														{#if ubicacion?.modalidad === 'virtual'}
															💻
														{:else}
															🏢
														{/if}
													</span>
													<div class="flex-1">
														<div class="flex items-center gap-2 mb-2">
															<p class="text-sm font-semibold text-gray-900">
																{ubicacion?.tipo_ubicacion || 'Tipo no especificado'}
															</p>
															<span class="px-2 py-1 text-xs font-medium rounded-full {
																ubicacion?.modalidad === 'virtual' 
																	? 'bg-blue-100 text-blue-800' 
																	: 'bg-green-100 text-green-800'
															}">
																{ubicacion?.modalidad || 'modalidad no especificada'}
															</span>
														</div>
														
														{#if ubicacion?.modalidad === 'presencial'}
															<div class="space-y-1 text-xs text-gray-600">
																<p class="flex items-center gap-1">
																	<span class="text-xs">🛣️</span>
																	{ubicacion.calle} {ubicacion.numero}
																</p>
																{#if ubicacion.piso || ubicacion.departamento}
																	<p class="flex items-center gap-1">
																		<span class="text-xs">🏠</span>
																		{#if ubicacion.piso}Piso {ubicacion.piso}{/if}
																		{#if ubicacion.departamento}, Depto {ubicacion.departamento}{/if}
																	</p>
																{/if}
																{#if ubicacion.referencia}
																	<p class="flex items-center gap-1">
																		<span class="text-xs">📍</span>
																		{ubicacion.referencia}
																	</p>
																{/if}
																{#if ubicacion.localidad}
																	<p class="flex items-center gap-1">
																		<span class="text-xs">🏘️</span>
																		{ubicacion.localidad.nombre}
																		{#if ubicacion.localidad.provincia}, {ubicacion.localidad.provincia.nombre}{/if}
																	</p>
																{/if}
																{#if ubicacion.url_google_maps}
																	<p class="flex items-center gap-1">
																		<span class="text-xs">🗺️</span>
																		<a 
																			href={ubicacion.url_google_maps} 
																			target="_blank" 
																			rel="noopener noreferrer"
																			class="text-blue-600 hover:text-blue-800 underline"
																		>
																			Ver en Google Maps
																		</a>
																	</p>
																{/if}
															</div>
														{:else if ubicacion?.modalidad === 'virtual'}
															<div class="space-y-1 text-xs text-gray-600">
																<p class="flex items-center gap-1">
																	<span class="text-xs">🔗</span>
																	<a 
																		href={ubicacion.url_virtual} 
																		target="_blank" 
																		rel="noopener noreferrer"
																		class="text-blue-600 hover:text-blue-800 underline"
																	>
																		Acceder a la reunión virtual
																	</a>
																</p>
															</div>
														{:else}
															<p class="text-xs text-gray-500 italic">Información de ubicación no disponible</p>
														{/if}
													</div>
												</div>
											</div>
										{/each}
									</div>
								{:else}
									<div class="rounded-lg bg-white/70 p-4 shadow-sm border border-gray-100">
										<p class="text-sm text-gray-500 italic">No hay ubicaciones especificadas</p>
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Botones de acción -->
			<div class="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
				<Button
					label="← Volver a Proyectos"
					href="/proyectos"
					variant="secondary"
					size="md"
					customClass="px-8 py-3 text-base font-medium transition-all hover:scale-105"
				/>
				<Button
					label="Colaborar Ahora"
					href={`/proyectos/${proyecto.id_proyecto}#colaborar`}
					variant="primary"
					size="md"
					disabled={estadoCodigo !== 'en_curso'}
					customClass="px-8 py-3 text-base font-bold bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-400 hover:to-blue-400 transition-all hover:scale-105"
				/>
			</div>
		</div>
	</main>
{:else}
	<main class="min-h-screen bg-gray-50 py-8">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-center">
				<p class="text-gray-500">Cargando proyecto...</p>
			</div>
		</div>
	</main>
{/if}
