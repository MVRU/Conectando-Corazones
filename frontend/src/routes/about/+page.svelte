<!-- TODO: sacar el test de breadcrumbs, es solo de muestra -->

<script>
	import Loader from '$lib/components/feedback/Loader.svelte';
	import { onMount } from 'svelte';
	import Breadcrumbs from '$lib/components/ui/Breadcrumbs.svelte';

	// EJEMPLO PARA TESTEAR LOS BREADCRUMBS PROFUNDOS
	const testItems = [
		{ label: 'Inicio', href: '/' },
		{ label: 'Proyectos', href: '/proyectos' },
		{ label: 'Solidaridad', href: '/proyectos/solidaridad' },
		{ label: 'Rosario', href: '/proyectos/solidaridad/internacionales' },
		{ label: 'Proyecto A', href: '/proyectos/solidaridad/internacionales/proyecto-a' },
		{
			label: 'Donaciones 2025',
			href: '/proyectos/solidaridad/internacionales/proyecto-a/donaciones-2024'
		}
	];
</script>

<Breadcrumbs items={testItems} />
<main class="relative h-screen w-screen px-8">
	<h2 class="text-4xl text-[rgb(var(--base-color))]">Acerca de</h2>
	<!-- <Loader size={100} loading={true} /> -->
</main>
