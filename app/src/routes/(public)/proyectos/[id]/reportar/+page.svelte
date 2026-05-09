<script lang="ts">
	import { page } from '$app/stores';
	import ModalReportarIrregularidad from '$lib/components/ui/ModalReportarIrregularidad.svelte';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let proyecto = $derived(data.proyecto);

	function handleClose() {
		if (proyecto) {
			goto(`/proyectos/${proyecto.id_proyecto}`);
		} else {
			goto('/proyectos');
		}
	}

	async function handleSuccess() {
		if (proyecto) {
			await goto(`/proyectos/${proyecto.id_proyecto}`, { invalidateAll: true });
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
		onsuccess={handleSuccess}
	/>
{/if}
