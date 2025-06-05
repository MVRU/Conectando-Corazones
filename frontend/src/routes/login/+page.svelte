<script>
	import Loader from '$lib/components/feedback/Loader.svelte';
	import { onMount } from 'svelte';
</script>

<main class="relative h-screen w-screen px-8">
	<h2 class="text-[rgb(var(--base-color))]">Iniciar sesión</h2>
	<Loader size={100} loading={true} />
</main>
