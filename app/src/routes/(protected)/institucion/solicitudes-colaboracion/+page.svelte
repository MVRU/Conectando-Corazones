<!--
* Página: Solicitudes de colaboracion de una institucion
* Descripción: Gestión de colaboraciones recibidas para proyectos de la institución
-->

<script lang="ts">
	import GestionColaboraciones from '$lib/components/feature/institucion/GestionColaboraciones.svelte';
	import type { PageData } from './$types';
	import { fly } from 'svelte/transition';
	import { setBreadcrumbs } from '$lib/stores/breadcrumbs';

	export let data: PageData;

	setBreadcrumbs([
		{ label: 'Inicio', href: '/' },
		{ label: 'Mi Panel', href: '/institucion/mi-panel' },
		{ label: 'Solicitudes' }
	]);
</script>

<div in:fly={{ y: 20, duration: 400, delay: 100 }}>
	<GestionColaboraciones proyectos={data.proyectos} />
</div>
