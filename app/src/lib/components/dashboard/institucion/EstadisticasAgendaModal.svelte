<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import {
		X,
		Calendar,
		Clock,
		CheckCircle2,
		AlertTriangle,
		AlertCircle,
		CalendarClock,
		ArrowRight,
		Users
	} from 'lucide-svelte';
	import type { EstadisticasCalendario } from './types';
	import { quintOut } from 'svelte/easing';

	export let show = false;
	export let stats: EstadisticasCalendario | undefined;
	export let onClose: () => void;

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}

	// Helper para calcular posición y ancho para barras de Gantt
	function getGanttStyle(fechaInicio: string, fechaFin: string) {
		// Normalizamos al rango del inicio más temprano y el final más tardío en el conjunto de datos
		if (!stats?.projectTimeline.length) return '';

		const dates = stats.projectTimeline.flatMap((p) => [
			new Date(p.fechaInicio).getTime(),
			new Date(p.fechaFin).getTime()
		]);
		const minDate = Math.min(...dates);
		const maxDate = Math.max(...dates);
		const totalDuration = maxDate - minDate;

		const start = new Date(fechaInicio).getTime();
		const end = new Date(fechaFin).getTime();
		const duration = end - start;

		const left = ((start - minDate) / totalDuration) * 100;
		const width = (duration / totalDuration) * 100;

		return `left: ${left}%; width: ${width}%;`;
	}

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('es-AR', {
			day: 'numeric',
			month: 'short'
		});
	}

	function getRelativeTime(dateStr: string) {
		const diff = new Date(dateStr).getTime() - new Date().getTime();
		const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
		if (days < 0) return 'Vencido';
		if (days === 0) return 'Hoy';
		return `En ${days} días`;
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
						class="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20 text-amber-400"
					>
						<CalendarClock size={20} />
					</div>
					<div>
						<h2 class="text-lg font-bold text-white sm:text-xl">Agenda institucional</h2>
						<p class="text-xs text-slate-400">Cronograma de proyectos y vencimientos</p>
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
				<div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
					<!-- Verification Status -->
					<div
						class="relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-5 transition-transform hover:-translate-y-1"
					>
						<div class="mb-4 flex items-center justify-between">
							<div class="rounded-lg bg-green-500/10 p-2 text-green-400">
								<CheckCircle2 size={20} />
							</div>
							<span
								class="flex items-center gap-1 text-xs font-medium {stats.verificacion.estado ===
								'verificada'
									? 'text-emerald-400'
									: 'text-amber-400'}"
							>
								{#if stats.verificacion.estado === 'verificada'}
									Verificado
								{:else}
									Pendiente
								{/if}
							</span>
						</div>
						<div class="mb-1 text-2xl font-bold text-white sm:text-3xl">
							{stats.verificacion.diasRestantes} días
						</div>
						<div class="text-xs text-slate-400">
							Para renovar verificación ({formatDate(stats.verificacion.fechaRenovacion)})
						</div>
						<div
							class="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-indigo-500/5 blur-xl"
						></div>
					</div>

					<!-- Next Deadline Highlight -->
					{#if stats.proximosVencimientos.length > 0}
						{@const next = stats.proximosVencimientos[0]}
						<div
							class="relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-5 transition-transform hover:-translate-y-1"
						>
							<div class="mb-4 flex items-center justify-between">
								<div class="rounded-lg bg-rose-500/10 p-2 text-rose-400">
									<AlertCircle size={20} />
								</div>
								<span class="text-xs font-medium text-rose-400">¡Atención!</span>
							</div>
							<div class="mb-1 truncate text-lg font-bold text-white sm:text-xl">
								{next.titulo}
							</div>
							<div class="text-xs text-slate-400">
								Vence: {formatDate(next.fecha)} ({getRelativeTime(next.fecha)})
							</div>
							<div
								class="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-rose-500/5 blur-xl"
							></div>
						</div>
					{/if}
				</div>

				<!-- Project Timeline (Gantt) -->
				<div class="mb-8 rounded-2xl border border-white/5 bg-white/5 p-6">
					<h3 class="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
						<Calendar size={18} class="text-blue-500" />
						Línea de tiempo de proyectos
					</h3>
					<div class="relative min-h-[150px] w-full">
						<!-- Background Lines -->
						<div class="absolute inset-0 flex justify-between px-2 opacity-10">
							<div class="h-full w-px bg-white"></div>
							<div class="h-full w-px bg-white"></div>
							<div class="h-full w-px bg-white"></div>
							<div class="h-full w-px bg-white"></div>
							<div class="h-full w-px bg-white"></div>
						</div>

						<!-- Timeline Items -->
						<div class="space-y-4">
							{#each stats.projectTimeline as project}
								<div class="relative">
									<div class="mb-1 flex justify-between text-xs text-slate-400">
										<span class="truncate pr-2">{project.titulo}</span>
										<span class="whitespace-nowrap opacity-60">
											{formatDate(project.fechaInicio)} - {formatDate(project.fechaFin)}
										</span>
									</div>
									<div class="relative h-3 w-full rounded-full bg-slate-800/50">
										<div
											class="absolute h-full rounded-full opacity-80 shadow-sm transition-all hover:opacity-100"
											style="{getGanttStyle(
												project.fechaInicio,
												project.fechaFin
											)} background-color: {project.color};"
										></div>
									</div>
								</div>
							{/each}
						</div>

						<div class="mt-4 flex justify-between text-[10px] text-slate-500">
							<span>Inicio histórico</span>
							<span>Futuro próximo</span>
						</div>
					</div>
				</div>

				<!-- Chronological Agenda -->
				<div class="rounded-2xl border border-white/5 bg-white/5 p-6">
					<h3 class="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
						<Clock size={18} class="text-emerald-500" />
						Próximos vencimientos
					</h3>
					<div class="space-y-3">
						{#each stats.proximosVencimientos as deadline}
							<div
								class="flex flex-col gap-2 rounded-xl border border-white/5 bg-white/5 p-3 px-4 transition-colors hover:bg-white/10 sm:flex-row sm:items-center sm:justify-between"
							>
								<div class="flex items-center gap-3">
									<div
										class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-white"
										class:bg-amber-500={deadline.tipo === 'finalizacion_proyecto'}
										class:bg-indigo-500={deadline.tipo === 'verificacion'}
										class:bg-slate-600={deadline.tipo === 'otro'}
									>
										{#if deadline.tipo === 'finalizacion_proyecto'}
											<Clock size={14} />
										{:else if deadline.tipo === 'verificacion'}
											<CheckCircle2 size={14} />
										{:else}
											<AlertTriangle size={14} />
										{/if}
									</div>
									<div class="min-w-0">
										<div class="truncate font-medium text-slate-200">{deadline.titulo}</div>
										<div class="text-[10px] text-slate-400 lg:hidden">
											{formatDate(deadline.fecha)}
										</div>
									</div>
								</div>
								<div class="flex items-center justify-between gap-4 sm:justify-end">
									<div class="text-right">
										<div class="hidden text-xs font-bold text-white lg:block">
											{formatDate(deadline.fecha)}
										</div>
										<div
											class="text-[10px] font-medium"
											class:text-rose-400={getRelativeTime(deadline.fecha).includes('días') &&
												parseInt(getRelativeTime(deadline.fecha).split(' ')[1]) < 7}
											class:text-emerald-400={!(
												getRelativeTime(deadline.fecha).includes('días') &&
												parseInt(getRelativeTime(deadline.fecha).split(' ')[1]) < 7
											)}
										>
											{getRelativeTime(deadline.fecha)}
										</div>
									</div>
									<ArrowRight size={14} class="text-slate-600" />
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
