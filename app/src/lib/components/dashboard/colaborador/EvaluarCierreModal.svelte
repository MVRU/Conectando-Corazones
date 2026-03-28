<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { X, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-svelte';

	export let show = false;
	export let onClose: () => void;
	export let proyectos: { id: string; titulo: string; fechaFin: string; estado: string }[] = [];

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
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
			class="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0F1029] shadow-2xl shadow-slate-900/50"
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
						<CheckCircle2 size={20} />
					</div>
					<div>
						<h2 class="text-lg font-bold text-white sm:text-xl">Evaluar cierre de proyectos</h2>
						<p class="text-xs text-slate-400">Proyectos finalizados pendientes de tu evaluación</p>
					</div>
				</div>
				<button
					on:click={onClose}
					class="rounded-full p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
				>
					<X size={20} />
				</button>
			</div>

			<!-- Body -->
			<div class="custom-scrollbar flex-1 overflow-y-auto p-5 sm:p-8">
				<div class="grid gap-3">
					{#each proyectos as proyecto}
						<div
							class="group flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:shadow-lg hover:shadow-emerald-900/20"
						>
							<div class="flex flex-col gap-1">
								<span class="font-bold text-white transition-colors group-hover:text-emerald-400">
									{proyecto.titulo}
								</span>
								<span class="flex items-center gap-2 text-xs text-slate-400">
									<span class="flex items-center gap-1.5 text-amber-400">
										<AlertCircle size={12} />
										Pendiente de cierre
									</span>
									<span class="text-slate-600">•</span>
									<span
										>Finalizado el {new Date(proyecto.fechaFin).toLocaleDateString('es-AR')}</span
									>
								</span>
							</div>

							<a
								href="/colaborador/proyectos/{proyecto.id}/evaluar-cierre"
								class="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400 transition-all hover:bg-emerald-500 hover:text-white hover:shadow-lg hover:shadow-emerald-900/40"
							>
								Evaluar
								<ChevronRight size={16} />
							</a>
						</div>
					{/each}

					{#if proyectos.length === 0}
						<div class="flex flex-col items-center justify-center py-12 text-center">
							<div class="mb-3 rounded-full bg-white/5 p-4 text-slate-500">
								<CheckCircle2 size={32} />
							</div>
							<h4 class="text-sm font-medium text-slate-300">Todo al día</h4>
							<p class="mt-1 text-xs text-slate-500">No tenés evaluaciones de cierre pendientes.</p>
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
