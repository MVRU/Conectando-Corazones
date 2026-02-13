<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { X, FolderKanban, UploadCloud, XCircle } from 'lucide-svelte';

	export let show = false;
	export let onClose: () => void;
	export let proyectos: { id: string; titulo: string; estado: string }[] = [];

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
						<FolderKanban size={20} />
					</div>
					<div>
						<h2 class="text-lg font-bold text-white sm:text-xl">Gestionar evidencias</h2>
						<p class="text-xs text-slate-400">
							Seleccioná un proyecto para administrar sus aportes
						</p>
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
						{@const puedeSubir =
							proyecto.estado === 'En curso' || proyecto.estado === 'Pendiente solicitud cierre'}
						<div
							class="group flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:shadow-lg hover:shadow-emerald-900/20"
						>
							<div class="flex flex-col gap-1">
								<span class="font-bold text-white transition-colors group-hover:text-emerald-400">
									{proyecto.titulo}
								</span>
								<span class="flex items-center gap-2 text-xs text-slate-400">
									<span
										class="h-2 w-2 rounded-full {proyecto.estado === 'En curso'
											? 'bg-emerald-500'
											: proyecto.estado === 'Completado'
												? 'bg-blue-500'
												: 'bg-amber-500'} shadow-[0_0_8px_currentColor]"
									></span>
									{proyecto.estado}
								</span>
							</div>

							<div class="flex items-center gap-2">
								<!-- Ver Evidencia -->
								<a
									href="/institucion/proyectos/{proyecto.id}/aportes"
									class="rounded-xl bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white hover:shadow-md"
								>
									Ver
								</a>

								<!-- Subir Evidencia -->
								{#if puedeSubir}
									<a
										href="/institucion/proyectos/{proyecto.id}/aportes/evidencias/nueva"
										class="flex items-center gap-1.5 rounded-xl bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-400 transition-all hover:bg-emerald-500/20 hover:text-emerald-300 hover:shadow-md hover:shadow-emerald-900/20"
									>
										<UploadCloud size={14} />
										Subir
									</a>
								{/if}
							</div>
						</div>
					{/each}

					{#if proyectos.length === 0}
						<div class="flex flex-col items-center justify-center py-12 text-center">
							<div class="mb-3 rounded-full bg-white/5 p-4 text-slate-500">
								<FolderKanban size={32} />
							</div>
							<h4 class="text-sm font-medium text-slate-300">No hay proyectos disponibles</h4>
							<p class="mt-1 text-xs text-slate-500">
								Aún no tenés proyectos activos para gestionar evidencias.
							</p>
						</div>
					{/if}
				</div>
			</div>

			<!-- Footer -->
			<!-- Nota: EstadisticasProyectoModal no tiene footer explicito mas que el cierre del div principal, pero aqui lo dejamos por estructura si es necesario, o lo quitamos para ser IDENTICO. 
                 El usuario pidió IDENTICO. EstadisticasProyectoModal cierra el div scrollable y luego cierra el contenedor. No tiene footer con boton cancelar.
                 Voy a quitar el footer para ser mas fiel al request "idéntico", pero mantendré la estructura general.
                 
                 Revisando EstadisticasProyectoModal:
                 Tiene Header
                 Tiene Scrollable Body
                 NO tiene Footer con boton cancelar.
                 
                 Asi que quitaré el footer para que sea fiel al diseño.
            -->
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
