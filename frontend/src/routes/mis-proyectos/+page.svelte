<script lang="ts">
	import MisProyectos from '$lib/components/proyectos/MisProyectos.svelte';
	import { usuario } from '$lib/stores/auth';
</script>

<svelte:head>
	<title>Mis Proyectos - Conectando Corazones</title>
	<meta
		name="description"
		content="Gestiona tus proyectos activos y revisa tu historial de colaboraciones"
	/>
</svelte:head>

<main class="relative min-h-screen w-full bg-gray-50">
	<MisProyectos usuario={$usuario} />
</main>
