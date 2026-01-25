<script lang="ts">
	import { page } from "$app/stores";
	import Button from "$lib/components/ui/elementos/Button.svelte";
	import { fade } from "svelte/transition";
	
	const projectId = $page.params.id;
</script>

<div class="min-h-screen bg-slate-50/30 pb-10 md:pb-20">
	<div class="max-w-5xl mx-auto px-4 md:px-6 space-y-8" in:fade>
		<header class="animate-fade-in-up py-10 md:py-16 text-center space-y-6">
			<h1 class="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
				Evidencias del proyecto
			</h1>
			<p class="mt-2 text-sm md:text-lg text-slate-500 font-medium italic">
				Listado de todas las evidencias subidas para este proyecto.
			</p>
			
			<div class="flex justify-center">
				<Button 
					label="Cargar nueva evidencia" 
					href={`/institucion/proyectos/${projectId}/aportes/evidencias/nueva`}
				/>
			</div>
		</header>
		
		<div class="text-center text-slate-400 py-10">
			<p>Aquí se listarán las evidencias cargadas (Pendiente de implementación).</p>
		</div>
	</div>
</div>

<style>
	@keyframes fade-in-up {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}
	.animate-fade-in-up {
		animation: fade-in-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
	}
</style>