<!--
* Página: Solicitudes de colaboracion de una institucion
* Descripción: Gestión de colaboraciones recibidas para proyectos de la institución
-->

<script lang="ts">
	import GestionColaboraciones from '$lib/components/feature/institucion/GestionColaboraciones.svelte';
	import type { PageData } from './$types';
	import { fly } from 'svelte/transition';
	import { page } from '$app/stores';
	import { setBreadcrumbs } from '$lib/stores/breadcrumbs';

	export let data: PageData;

	// Breadcrumbs contextuales
	$: {
		const proyectoIdParam = $page.url.searchParams.get('proyecto');
		const proyecto = proyectoIdParam
			? data.proyectos.find((p: any) => String(p.id_proyecto) === proyectoIdParam)
			: null;

		if (proyecto) {
			setBreadcrumbs([
				{ label: 'Inicio', href: '/' },
				{ label: 'Proyectos', href: '/proyectos' },
				{ label: proyecto.titulo, href: `/proyectos/${proyecto.id_proyecto}` },
				{ label: 'Solicitudes' }
			]);
		} else {
			setBreadcrumbs([
				{ label: 'Inicio', href: '/' },
				{ label: 'Mi Panel', href: '/institucion/mi-panel' },
				{ label: 'Solicitudes' }
			]);
		}
	}
</script>

<div in:fly={{ y: 20, duration: 400, delay: 100 }}>
	<GestionColaboraciones proyectos={data.proyectos} />
</div>
