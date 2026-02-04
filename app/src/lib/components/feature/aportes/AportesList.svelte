<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import Badge from '$lib/components/ui/elementos/Badge.svelte';
	import {
		User,
		ChevronDown,
		ChevronLeft,
		ChevronUp,
		Eye,
		AlertCircle,
		Package,
		CircleDollarSign,
		Users
	} from 'lucide-svelte';
	import { slide, fade } from 'svelte/transition';
	import ObjetivosProyecto from '$lib/components/feature/proyectos/ObjetivosProyecto.svelte';
	import { goto } from '$app/navigation';
	import type { EstadoDescripcion } from '$lib/domain/types/Estado';
	import { Info } from 'lucide-svelte';
	import { obtenerNombreCompleto } from '$lib/utils/util-usuarios';
	import type { Usuario } from '$lib/domain/types/Usuario';

	let {
		colaboradores,
		participacion_permitida = [],
		estado = 'en_curso',
		evidenciasInstitucion = []
	} = $props<{
		colaboradores: {
			id_usuario: number;
			usuario: Usuario;
			nombre: string;
			tipo_colaborador: string;
			aportes: { cosa: string; cantidad: string; unidad_medida?: string }[];
			evidencias?: any[];
		}[];
		participacion_permitida?: any[];
		estado?: EstadoDescripcion;
		evidenciasInstitucion?: any[];
	}>();

	let esEstadoPermitido = $derived(
		estado === 'en_curso' || estado === 'pendiente_solicitud_cierre'
	);

	let expandedId = $state<number | null>(null);
	const projectId = $page.params.id;

	function toggleColaborador(id: number) {
		expandedId = expandedId === id ? null : id;
	}

	function abrirEvidencias(colaboradorId: number) {
		goto(`/institucion/proyectos/${projectId}/aportes/colaborador/${colaboradorId}`, {
			noScroll: true
		});
	}

	function volver() {
		goto(`/proyectos/${projectId}`);
	}

	let totalAportes = $derived(
		colaboradores.reduce(
			(acc: number, curr: { aportes: string | any[] }) => acc + curr.aportes.length,
			0
		)
	);
</script>

<div class="min-h-screen bg-slate-50/30 pb-10 md:pb-20">
	<div class="mx-auto max-w-7xl px-4 md:px-6" in:fade>
		<!-- Header -->
		<header class="animate-fade-in-up mb-12 pt-6 pb-6 md:mb-16 md:pt-12">
			<div class="flex flex-col items-center">
				<div class="mb-6 flex w-full justify-start md:mb-8">
					<button
						onclick={volver}
						class="rounded-full border border-slate-200 p-2 text-slate-400 shadow-sm transition-all hover:bg-white hover:text-slate-600"
						aria-label="Volver"
					>
						<ChevronLeft size={24} />
					</button>
				</div>

				<div class="text-center">
					<h1 class="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
						Revisar evidencias
					</h1>
					<p class="mx-auto mt-8 max-w-2xl text-lg text-gray-500">
						Revisá el detalle de lo que cada colaborador sumó al proyecto. Es fundamental verificar
						esto antes de rendir cuentas a tu comunidad.
					</p>
				</div>
			</div>
		</header>

		<div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
			<section class="space-y-4 lg:col-span-2">
				<div class="flex items-center justify-between border-b border-slate-200 pb-2">
					<h2 class="text-lg font-bold tracking-tight text-slate-800 md:text-xl">
						Comunidad de apoyo
					</h2>
					<span class="text-[10px] font-bold tracking-widest text-slate-400 uppercase md:text-xs">
						{colaboradores.length} <span class="hidden sm:inline">Colaboradores</span>
					</span>
				</div>

				<div class="grid gap-2 md:gap-3">
					{#if colaboradores.length === 0}
						<div
							class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-16 text-center"
						>
							<div class="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
								<Users size={40} class="text-slate-300" />
							</div>
							<h3 class="mb-2 text-lg font-bold text-slate-800 md:text-xl">
								Aún no hay colaboradores
							</h3>
							<p class="mx-auto mb-8 max-w-md text-slate-500">
								Todavía no se han unido personas a este proyecto. Compartí tu iniciativa para
								empezar a recibir apoyo.
							</p>
						</div>
					{:else}
						{#if totalAportes === 0}
							<div
								class="mb-4 flex items-start gap-4 rounded-xl border border-blue-100 bg-blue-50 p-4 md:p-5"
							>
								<div class="shrink-0 rounded-lg bg-blue-100 p-2 text-blue-600">
									<AlertCircle size={24} />
								</div>
								<div>
									<h3 class="mb-1 text-sm font-bold text-blue-900 md:text-base">
										Sin aportes registrados
									</h3>
									<p class="text-sm leading-relaxed text-blue-700/80">
										Hay personas unidas al proyecto, pero aún no se han registrado aportes
										concretos. Te recomendamos contactar a los colaboradores para coordinar la
										ayuda.
									</p>
								</div>
							</div>
						{/if}

						{#each colaboradores as colab}
							<div
								class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-blue-300 md:rounded-2xl"
							>
								<button
									class="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-slate-50/80 md:gap-4 md:p-5"
									onclick={() => toggleColaborador(colab.id_usuario)}
								>
									<div
										class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 md:h-12 md:w-12 md:rounded-xl"
									>
										<User size={20} class="md:hidden" />
										<User size={24} class="hidden md:block" />
									</div>

									<div class="min-w-0 flex-1">
										<h3 class="truncate text-sm leading-tight font-bold text-slate-900 md:text-lg">
											{obtenerNombreCompleto(colab.usuario)}
										</h3>
										<p class="truncate text-[11px] text-slate-500 md:text-sm">
											{colab.tipo_colaborador}
										</p>
									</div>

									<div class="text-slate-300">
										{#if expandedId === colab.id_usuario}
											<ChevronUp size={20} />
										{:else}
											<ChevronDown size={20} />
										{/if}
									</div>
								</button>

								{#if expandedId === colab.id_usuario}
									<div
										transition:slide={{ duration: 300 }}
										class="border-t border-slate-100 bg-slate-50/50 p-4 md:p-6"
									>
										{#if colab.aportes.length === 0}
											<div class="flex flex-col items-center justify-center px-4 py-8 text-center">
												<div
													class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 md:h-16 md:w-16"
												>
													<AlertCircle size={28} class="text-slate-400" />
												</div>
												<h4 class="mb-1 text-sm font-bold text-slate-700 md:text-base">
													Sin aportes registrados
												</h4>
												<p class="max-w-sm text-xs text-slate-500 md:text-sm">
													Este colaborador aún no realizó ningún aporte al proyecto.
												</p>
											</div>
										{:else}
											<div class="space-y-3 md:space-y-4">
												{#each colab.aportes as aporte}
													<div
														class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm md:p-4"
													>
														<div
															class="shrink-0 rounded-lg bg-blue-50 p-2 text-blue-600 md:rounded-xl md:p-3"
														>
															{#if aporte.cosa
																.toLowerCase()
																.includes('donación') || aporte.cosa.includes('$')}
																<CircleDollarSign size={18} />
															{:else}
																<Package size={18} />
															{/if}
														</div>
														<div class="min-w-0 flex-1">
															<p class="truncate text-sm font-bold text-slate-800 md:text-base">
																{aporte.cosa}
															</p>
															<p class="text-[11px] font-medium text-slate-500 md:text-sm">
																Cantidad: {aporte.cantidad}
																{aporte.unidad_medida}
															</p>
														</div>
													</div>
												{/each}

												<div class="pt-2">
													<button
														class="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-800 active:scale-[0.98] md:text-base"
														onclick={() => abrirEvidencias(colab.id_usuario)}
													>
														<Eye size={18} />
														<span
															>Ver evidencias {colab.evidencias?.length
																? `(${colab.evidencias.length})`
																: ''}</span
														>
													</button>
												</div>
											</div>
										{/if}
									</div>
								{/if}
							</div>
						{/each}
					{/if}
				</div>
			</section>

			<!-- Sidebar de Objetivos -->
			<div class="sticky top-6 hidden lg:col-span-1 lg:block">
				<ObjetivosProyecto {participacion_permitida} />
			</div>
		</div>

		<section
			class="mt-10 overflow-hidden rounded-[1.5rem] border border-white/5 bg-slate-900 shadow-2xl md:mt-16 md:rounded-[2.5rem]"
		>
			<div class="grid items-center md:grid-cols-2">
				<div class="space-y-6 p-6 md:space-y-8 md:p-14">
					<div class="space-y-3 md:space-y-5">
						<div class="hidden md:flex">
							<Badge text="Rendición de cuentas" />
						</div>

						<h2 class="text-2xl leading-tight font-bold tracking-tight text-white md:text-5xl">
							Rendí cuentas y <br class="hidden md:block" /> generá confianza.
						</h2>
						<p class="text-sm leading-relaxed text-slate-400 md:text-lg">
							Subí fotos o recibos. Ayudá a que los colaboradores vean el impacto de su generosidad.
						</p>
					</div>

					<div class="flex flex-col items-stretch gap-4 md:items-start md:gap-6">
						{#if evidenciasInstitucion.length > 0}
							<div class="grid grid-cols-2 gap-2 md:grid-cols-3">
								{#each evidenciasInstitucion.slice(0, 6) as file}
									<a
										href={file.url}
										target="_blank"
										rel="noopener noreferrer"
										class="group relative aspect-square overflow-hidden rounded-lg bg-slate-800"
									>
										{#if file.tipo_mime?.startsWith('image/')}
											<img
												src={file.url}
												alt={file.nombre_original}
												class="h-full w-full object-cover transition-transform group-hover:scale-110"
											/>
										{:else}
											<div class="flex h-full w-full items-center justify-center text-slate-400">
												<Package size={24} />
											</div>
										{/if}
									</a>
								{/each}
								{#if evidenciasInstitucion.length > 6}
									<div
										class="flex items-center justify-center rounded-lg bg-slate-800 text-xs text-slate-400"
									>
										+{evidenciasInstitucion.length - 6} más
									</div>
								{/if}
							</div>
						{/if}

						{#if esEstadoPermitido}
							<Button
								label={evidenciasInstitucion.length > 0
									? 'Subir más evidencias'
									: 'Subir evidencias ahora'}
								variant="ghost"
								href={`/institucion/proyectos/${projectId}/aportes/evidencias/nueva`}
							/>
						{:else}
							<div
								class="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left"
							>
								<div class="shrink-0 rounded-lg bg-white/10 p-2 text-white">
									<Info size={20} />
								</div>
								<div>
									<h4 class="text-xs font-bold text-white md:text-sm">
										Subida de evidencias pausada
									</h4>
									<p class="mt-1 text-xs leading-relaxed text-slate-400">
										El proyecto se encuentra en un estado que no permite cargar nuevas evidencias.
									</p>
								</div>
							</div>
						{/if}

						<div
							class="flex w-full items-center gap-2 border-t border-slate-800 pt-4 text-[10px] leading-snug text-slate-500 italic md:text-sm"
						>
							<AlertCircle size={14} class="flex-shrink-0 text-blue-500/50" />
							<span>Validación necesaria para el cierre oficial.</span>
						</div>
					</div>
				</div>

				<div class="relative h-48 p-4 md:h-full md:min-h-[400px] md:p-10">
					{#if evidenciasInstitucion.length > 0}
						{@const latestImage = evidenciasInstitucion.find((e: any) =>
							e.tipo_mime?.startsWith('image/')
						)}
						{#if latestImage}
							<div
								class="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 md:rounded-3xl"
							>
								<img
									src={latestImage.url}
									alt="Impacto comunitario"
									class="h-full w-full object-cover opacity-80 transition-opacity hover:opacity-100"
								/>
								<div
									class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:from-[#0f1029]/80"
								></div>
							</div>
						{:else}
							<div
								class="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 md:rounded-3xl"
							>
								<img
									src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800"
									alt="Impacto comunitario"
									class="h-full w-full object-cover opacity-60 grayscale-[10%] md:opacity-100"
								/>
								<div
									class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:from-[#0f1029]/80"
								></div>
							</div>
						{/if}
					{:else}
						<div
							class="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 md:rounded-3xl"
						>
							<img
								src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800"
								alt="Impacto comunitario"
								class="h-full w-full object-cover opacity-60 grayscale-[10%] md:opacity-100"
							/>
							<div
								class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:from-[#0f1029]/80"
							></div>
						</div>
					{/if}
				</div>
			</div>
		</section>
	</div>
</div>

<style>
	@keyframes fade-in-up {
		from {
			opacity: 0;
			transform: translateY(24px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fade-in-up {
		animation: fade-in-up 0.5s ease-out forwards;
	}
</style>
