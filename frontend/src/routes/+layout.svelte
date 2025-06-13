<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Breadcrumbs from '$lib/components/ui/Breadcrumbs.svelte';
	import MotionNotice from '$lib/components/ui/MotionNotice.svelte';
	import { breadcrumbs, clearBreadcrumbs } from '$lib/stores/breadcrumbs';
	import ScrollToTop from '$lib/components/ui/ScrollToTop.svelte';
	import { beforeNavigate } from '$app/navigation';
	import { onMount } from 'svelte';

	// * Limpia migas de pan al cambiar de ruta para evitar estados huérfanos
	onMount(() => {
		beforeNavigate(clearBreadcrumbs);
	});
</script>

<Header />
<MotionNotice />

<Breadcrumbs items={$breadcrumbs} />

<ScrollToTop />

<main class="min-h-screen">
	<slot />
</main>

<Footer />
