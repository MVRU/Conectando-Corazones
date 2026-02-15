<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import AportesList from '$lib/components/feature/aportes/AportesList.svelte';
	import ModalDetalle from '$lib/components/feature/aportes/ModalDetalle.svelte';
	import { setBreadcrumbs } from '$lib/stores/breadcrumbs';

	let { data } = $props();
	let projectId = $derived($page.params.id);
	let isMobile = $state(false);

	$effect(() => {
		setBreadcrumbs([
			{ label: 'Inicio', href: '/' },
			{ label: 'Mi Panel', href: '/institucion/mi-panel' },
			{ label: 'Aportes', href: `/institucion/proyectos/${projectId}/aportes` },
			{ label: 'Colaborador' }
		]);
	});

	onMount(() => {
		const mql = window.matchMedia('(max-width: 640px)');
		isMobile = mql.matches;
		const listener = (e: MediaQueryListEvent) => (isMobile = e.matches);
		mql.addEventListener('change', listener);
		return () => mql.removeEventListener('change', listener);
	});

	function cerrarModal() {
		goto(`/institucion/proyectos/${projectId}/aportes`);
	}
</script>

<AportesList colaboradores={data.colaboradores} />
<ModalDetalle {data} {cerrarModal} {projectId} {isMobile} />
