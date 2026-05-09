<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { fade } from 'svelte/transition';

	const projectId = page.params.id;
</script>

<div class="min-h-screen bg-slate-50/30 pb-10 md:pb-20">
	<div class="mx-auto max-w-5xl space-y-8 px-4 md:px-6" in:fade>
		<header class="animate-fade-in-up space-y-6 py-10 text-center md:py-16">
			<h1 class="text-3xl leading-none font-black tracking-tight text-slate-900 md:text-5xl">
				Evidencias del proyecto
			</h1>
			<p class="mt-2 text-sm font-medium text-slate-500 italic md:text-lg">
				Listado de todas las evidencias subidas para este proyecto.
			</p>

			<div class="flex justify-center">
				<Button
					label="Cargar nueva evidencia"
					href={`/institucion/proyectos/${projectId}/aportes/evidencias/nueva`}
				/>
			</div>
		</header>

		<div class="py-10 text-center text-slate-400">
			<p>Aquí se listarán las evidencias cargadas (Pendiente de implementación).</p>
		</div>
	</div>
</div>

<style>
	@keyframes fade-in-up {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fade-in-up {
		animation: fade-in-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
	}
</style>
