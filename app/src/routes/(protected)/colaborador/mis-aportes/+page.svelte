<script lang="ts">
	import { goto } from '$app/navigation';
	import Badge from '$lib/components/ui/elementos/Badge.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { Package, Calendar, FileText } from 'lucide-svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const { evidenciasPorProyecto, totalEvidencias } = data;

	function formatearFecha(fecha: string | Date): string {
		const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
		return new Intl.DateTimeFormat('es-AR', {
			day: '2-digit',
			month: 'long',
			year: 'numeric'
		}).format(date);
	}
</script>

<svelte:head>
	<title>Mis Aportes - Conectando Corazones</title>
</svelte:head>

<div class="absolute inset-0 -z-10 bg-gradient-to-br from-purple-50 via-white to-blue-50"></div>

<main class="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<!-- Header -->
	<div class="mb-8">
		<div class="mb-4 flex items-center gap-3">
			<Button
				label="← Volver"
				variant="ghost"
				size="sm"
				onclick={() => goto('/colaborador/mi-panel')}
			/>
		</div>

		<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
			<div>
				<div class="mb-3 flex items-center gap-3">
					<Badge text="Mis Aportes" />
				</div>
				<h1 class="mb-2 text-4xl font-bold text-gray-900">
					Evidencias de <span class="text-purple-600">Entrada</span>
				</h1>
				<p class="text-gray-600">
					{totalEvidencias} aporte{totalEvidencias !== 1 ? 's' : ''} realizado{totalEvidencias !== 1
						? 's'
						: ''}
				</p>
			</div>
		</div>
	</div>

	<!-- Contenido -->
	{#if evidenciasPorProyecto.length > 0}
		<div class="space-y-8">
			{#each evidenciasPorProyecto as { proyecto, evidencias }}
				<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
					<!-- Header del proyecto -->
					<div class="mb-6">
						<button
							onclick={() => goto(`/proyectos/${proyecto.id_proyecto}`)}
							class="group mb-2 inline-flex items-center gap-2 transition-colors hover:text-blue-600"
						>
							<h2 class="text-2xl font-bold text-gray-900 group-hover:text-blue-600">
								{proyecto.titulo}
							</h2>
							<svg
								class="h-5 w-5 transition-transform group-hover:translate-x-1"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</button>
						<div class="flex items-center gap-2">
							<span
								class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
							>
								{evidencias.length} aporte{evidencias.length !== 1 ? 's' : ''}
							</span>
							<span
								class="inline-flex items-center rounded-full {proyecto.estado.descripcion ===
								'en_curso'
									? 'bg-green-100 text-green-700'
									: 'bg-blue-100 text-blue-700'} px-3 py-1 text-xs font-medium"
							>
								{proyecto.estado.descripcion === 'en_curso' ? 'En curso' : 'Completado'}
							</span>
						</div>
					</div>

					<!-- Listado de evidencias -->
					<div class="space-y-4">
						{#each evidencias as evidencia}
							<div
								class="rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white p-5"
							>
								<div class="mb-3 flex items-start justify-between">
									<div class="flex items-start gap-3">
										<div class="rounded-lg bg-purple-100 p-2">
											<Package class="h-5 w-5 text-purple-600" />
										</div>
										<div>
											<h3 class="font-semibold text-gray-900">
												{evidencia.participacion_permitida.tipo_participacion.descripcion}
											</h3>
											{#if evidencia.participacion_permitida.unidad_medida}
												<p class="text-sm text-gray-600">
													{evidencia.participacion_permitida.unidad_medida}
												</p>
											{/if}
										</div>
									</div>
									<div class="flex items-center gap-2 text-sm text-gray-500">
										<Calendar class="h-4 w-4" />
										<span>{formatearFecha(evidencia.created_at)}</span>
									</div>
								</div>

								<!-- Archivos adjuntos -->
								{#if evidencia.archivos && evidencia.archivos.length > 0}
									<div class="mt-4 rounded-lg bg-white p-4">
										<div class="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
											<FileText class="h-4 w-4" />
											<span>Archivos adjuntos ({evidencia.archivos.length})</span>
										</div>
										<div class="space-y-2">
											{#each evidencia.archivos as archivo}
												<a
													href={archivo.url}
													target="_blank"
													rel="noopener noreferrer"
													class="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 transition-colors hover:border-blue-300 hover:bg-blue-50"
												>
													<svg
														class="h-5 w-5 flex-shrink-0 text-gray-400"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
														/>
													</svg>
													<div class="min-w-0 flex-1">
														<p class="truncate text-sm font-medium text-gray-900">
															{archivo.nombre_original || 'Archivo'}
														</p>
														{#if archivo.descripcion}
															<p class="truncate text-xs text-gray-500">
																{archivo.descripcion}
															</p>
														{/if}
													</div>
													<svg
														class="h-4 w-4 flex-shrink-0 text-gray-400"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
														/>
													</svg>
												</a>
											{/each}
										</div>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<!-- Estado vacío -->
		<div class="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
			<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
				<Package class="h-8 w-8 text-gray-400" />
			</div>
			<h3 class="mb-2 text-xl font-semibold text-gray-900">Aún no has realizado aportes</h3>
			<p class="mb-6 text-gray-600">
				Cuando cargués evidencias de entrada en proyectos, aparecerán acá
			</p>
			<Button
				label="Ver Proyectos"
				variant="primary"
				size="md"
				onclick={() => goto('/proyectos/mis-proyectos')}
			/>
		</div>
	{/if}
</main>
