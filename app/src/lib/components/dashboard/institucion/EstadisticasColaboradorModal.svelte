<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import { X, Users, MapPin, Star, Award, TrendingUp, UserPlus } from 'lucide-svelte';
	import type { EstadisticasColaboradores } from './types';
	import { quintOut } from 'svelte/easing';

	export let show = false;
	export let stats: EstadisticasColaboradores | undefined;
	export let onClose: () => void;

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
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
						<Users size={20} />
					</div>
					<div>
						<h2 class="text-lg font-bold text-white sm:text-xl">Estadísticas de colaboradores</h2>
						<p class="text-xs text-slate-400">Visión general del impacto y participación</p>
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
				<!-- KPIs Row -->
				<div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
					<!-- KPI 1: Active Collaborators -->
					<div
						class="relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-5 transition-transform hover:-translate-y-1"
					>
						<div class="mb-4 flex items-center justify-between">
							<div class="rounded-lg bg-blue-500/10 p-2 text-blue-400">
								<Users size={20} />
							</div>
							<span class="flex items-center gap-1 text-xs font-medium text-emerald-400">
								<TrendingUp size={12} /> +12%
							</span>
						</div>
						<div class="mb-1 text-3xl font-bold text-white">{stats.totalActivos}</div>
						<div class="text-xs text-slate-400">Colaboradores activos</div>
						<div
							class="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-blue-500/5 blur-xl"
						></div>
					</div>

					<!-- KPI 2: New This Month -->
					<div
						class="relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-5 transition-transform hover:-translate-y-1"
					>
						<div class="mb-4 flex items-center justify-between">
							<div class="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
								<UserPlus size={20} />
							</div>
							<span class="flex items-center gap-1 text-xs font-medium text-emerald-400">
								<TrendingUp size={12} /> +5%
							</span>
						</div>
						<div class="mb-1 text-3xl font-bold text-white">{stats.nuevosEsteMes}</div>
						<div class="text-xs text-slate-400">Nuevos este mes</div>
						<div
							class="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-emerald-500/5 blur-xl"
						></div>
					</div>

					<!-- KPI 3: Retention Rate -->
					<div
						class="relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-5 transition-transform hover:-translate-y-1"
					>
						<div class="mb-4 flex items-center justify-between">
							<div class="rounded-lg bg-violet-500/10 p-2 text-violet-400">
								<Award size={20} />
							</div>
							<span class="text-xs text-slate-500">vs. mes anterior</span>
						</div>
						<div class="mb-1 text-3xl font-bold text-white">{stats.retencion}%</div>
						<div class="text-xs text-slate-400">Tasa de retención</div>
						<div
							class="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-violet-500/5 blur-xl"
						></div>
					</div>
				</div>

				<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
					<!-- Distribución por categorías -->
					<div class="rounded-2xl border border-white/5 bg-white/5 p-6">
						<h3 class="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
							<Star size={18} class="text-yellow-500" />
							Distribución por categorías
						</h3>
						<div class="space-y-3">
							{#if stats.distribucionCategorias && stats.distribucionCategorias.length > 0}
								{#each stats.distribucionCategorias as skill}
									<div
										class="relative flex items-center justify-between gap-4 overflow-hidden rounded-xl bg-white/5 p-3 px-4 transition-colors hover:bg-white/10"
									>
										<!-- Progress Bar Background -->
										<div
											class="absolute top-0 left-0 h-full bg-amber-500/20 transition-all duration-1000 ease-out"
											style="width: {skill.percentage}%"
										></div>

										<div class="relative z-10 flex min-w-0 flex-1 items-center gap-3">
											<span class="truncate font-medium text-slate-200">{skill.label}</span>
										</div>
										<div class="relative z-10 flex-shrink-0 text-right">
											<div class="font-bold text-white">{skill.count}</div>
											<div class="text-[10px] text-slate-400">{skill.percentage}%</div>
										</div>
									</div>
								{/each}
							{:else}
								<div class="flex flex-col items-center justify-center gap-2 py-8 text-slate-400">
									<div class="rounded-full bg-slate-800 p-3">
										<Star size={24} class="opacity-50" />
									</div>
									<span class="text-sm">Sin datos de categorías</span>
								</div>
							{/if}
						</div>
					</div>

					<!-- Geographic Distribution -->
					<div class="rounded-2xl border border-white/5 bg-white/5 p-6">
						<h3 class="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
							<MapPin size={18} class="text-rose-500" />
							Distribución geográfica
						</h3>
						<div class="space-y-3">
							{#if stats.distribucionUbicacion && stats.distribucionUbicacion.length > 0}
								{#each stats.distribucionUbicacion as loc}
									<div
										class="relative flex items-center justify-between gap-4 overflow-hidden rounded-xl bg-white/5 p-3 px-4 transition-colors hover:bg-white/10"
									>
										<!-- Progress Bar Background -->
										<div
											class="absolute top-0 left-0 h-full bg-rose-500/20 transition-all duration-1000 ease-out"
											style="width: {loc.percentage}%"
										></div>

										<div class="relative z-10 flex min-w-0 flex-1 items-center gap-3">
											<span class="truncate font-medium text-slate-200">{loc.label}</span>
										</div>
										<div class="relative z-10 flex-shrink-0 text-right">
											<div class="font-bold text-white">{loc.count}</div>
											<div class="text-[10px] text-slate-400">{loc.percentage}%</div>
										</div>
									</div>
								{/each}
							{:else}
								<div class="flex flex-col items-center justify-center gap-2 py-8 text-slate-400">
									<div class="rounded-full bg-slate-800 p-3">
										<MapPin size={24} class="opacity-50" />
									</div>
									<span class="text-sm">Sin datos de ubicación</span>
								</div>
							{/if}
						</div>
					</div>
				</div>

				<!-- Top Collaborators -->
				<div class="mt-8 rounded-2xl border border-white/5 bg-white/5 p-6">
					<h3 class="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
						<Award size={18} class="text-amber-500" />
						Colaboradores destacados
					</h3>
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{#each stats.topColaboradores as collaborator}
							<div
								class="group relative flex items-center gap-4 rounded-xl border border-white/5 bg-slate-900/50 p-4 transition-all hover:border-blue-500/30 hover:bg-blue-500/5 hover:shadow-lg hover:shadow-blue-900/20"
							>
								<div class="relative flex-shrink-0">
									<div
										class="h-12 w-12 overflow-hidden rounded-full border-2 border-slate-700 transition-colors group-hover:border-blue-500"
									>
										<!-- Placeholder si la imagen del avatar falla o está vacía -->
										{#if collaborator.avatarUrl}
											<img
												src={collaborator.avatarUrl}
												alt={collaborator.nombre}
												class="h-full w-full object-cover"
											/>
										{:else}
											<div
												class="flex h-full w-full items-center justify-center bg-slate-800 text-xs font-bold text-slate-400"
											>
												{collaborator.nombre.substring(0, 2).toUpperCase()}
											</div>
										{/if}
									</div>
									<div
										class="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-900 ring-2 ring-[#0F1029]"
									>
										★
									</div>
								</div>
								<div class="min-w-0 flex-1">
									<a
										href="/perfil/{collaborator.username}"
										class="block truncate font-bold text-white transition-colors group-hover:text-blue-400 hover:underline"
									>
										{collaborator.nombre}
									</a>
									<div class="truncate text-xs text-slate-400">{collaborator.rol}</div>
									<div
										class="mt-1 flex w-fit items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-slate-300"
									>
										<span class="font-semibold text-blue-400">{collaborator.aportes}</span> aportes
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 6px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: rgba(255, 255, 255, 0.05);
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 10px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.bg-pattern {
		background-image: radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px);
		background-size: 20px 20px;
	}
</style>
