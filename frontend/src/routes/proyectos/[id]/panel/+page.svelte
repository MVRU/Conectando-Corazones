<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { mockProyectos } from '$lib/mocks/mock-proyectos';
	import { getEstadoCodigo } from '$lib/utils/util-estados';

	// Obtener ID del proyecto automáticamente de la ruta
	$: proyectoId = $page.params.id;

	onMount(() => {
		// Buscar el proyecto en los mocks
		const proyecto = mockProyectos.find((p) => p.id_proyecto?.toString() === proyectoId);
		
		if (!proyecto) {
			// Si no se encuentra el proyecto, redirigir a la página de detalles (que mostrará 404)
			goto(`/proyectos/${proyectoId}`, { replaceState: true });
			return;
		}

		// Obtener el estado del proyecto
		const estadoCodigo = getEstadoCodigo(proyecto.estado, proyecto.estado_id);

		// Redirigir según el estado del proyecto
		if (estadoCodigo === 'pendiente_solicitud_cierre') {
			// Si está pendiente de solicitud de cierre, redirigir a la página de solicitar cierre
			goto(`/institucion/solicitar-cierre?proyecto=${proyectoId}`, { replaceState: true });
		} else {
			// Para otros estados (en_curso, completado, etc.), redirigir a la página de detalles del proyecto
			goto(`/proyectos/${proyectoId}`, { replaceState: true });
		}
	});
</script>

<svelte:head>
	<title>Redirigiendo... - Conectando Corazones</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="max-w-2xl mx-auto text-center">
		<p class="text-gray-600">Redirigiendo...</p>
	</div>
</div>
