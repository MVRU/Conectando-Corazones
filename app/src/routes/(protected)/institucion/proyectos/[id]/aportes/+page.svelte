<script lang="ts">
	import AportesList from '$lib/components/feature/aportes/AportesList.svelte';
	import { setBreadcrumbs } from '$lib/stores/breadcrumbs';
	import { page } from '$app/stores';
	let { data } = $props();

	const projectId = $derived($page.params.id);

	$effect(() => {
		const nombre = data.projectName || data.proyecto?.titulo || 'Proyecto';
		setBreadcrumbs([
			{ label: 'Inicio', href: '/' },
			{ label: 'Mi Panel', href: '/institucion/mi-panel' },
			{ label: nombre, href: `/proyectos/${projectId}` },
			{ label: 'Aportes' }
		]);
	});
</script>

<AportesList
	colaboradores={data.colaboradores}
	participacion_permitida={data.proyecto.participacion_permitida}
	estado={data.proyecto.estado}
/>
