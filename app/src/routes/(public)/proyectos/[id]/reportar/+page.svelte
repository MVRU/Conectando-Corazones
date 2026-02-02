<script lang="ts">
	import { page } from '$app/stores';
	import ModalReportarIrregularidad from '$lib/components/ui/ModalReportarIrregularidad.svelte';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;
	$: proyecto = data.proyecto;

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
		onclose={handleClose}
	/>
{/if}
