<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import {
		X,
		FolderOpen,
		Target,
		TrendingUp,
		Heart,
		Star,
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
						class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400"
					>
						<FolderOpen size={20} />
					</div>
					<div>
						<h2 class="text-lg font-bold text-white sm:text-xl">Estadísticas de proyectos</h2>
						<p class="text-xs text-slate-400">Análisis detallado de impacto y progreso</p>
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
					<!-- KPI 1: Money Raised -->
					<div
						class="relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-5 transition-transform hover:-translate-y-1"
					>
						<div class="mb-4 flex items-center justify-between">
							<div class="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
								<DollarSign size={20} />
							</div>
							<span class="flex items-center gap-1 text-xs font-medium text-emerald-400">
								<TrendingUp size={12} /> Recaudación
							</span>
						</div>
						<div class="mb-1 text-3xl font-bold text-white">
							${stats.totalDineroRecaudado.toLocaleString('es-AR')}
						</div>
						<div class="text-xs text-slate-400">Total recaudado</div>
						<div
							class="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-emerald-500/5 blur-xl"
						></div>
					</div>

					<!-- KPI 2: Total Beneficiaries -->
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
						<div class="text-xs text-slate-400">Beneficiarios totales</div>
						<div
							class="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-indigo-500/5 blur-xl"
						></div>
					</div>

					<!-- KPI 3: Average Progress -->
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
					<!-- Category Distribution -->
					<div class="rounded-2xl border border-white/5 bg-white/5 p-6">
						<h3 class="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
							<BarChart3 size={18} class="text-blue-500" />
							Distribución por categorías
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

					<!-- Status Distribution -->
					<div class="rounded-2xl border border-white/5 bg-white/5 p-6">
						<h3 class="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
							<PieChart size={18} class="text-violet-500" />
							Estado de proyectos
						</h3>
						<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
							{#each stats.distribucionEstado as estado}
								<div
									class="flex items-center justify-between rounded-xl bg-white/5 p-3 px-4 ring-1 ring-transparent transition-all hover:bg-white/10 hover:ring-white/10"
								>
									<div class="flex items-center gap-3">
										<div
											class="h-3 w-3 rounded-full"
											style="background-color: {estado.color}; box-shadow: 0 0 10px {estado.color}40;"
										></div>
										<span class="font-medium text-slate-200">{estado.label}</span>
									</div>
									<div class="text-right">
										<div class="font-bold text-white">{estado.count}</div>
										<div class="text-[10px] text-slate-400">{estado.percentage}%</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<!-- Highlighted Projects -->
				<div class="mt-8 rounded-2xl border border-white/5 bg-white/5 p-6">
					<h3 class="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
						<Star size={18} class="text-amber-500" />
						Proyectos destacados
					</h3>
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						{#each stats.proyectosDestacados as project}
							<a
								href="/proyectos/{project.id}"
								class="group relative flex flex-col gap-4 rounded-xl border border-white/5 bg-slate-900/50 p-4 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:shadow-lg hover:shadow-emerald-900/20 sm:flex-row sm:items-center"
							>
								<div
									class="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-slate-800 transition-colors group-hover:bg-emerald-500/20"
								>
									{#if project.imagen}
										<img
											src={project.imagen}
											alt={project.titulo}
											class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
										/>
									{:else}
										<div
											class="flex h-full w-full items-center justify-center text-emerald-400 group-hover:text-emerald-300"
										>
											<FolderOpen size={24} />
										</div>
									{/if}
								</div>
								<div class="min-w-0 flex-1">
									<div
										class="truncate font-bold text-white transition-colors group-hover:text-emerald-400"
									>
										{project.titulo}
									</div>
									<div class="flex items-center gap-3 text-xs text-slate-400">
										<span class="flex items-center gap-1">
											{project.progreso}% completado
										</span>
										<span class="flex items-center gap-1">
											<Users size={10} />
											{project.beneficiarios} benef.
										</span>
									</div>
								</div>
								<div class="flex flex-col items-start gap-1 sm:items-end">
									<span
										class="rounded-full border border-white/5 bg-white/10 px-2 py-0.5 text-[10px] text-slate-300"
									>
										{project.estado}
									</span>
								</div>
							</a>
						{/each}
					</div>
				</div>

				<!-- Projects in Audit Section -->
				<div
					class="mt-8 rounded-2xl border {stats.proyectosEnAuditoria.length > 0
						? 'border-red-500/20 bg-red-500/5'
						: 'border-emerald-500/20 bg-emerald-500/5'} p-6 transition-colors"
				>
					<h3 class="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
						{#if stats.proyectosEnAuditoria.length > 0}
							<AlertTriangle size={18} class="text-red-500" />
							Proyectos en auditoría
						{:else}
							<CheckCircle2 size={18} class="text-emerald-500" />
							Auditoría de proyectos
						{/if}
					</h3>

					{#if stats.proyectosEnAuditoria.length > 0}
						<div class="space-y-3">
							{#each stats.proyectosEnAuditoria as project}
								<div
									class="flex flex-col gap-2 rounded-xl border border-red-500/10 bg-red-500/10 p-4 sm:flex-row sm:items-center sm:justify-between"
								>
									<div>
										<div class="font-bold text-white">{project.titulo}</div>
										<div class="text-sm text-red-300">Motivo: {project.motivo}</div>
									</div>
									<div class="text-xs text-red-400">{project.fecha}</div>
								</div>
							{/each}
						</div>
					{:else}
						<div class="flex items-center gap-3 text-emerald-300">
							<p>No hay proyectos reportados ni en auditoría actualmente. ¡Excelente trabajo!</p>
						</div>
					{/if}
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
