<script>
	import Loader from '$lib/components/feedback/Loader.svelte';
	import { onMount } from 'svelte';
	import { setBreadcrumbs, BREADCRUMB_ROUTES } from '$lib/stores/breadcrumbs';

	onMount(() => {
		setBreadcrumbs([BREADCRUMB_ROUTES.home, { label: 'Iniciar sesión' }]);
	});
</script>

<main class="relative h-screen w-screen px-8">
	<h2 class="text-[rgb(var(--base-color))]">Iniciar sesión</h2>
	<Loader size={100} loading={true} />
</main>
