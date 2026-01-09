<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	
	// Obtener ID del proyecto automáticamente de la ruta
	$: proyectoId = $page.params.id;
	
	function solicitarCierre() {
		// Redirigir al formulario con el proyecto preseleccionado
		goto(`/institucion/solicitar-cierre?proyecto=${proyectoId}`);
	}
</script>

<svelte:head>
	<title>Panel de Proyecto - Conectando Corazones</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="max-w-2xl mx-auto">
		<h1 class="text-3xl font-bold mb-4">Panel del Proyecto</h1>
		
		<div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
			<p class="text-sm text-blue-800">
				🧪 <strong>Modo de prueba</strong> - Esta es una página temporal para probar la funcionalidad
			</p>
			<p class="text-sm text-blue-600 mt-2">
				Proyecto seleccionado: <code class="bg-blue-100 px-2 py-1 rounded">{proyectoId}</code>
			</p>
		</div>

		<div class="bg-white rounded-lg shadow-md p-6">
			<Button
				label="Solicitar cierre del proyecto"
				on:click={solicitarCierre}
				customClass="w-full"
			/>
		</div>
	</div>
</div>
