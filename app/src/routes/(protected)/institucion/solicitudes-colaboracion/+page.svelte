<!--
* Página: Solicitudes de colaboracion de una institucion
* Descripción: Gestión de colaboraciones recibidas para proyectos de la institución

TODO: este componente está roto, no muestra nada

-->

<script lang="ts">
	import GestionColaboraciones from '$lib/components/feature/institucion/GestionColaboraciones.svelte';
	import type { PageData } from './$types';
	import { fly } from 'svelte/transition';

	export let data: PageData;
</script>

<div in:fly={{ y: 20, duration: 400, delay: 100 }}>
	<GestionColaboraciones proyectos={data.proyectos} />
</div>
