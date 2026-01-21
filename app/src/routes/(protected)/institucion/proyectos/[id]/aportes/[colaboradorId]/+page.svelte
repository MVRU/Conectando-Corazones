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
		AlertCircle
	} from "lucide-svelte";
	import { fade, fly } from "svelte/transition";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";

	// TODO: Integrar con Supabase para traer datos reales
	let colaborador = {
		nombre: "Rotaract Club Arrecifes",
		tipo: "Colaborador - ONG"
	};

	let aporte = {
		titulo: "Tubos de ensayo",
		cantidad: "50 unidades",
		evidencias_entrada: [
			{ id: 101, nombre: "foto_insumos.jpg", tipo: "jpg", tamaño: "2.5 MB" },
			{ id: 102, nombre: "comprobante_envio.pdf", tipo: "pdf", tamaño: "1.2 MB" }
		],
		tiene_evidencias_salida: false
	};

	const projectId = $page.params.id;
	let isMobile = $state(false);

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

	function irACargarSalida() {
		goto(`/institucion/proyectos/${projectId}/evidencias/${aporte.titulo}/nueva`);
	}
</script>

<div 
	class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md"
	onclick={(e) => { if (e.target === e.currentTarget) cerrarModal(); }}
	transition:fade={{ duration: 200 }}
	aria-hidden="true"
>
	<div 
		class="bg-white w-full max-w-2xl rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[95vh]"
		transition:fly={{ y: 100, duration: 300 }}
	>
		<header class="relative p-6 sm:p-10 pb-4 sm:pb-6 bg-white border-b border-slate-50">
			<div class="flex items-center gap-4 sm:gap-6">
				<div class="shrink-0 p-3 sm:p-4 bg-blue-600 text-white rounded-xl sm:rounded-[1.25rem] shadow-lg shadow-blue-100">
					<Package size={isMobile ? 24 : 32} strokeWidth={2.5} />
				</div>
				
				<div class="flex-1 min-w-0 text-left">
					<h2 class="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-none truncate">
						{aporte.titulo}
					</h2>
					
					<div class="flex items-center gap-x-1.5 mt-1 sm:mt-1.5 text-slate-500 text-xs sm:text-sm font-semibold truncate">
						<User size={14} class="text-slate-400 shrink-0" />
						<span class="truncate">{colaborador.nombre}</span>
						<span class="text-slate-300">•</span>
						<span class="font-bold text-slate-600 shrink-0">{aporte.cantidad}</span>
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

		<div class="p-6 sm:p-10 space-y-8 overflow-y-auto custom-scrollbar">
			
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
				
				<div class="grid gap-3">
					{#each aporte.evidencias_entrada as file}
						<div class="group flex items-center justify-between p-3 sm:p-4 bg-white border border-slate-200 rounded-[1.25rem] hover:border-blue-400 transition-all active:scale-[0.98]">
							<div class="flex items-center gap-4 truncate">
								<div class="p-2.5 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
									{#if file.tipo === 'pdf'} <FileText size={22} /> {:else} <ImageIcon size={22} /> {/if}
								</div>
								<div class="truncate leading-tight">
									<p class="text-xs sm:text-sm font-bold text-slate-800 truncate">{file.nombre}</p>
									<p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{file.tamaño}</p>
								</div>
							</div>
							
							<div class="flex items-center gap-1">
								<button class="p-2 text-slate-400 hover:text-blue-600"> <ExternalLink size={18} /> </button>
								<button class="hidden sm:block p-2 text-slate-400 hover:text-blue-600"> <Download size={18} /> </button>
							</div>
						</div>
					{/each}
				</div>
			</section>

			<section class="space-y-4 text-left">
				<div class="flex items-center gap-2 text-slate-900 font-black uppercase tracking-widest text-[10px] sm:text-[11px]">
					<History size={16} class="text-amber-500" />
					<h3>Evidencias de salida</h3>
				</div>
				
				{#if !aporte.tiene_evidencias_salida}
					<div class="p-5 bg-amber-50/50 border border-amber-200 rounded-2xl flex gap-4 items-start shadow-sm">
						<AlertCircle size={20} class="text-amber-500 shrink-0 mt-0.5" />
						<div class="space-y-1">
							<p class="text-sm font-bold text-amber-900 leading-tight">Pendiente de rendición</p>
							<p class="text-xs text-amber-700 leading-relaxed">
								Todavía no se subieron evidencias de salida por la institución para rendir cuentas sobre para qué se utilizó lo donado.
							</p>
						</div>
					</div>
				{/if}
			</section>
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
					on:click={irACargarSalida}
				/>
			</div>
		</footer>
	</div>
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar { width: 4px; }
	.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
</style>