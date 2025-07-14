<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Breadcrumbs from '$lib/components/ui/navigation/Breadcrumbs.svelte';
	import MotionNotice from '$lib/components/feedback/MotionNotice.svelte';
	import '$lib/stores/reducedMotion';
	import { clearBreadcrumbs } from '$lib/stores/breadcrumbs';
	import ScrollToTop from '$lib/components/ui/navigation/ScrollToTop.svelte';
	import { beforeNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { authActions } from '$lib/stores/auth';

	// * Limpia migas de pan al cambiar de ruta para evitar estados huérfanos
	onMount(() => {
		beforeNavigate(clearBreadcrumbs);
		// Verificar autenticación al cargar la app
		authActions.checkAuth();
	});
</script>

<Header />
<MotionNotice />

<Breadcrumbs />

<ScrollToTop />

<main class="min-h-screen">
	<slot />
</main>

<Footer />
