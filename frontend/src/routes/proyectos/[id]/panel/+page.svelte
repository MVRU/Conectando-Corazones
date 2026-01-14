<script lang="ts">
	import { page } from '$app/stores';


	// Obtener ID del proyecto automáticamente de la ruta
	$: proyectoId = $page.params.id;

</script>

<svelte:head>
	<title>Redirigiendo... - Conectando Corazones</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="max-w-2xl mx-auto text-center">
		<p class="text-gray-600">Redirigiendo...</p>
	</div>
</div>
