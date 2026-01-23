<script lang="ts">
	import { onMount } from 'svelte';
	import Button from "$lib/components/ui/elementos/Button.svelte";
	import { 
		Package, 
		User, 
		FileText, 
		Image as ImageIcon, 
		Download, 
		ExternalLink, 
		X, 
		FileStack,
		History,
		AlertCircle,
		ChevronDown,
		ChevronUp
	} from "lucide-svelte";
	import { fade, fly, slide } from "svelte/transition";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import type { Usuario } from '$lib/domain/types/Usuario';
	import type { Archivo } from '$lib/domain/types/Archivo';

	// Definimos una estructura intermedia que reutilice los tipos de dominio
	// pero se adapte a lo que el load function está devolviendo
	type AporteView = {
		titulo: string;
		cantidad: string;
		evidencias_entrada: Archivo[];
		evidencias_salida: Archivo[];
	};

	type DataView = {
		colaborador: Usuario & { tipo_etiqueta: string }; // Extendemos Usuario para agregar el label formateado
		aportes: AporteView[];
	};

	let { colaboradorId, data } = $props<{ 
		colaboradorId: string, 
		data: DataView
	}>();

	const projectId = $page.params.id;
	let isMobile = $state(false);
	let expandedIndex = $state<number | null>(null); // Colapsados por defecto

	onMount(() => {
		const mql = window.matchMedia('(max-width: 640px)');
		isMobile = mql.matches;
		const listener = (e: MediaQueryListEvent) => isMobile = e.matches;
		mql.addEventListener('change', listener);
		return () => mql.removeEventListener('change', listener);
	});

	function cerrarModal() {
		goto(`/institucion/proyectos/${projectId}/aportes`, { noScroll: true });
	}

	function toggleAporte(index: number) {
		expandedIndex = expandedIndex === index ? null : index;
	}

	function getIconForFile(mimeType?: string) {
		return mimeType?.includes('pdf') ? FileText : ImageIcon;
	}

	// Helper para formatear tamaño
	function formatSize(bytes?: number): string {
		if (!bytes) return 'Desconocido';
		return `${Math.round(bytes / 1024)} KB`;
	}
</script>

<div 
	class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md"
	onclick={(e) => { if (e.target === e.currentTarget) cerrarModal(); }}
	transition:fade={{ duration: 200 }}
	aria-hidden="true"
	role="dialog"
	aria-modal="true"
>
	<div 
		class="bg-white w-full max-w-5xl rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[95vh]"
		transition:fly={{ y: 100, duration: 300 }}
	>
		<header class="relative p-6 sm:p-10 pb-4 sm:pb-6 bg-white border-b border-slate-50">
			<div class="flex items-center gap-4 sm:gap-6">
				<div class="shrink-0 p-3 sm:p-4 bg-blue-600 text-white rounded-xl sm:rounded-[1.25rem] shadow-lg shadow-blue-100">
					<Package size={isMobile ? 24 : 32} strokeWidth={2.5} />
				</div>
				
				<div class="flex-1 min-w-0 text-left">
					<h2 class="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-none truncate">
						Detalle de aportes
					</h2>
					
					<div class="flex items-center gap-x-1.5 mt-1 sm:mt-1.5 text-slate-500 text-xs sm:text-sm font-semibold truncate">
						<User size={14} class="text-slate-400 shrink-0" />
						<span class="truncate">{data.colaborador.nombre} {data.colaborador.apellido}</span>
						<span class="hidden sm:inline text-slate-300">•</span>
						<span class="hidden sm:inline font-bold text-slate-600 shrink-0">{data.colaborador.tipo_etiqueta}</span>
					</div>
				</div>

				<button 
					onclick={cerrarModal}
					class="p-2 hover:bg-slate-100 rounded-full text-slate-400 active:scale-90 transition-all shrink-0"
				>
					<X size={24} />
				</button>
			</div>
		</header>

		<div class="p-6 sm:p-10 space-y-0 overflow-y-auto custom-scrollbar">
			
			{#each data.aportes as aporte, index}
				<div class="border-b border-slate-100 last:border-0 pb-6 last:pb-0">
					<button 
						class="w-full flex items-center justify-between py-4 text-left group"
						onclick={() => toggleAporte(index)}
					>
						<div class="flex items-center gap-3">
							<div class="bg-slate-100 p-2 rounded-lg text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
								{#if expandedIndex === index}
									<ChevronUp size={20} />
								{:else}
									<ChevronDown size={20} />
								{/if}
							</div>
							<div>
								<h3 class="text-base sm:text-lg font-bold text-slate-800">{aporte.titulo}</h3>
								<span class="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full mt-1 inline-block">
									{aporte.cantidad}
								</span>
							</div>
						</div>
					</button>

					{#if expandedIndex === index}
						<div transition:slide={{ duration: 300 }} class="space-y-6 pt-2 pb-4 pl-2 sm:pl-4">
							<section class="space-y-4 text-left">
								<div class="space-y-1">
									<div class="flex items-center gap-2 text-slate-900 font-black uppercase tracking-widest text-[10px] sm:text-[11px]">
										<FileStack size={16} class="text-blue-600" />
										<h3>Evidencias de entrada</h3>
									</div>
									<p class="text-[11px] text-slate-500 font-medium italic leading-none">
										Subidas por el colaborador para validar el aporte.
									</p>
								</div>
								
								{#if aporte.evidencias_entrada.length === 0}
									<div class="p-4 bg-slate-50 rounded-xl text-slate-500 text-sm italic text-center">
										No hay evidencias de entrada subidas.
									</div>
								{:else}
									<div class="grid gap-3">
										{#each aporte.evidencias_entrada as file}
											{@const Icon = getIconForFile(file.tipo_mime)}
											<div class="group flex items-center justify-between p-3 sm:p-4 bg-white border border-slate-200 rounded-[1.25rem] hover:border-blue-400 transition-all active:scale-[0.98]">
												<div class="flex items-center gap-3 sm:gap-4 min-w-0 flex-1 pr-3">
													<div class="p-2.5 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
														<Icon size={22} />
													</div>
													<div class="min-w-0 flex-1 overflow-hidden">
														<p class="text-xs sm:text-sm font-bold text-slate-800 truncate block w-full max-w-[200px] sm:max-w-full" title={file.descripcion}>{file.descripcion || file.nombre_original}</p>
														<p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{formatSize(file.tamanio_bytes)}</p>
													</div>
												</div>
												
												<div class="flex items-center gap-1">
													<a href={file.url} target="_blank" rel="noopener noreferrer" class="p-2 text-slate-400 hover:text-blue-600"> <ExternalLink size={18} /> </a>
													<a href={file.url} download class="hidden sm:block p-2 text-slate-400 hover:text-blue-600"> <Download size={18} /> </a>
												</div>
											</div>
										{/each}
									</div>
								{/if}
							</section>

							<section class="space-y-4 text-left">
								<div class="flex items-center gap-2 text-slate-900 font-black uppercase tracking-widest text-[10px] sm:text-[11px]">
									<History size={16} class="text-amber-500" />
									<h3>Evidencias de salida</h3>
								</div>
								
								{#if aporte.evidencias_salida.length === 0}
									<div class="p-5 bg-amber-50/50 border border-amber-200 rounded-2xl flex gap-4 items-start shadow-sm">
										<AlertCircle size={20} class="text-amber-500 shrink-0 mt-0.5" />
										<div class="space-y-1">
											<p class="text-sm font-bold text-amber-900 leading-tight">Pendiente de rendición</p>
											<p class="text-xs text-amber-700 leading-relaxed">
												Todavía no se subieron evidencias de salida por la institución.
											</p>
										</div>
									</div>
								{:else}
									<div class="grid gap-3">
										{#each aporte.evidencias_salida as file}
											{@const Icon = getIconForFile(file.tipo_mime)}
											<div class="group flex items-center justify-between p-3 sm:p-4 bg-white border border-slate-200 rounded-[1.25rem] hover:border-amber-400 transition-all active:scale-[0.98]">
												<div class="flex items-center gap-3 sm:gap-4 min-w-0 flex-1 pr-3">
													<div class="p-2.5 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-amber-500 group-hover:text-white transition-all shrink-0">
														<Icon size={22} />
													</div>
													<div class="min-w-0 flex-1 overflow-hidden">
														<p class="text-xs sm:text-sm font-bold text-slate-800 truncate block w-full max-w-[200px] sm:max-w-full" title={file.descripcion}>{file.descripcion || file.nombre_original}</p>
														<p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{formatSize(file.tamanio_bytes)}</p>
													</div>
												</div>
												<div class="flex items-center gap-1">
													<a href={file.url} target="_blank" rel="noopener noreferrer" class="p-2 text-slate-400 hover:text-amber-600"> <ExternalLink size={18} /> </a>
												</div>
											</div>
										{/each}
									</div>
								{/if}
							</section>
						</div>
					{/if}
				</div>
			{/each}

		</div>

		<footer class="p-6 sm:px-10 py-5 sm:py-6 border-t border-slate-100 bg-white flex flex-col-reverse sm:flex-row items-center sm:justify-between gap-4">
			<button 
				onclick={cerrarModal}
				class="w-full sm:w-auto px-6 py-2 font-bold text-slate-400 hover:text-slate-800 transition-colors text-xs sm:text-sm"
			>
				Cerrar ventana
			</button>
			
			<div class="w-full sm:w-auto flex justify-center sm:justify-end">
				<Button 
					label={isMobile ? "Rendir cuentas" : "Rendir cuentas del uso"} 
					size={isMobile ? "sm" : "md"}
					customClass="w-full sm:w-auto"
					href={`/institucion/proyectos/${projectId}/aportes/evidencias/nueva`}
				/>
			</div>
		</footer>
	</div>
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar { width: 4px; }
	.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
</style>
