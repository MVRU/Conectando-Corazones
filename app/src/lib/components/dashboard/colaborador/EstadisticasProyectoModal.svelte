<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import {
		X,
		FolderOpen,
		Target,
		TrendingUp,
		Heart,
		BarChart3,
		PieChart,
		Users,
		DollarSign,
		AlertTriangle,
		CheckCircle2
	} from 'lucide-svelte';
	import type { EstadisticasProyectos } from './types';
	import { quintOut } from 'svelte/easing';

	export let show = false;
	export let stats: EstadisticasProyectos | undefined;
	export let onClose: () => void;

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}
	function formatCompactNumber(val: number): string {
		if (val >= 1_000_000_000) {
			return (val / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
		}
		if (val >= 1_000_000) {
			return (val / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
		}
		if (val >= 1_000) {
			return (val / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
		}
		return val.toString();
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show && stats}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
		role="dialog"
		aria-modal="true"
	>
		<!-- Fondo oscuro (Backdrop) -->
		<div
			class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
			in:fade={{ duration: 200 }}
			out:fade={{ duration: 200 }}
			on:click={onClose}
			role="button"
			tabindex="-1"
			on:keydown={(e) => e.key === 'Enter' && onClose()}
		></div>

		<!-- Contenido del Modal -->
		<div
			class="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0F1029] shadow-2xl shadow-slate-900/50"
			in:fly={{ y: 20, duration: 300, easing: quintOut }}
			out:scale={{ start: 1, opacity: 0, duration: 200 }}
		>
			<!-- Encabezado -->
			<div
				class="bg-pattern flex items-center justify-between border-b border-white/5 bg-slate-900/50 px-5 py-4 sm:px-8 sm:py-5"
			>
				<div class="flex items-center gap-3">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400"
					>
						<FolderOpen size={20} />
					</div>
					<div>
						<h2 class="text-lg font-bold text-white sm:text-xl">Mis proyectos</h2>
						<p class="text-xs text-slate-400">Detalle de tu participación</p>
					</div>
				</div>
				<button
					on:click={onClose}
					class="rounded-full p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
				>
					<X size={20} />
				</button>
			</div>

			<div class="custom-scrollbar flex-1 overflow-y-auto p-5 sm:p-8">
				<div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
					<!-- KPI 1: Dinero Donado -->
					<div
						class="relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-5 transition-transform hover:-translate-y-1"
					>
						<div class="mb-4 flex items-center justify-between">
							<div class="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
								<DollarSign size={20} />
							</div>
							<span class="flex items-center gap-1 text-xs font-medium text-emerald-400">
								<TrendingUp size={12} /> Donado
							</span>
						</div>
						<div class="mb-1 flex items-baseline gap-1">
							<span class="text-lg font-bold text-emerald-500">$</span>
							<span class="text-3xl font-extrabold tracking-tight text-white">
								{formatCompactNumber(stats.totalDineroRecaudado)}
							</span>
							<span class="ml-1 text-xs font-bold tracking-wider text-emerald-500/80 uppercase"
								>ARS</span
							>
						</div>
						<div class="text-xs text-slate-400">Total aportado</div>
						<div
							class="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-emerald-500/5 blur-xl"
						></div>
					</div>

					<!-- KPI 2: Impacto -->
					<div
						class="relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-5 transition-transform hover:-translate-y-1"
					>
						<div class="mb-4 flex items-center justify-between">
							<div class="rounded-lg bg-rose-500/10 p-2 text-rose-400">
								<Heart size={20} />
							</div>
							<span class="flex items-center gap-1 text-xs font-medium text-emerald-400">
								<TrendingUp size={12} /> Impacto
							</span>
						</div>
						<div class="mb-1 text-3xl font-bold text-white">
							{stats.totalBeneficiarios.toLocaleString('es-AR')}
						</div>
						<div class="text-xs text-slate-400">Personas alcanzadas</div>
						<div
							class="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-indigo-500/5 blur-xl"
						></div>
					</div>

					<!-- KPI 3: Progreso Promedio -->
					<div
						class="relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-5 transition-transform hover:-translate-y-1"
					>
						<div class="mb-4 flex items-center justify-between">
							<div class="rounded-lg bg-amber-500/10 p-2 text-amber-400">
								<Target size={20} />
							</div>
							<span class="text-xs text-slate-500">Global</span>
						</div>
						<div class="mb-1 text-3xl font-bold text-white">{stats.promedioProgreso}%</div>
						<div class="text-xs text-slate-400">Progreso promedio</div>
						<div
							class="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-amber-500/5 blur-xl"
						></div>
					</div>
				</div>

				<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
					<!-- Distribución por Categoría -->
					<div class="rounded-2xl border border-white/5 bg-white/5 p-6">
						<h3 class="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
							<BarChart3 size={18} class="text-blue-500" />
							Causas por categoría
						</h3>
						<div class="space-y-4">
							{#each stats.distribucionCategoria as cat}
								<div>
									<div class="mb-1 flex justify-between text-xs">
										<span class="font-medium text-slate-300">{cat.label}</span>
										<span class="text-slate-400">{cat.count} ({cat.percentage}%)</span>
									</div>
									<div class="h-2 w-full overflow-hidden rounded-full bg-slate-700/50">
										<div
											class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000 ease-out"
											style="width: {cat.percentage}%"
										></div>
									</div>
								</div>
							{/each}
						</div>
					</div>

					<!-- Distribución por Estado -->
					<div class="rounded-2xl border border-white/5 bg-white/5 p-6">
						<h3 class="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
							<PieChart size={18} class="text-violet-500" />
							Estado de proyectos
						</h3>
						<div class="grid grid-cols-2 gap-3">
							{#each stats.distribucionEstado as estado}
								<div
									class="flex flex-col gap-2 rounded-xl bg-white/5 p-4 ring-1 ring-transparent transition-all hover:bg-white/10 hover:ring-white/10"
								>
									<div class="flex items-center gap-2">
										<div
											class="h-3 w-3 flex-shrink-0 rounded-full"
											style="background-color: {estado.color}; box-shadow: 0 0 10px {estado.color}40;"
										></div>
										<span class="text-xs leading-tight font-medium text-slate-300"
											>{estado.label}</span
										>
									</div>
									<div class="flex items-baseline justify-between">
										<div class="text-2xl font-bold text-white">{estado.count}</div>
										<div class="text-xs text-slate-400">{estado.percentage}%</div>
									</div>
								</div>
							{/each}
						</div>
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
