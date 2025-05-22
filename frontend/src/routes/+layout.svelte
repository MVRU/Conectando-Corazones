<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/layout/Header.svelte';

	let { children } = $props();
</script>

<!-- Agregar Header a todas las páginas -->
<Header />

{@render children()}
