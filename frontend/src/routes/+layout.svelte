<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';

	let { children } = $props();
</script>

<!-- Agregar Header a todas las páginas -->
<Header />

<!-- Contenido principal -->
<main class="min-h-screen">
	{@render children()}
</main>

<!-- Footer en todas las páginas -->
<Footer />
