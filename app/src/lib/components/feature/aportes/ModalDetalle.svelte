<script lang="ts">
	import { fade, fly, slide } from 'svelte/transition';
	import {
		Package,
		User,
		X,
		ChevronUp,
		ChevronDown,
		FileStack,
		History,
		AlertCircle
	} from 'lucide-svelte';
	import ArchivoCard from '$lib/components/ui/cards/ArchivoCard.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { obtenerNombreCompleto } from '$lib/utils/util-usuarios';

	let { data, cerrarModal, projectId, isMobile } = $props();

	let expandedIndex = $state(0);

	function toggleAporte(index: number) {
		expandedIndex = expandedIndex === index ? -1 : index;
	}
</script>

<div
	class="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-0 backdrop-blur-md sm:items-center sm:p-4"
	onclick={(e) => {
		if (e.target === e.currentTarget) cerrarModal();
	}}
	onkeydown={(e) => {
		if (e.key === 'Escape') cerrarModal();
	}}
	transition:fade={{ duration: 200 }}
	aria-hidden="true"
	role="dialog"
	aria-modal="true"
>
	<div
		class="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-[2.5rem] bg-white shadow-2xl sm:max-h-[95vh] sm:rounded-[2.5rem]"
		transition:fly={{ y: 100, duration: 300 }}
	>
		<header class="relative border-b border-slate-50 bg-white p-4 pb-4 sm:p-10 sm:pb-6">
			<div class="flex items-center gap-4 sm:gap-6">
				<div
					class="shrink-0 rounded-xl bg-blue-600 p-3 text-white shadow-lg shadow-blue-100 sm:rounded-[1.25rem] sm:p-4"
				>
					<Package size={isMobile ? 24 : 32} strokeWidth={2.5} />
				</div>

				<div class="min-w-0 flex-1 text-left">
					<h2
						class="truncate text-xl leading-none font-extrabold tracking-tight text-slate-900 sm:text-3xl"
					>
						Detalle de aportes
					</h2>

					<div
						class="mt-1 flex items-center gap-x-1.5 truncate text-xs font-semibold text-slate-500 sm:mt-1.5 sm:text-sm"
					>
						<User size={14} class="shrink-0 text-slate-400" />
						<span class="truncate">{obtenerNombreCompleto(data.colaborador)}</span>
						<span class="hidden text-slate-300 sm:inline">•</span>
						<span class="hidden shrink-0 font-bold text-slate-600 sm:inline"
							>{data.colaborador.tipo_etiqueta}</span
						>
					</div>
				</div>

				<button
					onclick={cerrarModal}
					class="shrink-0 rounded-full p-2 text-slate-400 transition-all hover:bg-slate-100 active:scale-90"
				>
					<X size={24} />
				</button>
			</div>
		</header>

		<div class="custom-scrollbar flex-1 space-y-0 overflow-x-hidden overflow-y-auto p-4 sm:p-10">
			{#each data.aportes as aporte, index}
				<div class="min-w-0 border-b border-slate-100 pb-6 last:border-0 last:pb-0">
					<button
						class="group flex w-full min-w-0 items-center justify-between py-4 text-left"
						onclick={() => toggleAporte(index)}
					>
						<div class="flex min-w-0 items-center gap-3">
							<div
								class="shrink-0 rounded-lg bg-slate-100 p-2 text-slate-500 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600"
							>
								{#if expandedIndex === index}
									<ChevronUp size={20} />
								{:else}
									<ChevronDown size={20} />
								{/if}
							</div>
							<div class="min-w-0 flex-1">
								<h3 class="truncate text-base font-bold text-slate-800 sm:text-lg">
									{aporte.titulo}
								</h3>
								<span
									class="mt-1 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500"
								>
									{aporte.cantidad}
								</span>
							</div>
						</div>
					</button>

					{#if expandedIndex === index}
						<div
							transition:slide={{ duration: 300 }}
							class="min-w-0 space-y-6 pt-2 pb-4 pl-2 sm:pl-4"
						>
							<section class="min-w-0 space-y-4 text-left">
								<div class="min-w-0 space-y-1">
									<div
										class="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-900 uppercase sm:text-[11px]"
									>
										<FileStack size={16} class="shrink-0 text-blue-600" />
										<h3 class="truncate">Evidencias de entrada</h3>
									</div>
									<p class="truncate text-[11px] leading-none font-medium text-slate-500 italic">
										Subidas por el colaborador para validar el aporte.
									</p>
								</div>

								{#if aporte.evidencias_entrada.length === 0}
									<div class="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500 italic">
										No hay evidencias de entrada subidas.
									</div>
								{:else}
									<div class="flex flex-col gap-3">
										{#each aporte.evidencias_entrada as file}
											<ArchivoCard archivo={file} showUploader={true} />
										{/each}
									</div>
								{/if}
							</section>

							<section class="min-w-0 space-y-4 text-left">
								<div
									class="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-900 uppercase sm:text-[11px]"
								>
									<History size={16} class="shrink-0 text-amber-500" />
									<h3 class="truncate">Evidencias de salida</h3>
								</div>

								{#if aporte.evidencias_salida.length === 0}
									<div
										class="flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm"
									>
										<AlertCircle size={20} class="mt-0.5 shrink-0 text-amber-500" />
										<div class="min-w-0 space-y-1">
											<p class="truncate text-sm leading-tight font-bold text-amber-900">
												Pendiente de rendición
											</p>
											<p class="text-xs leading-relaxed text-amber-700">
												Todavía no se subieron evidencias de salida por la institución.
											</p>
										</div>
									</div>
								{:else}
									<div class="flex flex-col gap-3">
										{#each aporte.evidencias_salida as file}
											<ArchivoCard
												archivo={file}
												showUploader={true}
												customClass="hover:border-amber-400"
											/>
										{/each}
									</div>
								{/if}
							</section>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<footer
			class="flex flex-col-reverse items-center gap-4 border-t border-slate-100 bg-white p-6 py-5 sm:flex-row sm:justify-between sm:px-10 sm:py-6"
		>
			<button
				onclick={cerrarModal}
				class="w-full px-6 py-2 text-xs font-bold text-slate-400 transition-colors hover:text-slate-800 sm:w-auto sm:text-sm"
			>
				Cerrar ventana
			</button>

			<div class="flex w-full justify-center sm:w-auto sm:justify-end">
				<Button
					label={isMobile ? 'Rendir cuentas' : 'Rendir cuentas del uso'}
					size={isMobile ? 'sm' : 'md'}
					customClass="w-full sm:w-auto"
					href={`/institucion/proyectos/${projectId}/aportes/evidencias/nueva`}
				/>
			</div>
		</footer>
	</div>
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: #e2e8f0;
		border-radius: 10px;
	}
</style>
