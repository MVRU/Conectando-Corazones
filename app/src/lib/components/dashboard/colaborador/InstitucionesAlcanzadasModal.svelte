<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import {
		X,
		Building2,
		TrendingUp,
		Trophy,
		Medal,
		Award,
		CheckCircle2,
		Clock,
		XCircle
	} from 'lucide-svelte';
	import type { EstadisticasInstituciones } from './types';
	import { quintOut } from 'svelte/easing';

	export let show = false;
	export let stats: EstadisticasInstituciones | undefined;
	export let onClose: () => void;

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}

	// Calcular el máximo para escalar las barras
	$: maxProyectos =
		stats?.institucionesAyudadas.reduce((max, inst) => Math.max(max, inst.cantidadProyectos), 0) ||
		1;

	// Función para obtener el icono de ranking
	function getRankingIcon(ranking?: number) {
		if (ranking === 1) return Trophy;
		if (ranking === 2) return Medal;
		if (ranking === 3) return Award;
		return null;
	}

	// Función para obtener el color de ranking
	function getRankingColor(ranking?: number) {
		if (ranking === 1) return 'text-yellow-400'; // Oro
		if (ranking === 2) return 'text-slate-300'; // Plata
		if (ranking === 3) return 'text-amber-600'; // Bronce
		return '';
	}

	// Función para obtener gradiente de barra según ranking
	function getBarGradient(ranking?: number) {
		if (ranking === 1)
			return 'from-yellow-500/80 to-yellow-300/80 hover:from-yellow-400 hover:to-yellow-200';
		if (ranking === 2)
			return 'from-slate-400/80 to-slate-200/80 hover:from-slate-300 hover:to-slate-100';
		if (ranking === 3)
			return 'from-amber-600/80 to-amber-400/80 hover:from-amber-500 hover:to-amber-300';
		return 'from-blue-600/80 to-blue-400/80 hover:from-blue-500 hover:to-blue-300';
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show && stats}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
		role="dialog"
		aria-modal="true"
	>
		<!-- Backdrop -->
		<div
			class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
			in:fade={{ duration: 200 }}
			out:fade={{ duration: 200 }}
			on:click={onClose}
			role="button"
			tabindex="-1"
			on:keydown={(e) => e.key === 'Enter' && onClose()}
		></div>

		<!-- Modal Content -->
		<div
			class="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0F1029] shadow-2xl shadow-slate-900/50"
			in:fly={{ y: 20, duration: 300, easing: quintOut }}
			out:scale={{ start: 1, opacity: 0, duration: 200 }}
		>
			<!-- Header -->
			<div
				class="bg-pattern flex items-center justify-between border-b border-white/5 bg-slate-900/50 px-5 py-4 sm:px-8 sm:py-5"
			>
				<div class="flex items-center gap-3">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-400"
					>
						<Building2 size={20} />
					</div>
					<div>
						<h2 class="text-lg font-bold text-white sm:text-xl">Instituciones alcanzadas</h2>
						<p class="text-xs text-slate-400">Tu impacto en diferentes organizaciones</p>
					</div>
				</div>
				<button
					on:click={onClose}
					class="rounded-full p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
				>
					<X size={20} />
				</button>
			</div>

			<!-- Scrollable Body -->
			<div class="custom-scrollbar flex-1 overflow-y-auto p-5 sm:p-8">
				<!-- Sección 1: Gráfico de Barras - Instituciones Ayudadas -->
				<div class="mb-10">
					<div class="mb-6 flex items-center justify-between">
						<div class="flex items-center gap-2">
							<TrendingUp size={20} class="text-blue-400" />
							<h3 class="text-lg font-bold text-white">Instituciones más ayudadas</h3>
						</div>
						<!-- Legend / Info -->
						<div class="flex items-center gap-4 text-xs text-slate-400">
							<div class="flex items-center gap-1.5">
								<span class="h-2 w-2 rounded-full bg-blue-500"></span>
								Proyectos completados
							</div>
						</div>
					</div>

					<!-- Container Responsive -->
					<!-- Mobile: Muestra Top 3 sin scroll. Desktop: Muestra todos aprovechando espacio -->
					<div class="w-full pt-6 pb-2">
						<!-- Added pt-6 for extra podium space -->
						<div
							class="relative flex h-64 w-full items-end justify-around gap-2 border-b border-white/10 pb-2 sm:justify-between sm:gap-4"
						>
							<!-- Y-Axis Grid Lines (Visual guide) -->
							<div class="absolute inset-0 -z-10 flex flex-col justify-between py-2 opacity-20">
								<div class="h-px w-full border-t border-dashed border-slate-700"></div>
								<div class="h-px w-full border-t border-dashed border-slate-700"></div>
								<div class="h-px w-full border-t border-dashed border-slate-700"></div>
								<div class="h-px w-full border-t border-dashed border-slate-700"></div>
							</div>

							{#each stats.institucionesAyudadas as institucion, index}
								{@const height = (institucion.cantidadProyectos / maxProyectos) * 100}
								{@const isTop3 = institucion.ranking && institucion.ranking <= 3}
								<!-- 
									Column Item 
									Mobile: Hidden if index >= 3 (Show only Top 3)
									Desktop: All visible (md:flex)
								-->
								<div
									class="group flex h-full flex-1 flex-col {index >= 3 ? 'hidden md:flex' : 'flex'}"
								>
									<!-- Chart Area (Flexible height) -->
									<div class="relative flex w-full flex-1 items-end justify-center">
										<!-- Tooltip -->
										<div
											class="pointer-events-none absolute left-1/2 z-30 mb-2 -translate-x-1/2 rounded-lg border border-white/10 bg-slate-900/95 px-3 py-1.5 text-xs whitespace-nowrap text-white opacity-0 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:-translate-y-1 group-hover:opacity-100"
											style="bottom: calc({height}% + {isTop3 ? '55px' : '10px'});"
										>
											<span class="font-bold text-blue-400">{institucion.cantidadProyectos}</span>
											proyecto{institucion.cantidadProyectos !== 1 ? 's' : ''}
											<div
												class="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-r border-b border-white/10 bg-slate-900/95"
											></div>
										</div>

										<!-- Podium Icon -->
										{#if isTop3}
											{@const RankingIcon = getRankingIcon(institucion.ranking)}
											{#if RankingIcon}
												<div
													class="absolute left-1/2 z-20 -translate-x-1/2 transition-transform duration-500 group-hover:scale-110"
													style="bottom: calc({height}% + 12px);"
												>
													<div
														class="flex h-10 w-10 items-center justify-center rounded-full bg-[#0F1029] shadow-[0_0_15px_rgba(0,0,0,0.5)] ring-2 ring-white/10"
													>
														<svelte:component
															this={RankingIcon}
															size={22}
															class="{getRankingColor(institucion.ranking)} drop-shadow-md"
														/>
													</div>
												</div>
											{/if}
										{/if}

										<!-- Bar -->
										<div
											class="w-full max-w-[30px] rounded-t-lg bg-gradient-to-t transition-all duration-700 ease-out hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] sm:max-w-[50px] {getBarGradient(
												institucion.ranking
											)}"
											style="height: {height}%;"
										></div>
									</div>

									<!-- Label Area (Fixed height) -->
									<div class="mt-3 flex h-14 w-full items-start justify-center px-1 text-center">
										<p
											class="line-clamp-3 w-full max-w-[90px] overflow-hidden text-[10px] leading-tight font-medium text-ellipsis text-slate-400 transition-colors group-hover:text-white sm:text-xs"
											title={institucion.nombre}
										>
											{institucion.nombre}
										</p>
									</div>
								</div>
							{/each}
						</div>
					</div>

					<!-- Mobile Footer Note -->
					<div class="mt-2 text-center text-[10px] text-slate-500 md:hidden">
						Mostrando Top 3 instituciones principales
					</div>
				</div>

				<!-- Sección 2: Gráfico de Colaboraciones -->
				<div>
					<div class="mb-6 flex items-center justify-between">
						<div class="flex items-center gap-2">
							<CheckCircle2 size={20} class="text-emerald-400" />
							<h3 class="text-lg font-bold text-white">Estado de colaboraciones</h3>
						</div>
					</div>

					<!-- Grid de Estado -->
					<div class="grid gap-8 md:grid-cols-2">
						<!-- Gráfico Circular (Donut) -->
						<div class="relative flex items-center justify-center py-4">
							<svg viewBox="0 0 36 36" class="h-48 w-48 rotate-[-90deg] drop-shadow-2xl">
								<!-- Circle Background -->
								<path
									class="text-slate-800/50"
									d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
									fill="none"
									stroke="currentColor"
									stroke-width="3"
								/>
								<!-- Segments -->
								{#each [{ value: stats.colaboraciones.aprobadas, color: 'text-emerald-500', offset: 0 }, { value: stats.colaboraciones.pendientes, color: 'text-amber-500', offset: (stats.colaboraciones.aprobadas / stats.colaboraciones.total) * 100 }, { value: stats.colaboraciones.rechazadas, color: 'text-rose-500', offset: ((stats.colaboraciones.aprobadas + stats.colaboraciones.pendientes) / stats.colaboraciones.total) * 100 }] as segment}
									{#if segment.value > 0}
										<path
											class="{segment.color} transition-all duration-1000 ease-out hover:opacity-80"
											stroke-dasharray="{(segment.value / stats.colaboraciones.total) * 100}, 100"
											stroke-dashoffset="-{segment.offset}"
											d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
											fill="none"
											stroke="currentColor"
											stroke-width="3"
											stroke-linecap="round"
										/>
									{/if}
								{/each}
							</svg>
							<!-- Center Text -->
							<div class="absolute text-center">
								<span class="block text-4xl font-bold text-white">{stats.colaboraciones.total}</span
								>
								<span class="text-xs font-medium tracking-wider text-slate-400 uppercase"
									>Total</span
								>
							</div>
						</div>

						<!-- Detalle / Leyenda -->
						<div class="flex flex-col justify-center gap-4">
							<!-- Aprobadas -->
							<div
								class="group flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4 transition-all hover:border-emerald-500/30 hover:bg-white/10"
							>
								<div class="flex items-center gap-3">
									<div class="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
										<CheckCircle2 size={18} />
									</div>
									<div>
										<p class="text-sm font-medium text-slate-300 group-hover:text-emerald-300">
											Aprobadas
										</p>
										<p class="text-xs text-slate-500">Confirmadas</p>
									</div>
								</div>
								<div class="text-right">
									<span
										class="block text-xl font-bold text-white transition-transform group-hover:scale-110"
										>{stats.colaboraciones.aprobadas}</span
									>
									<span class="text-xs font-medium text-emerald-400"
										>{((stats.colaboraciones.aprobadas / stats.colaboraciones.total) * 100).toFixed(
											0
										)}%</span
									>
								</div>
							</div>

							<!-- Pendientes -->
							<div
								class="group flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4 transition-all hover:border-amber-500/30 hover:bg-white/10"
							>
								<div class="flex items-center gap-3">
									<div class="rounded-lg bg-amber-500/10 p-2 text-amber-400">
										<Clock size={18} />
									</div>
									<div>
										<p class="text-sm font-medium text-slate-300 group-hover:text-amber-300">
											Pendientes
										</p>
										<p class="text-xs text-slate-500">En revisión</p>
									</div>
								</div>
								<div class="text-right">
									<span
										class="block text-xl font-bold text-white transition-transform group-hover:scale-110"
										>{stats.colaboraciones.pendientes}</span
									>
									<span class="text-xs font-medium text-amber-400"
										>{(
											(stats.colaboraciones.pendientes / stats.colaboraciones.total) *
											100
										).toFixed(0)}%</span
									>
								</div>
							</div>

							<!-- Rechazadas -->
							<div
								class="group flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4 transition-all hover:border-rose-500/30 hover:bg-white/10"
							>
								<div class="flex items-center gap-3">
									<div class="rounded-lg bg-rose-500/10 p-2 text-rose-400">
										<XCircle size={18} />
									</div>
									<div>
										<p class="text-sm font-medium text-slate-300 group-hover:text-rose-300">
											Rechazadas
										</p>
										<p class="text-xs text-slate-500">No aceptadas</p>
									</div>
								</div>
								<div class="text-right">
									<span
										class="block text-xl font-bold text-white transition-transform group-hover:scale-110"
										>{stats.colaboraciones.rechazadas}</span
									>
									<span class="text-xs font-medium text-rose-400"
										>{(
											(stats.colaboraciones.rechazadas / stats.colaboraciones.total) *
											100
										).toFixed(0)}%</span
									>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 8px;
		height: 8px;
	}

	.custom-scrollbar::-webkit-scrollbar-track {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 10px;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 10px;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.bg-pattern {
		background-image: radial-gradient(
			circle at 1px 1px,
			rgba(255, 255, 255, 0.05) 1px,
			transparent 0
		);
		background-size: 20px 20px;
	}
</style>
