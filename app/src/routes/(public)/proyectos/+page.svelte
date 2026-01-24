<script lang="ts">
	import Proyectos from '$lib/components/feature/proyectos/Proyectos.svelte';
	// @ts-ignore
	export let data;
</script>

<svelte:head>
	<title>Proyectos - Conectando Corazones</title>
	<meta
		name="description"
		content="Descubrí todos los proyectos abiertos que necesitan tu colaboración"
	/>
</svelte:head>

<main class="relative min-h-screen w-full bg-gray-50">
	<Proyectos proyectos={data.proyectos} provinciasDisponibles={data.provincias} />
</main>
