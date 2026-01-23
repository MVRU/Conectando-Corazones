<script lang="ts">
	import { page } from '$app/stores';
	import { mockProyectos } from '$lib/infrastructure/mocks/mock-proyectos';
	import ModalReportarIrregularidad from '$lib/components/ui/ModalReportarIrregularidad.svelte';
	import { goto } from '$app/navigation';

	$: id = $page.params.id;
	$: proyecto = mockProyectos.find((p) => p.id_proyecto?.toString() === id);

	function handleClose() {
		if (proyecto) {
			goto(`/proyectos/${proyecto.id_proyecto}`);
		} else {
			goto('/proyectos');
		}
	}
</script>

{#if proyecto}
	<ModalReportarIrregularidad
		open={true}
		tipo_objeto="Proyecto"
		id_objeto={proyecto.id_proyecto ?? 0}
		nombre_objeto={proyecto.titulo}
		on:close={handleClose}
	/>
{/if}
