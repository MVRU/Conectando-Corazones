<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Breadcrumbs from '$lib/components/ui/navegacion/Breadcrumbs.svelte';
	import MotionNotice from '$lib/components/feedback/MotionNotice.svelte';
	import '$lib/stores/reducedMotion';
	import { breadcrumbs, clearBreadcrumbs } from '$lib/stores/breadcrumbs';
	import { shouldShowBreadcrumbs } from '$lib/config/breadcrumbs.config';
	import { page } from '$app/stores';
import ScrollToTop from '$lib/components/ui/navegacion/ScrollToTop.svelte';
import { beforeNavigate } from '$app/navigation';
import { onMount } from 'svelte';
import { authActions } from '$lib/stores/auth';
import ToastHost from '$lib/components/ui/feedback/ToastHost.svelte';

	/**
	 * ! DECISIÓN DE DISEÑO
	 * -!- Se muestran Breadcrumbs sólo cuando existen migas configuradas.
	 */

	let showBreadcrumbs = false;
	$: showBreadcrumbs = shouldShowBreadcrumbs($page.url.pathname) && $breadcrumbs.length >= 2;

	/**
	 * * Limpia migas de pan al cambiar de ruta para evitar estados huérfanos
	 */
	onMount(() => {
		beforeNavigate(clearBreadcrumbs);
		authActions.checkAuth();
	});
</script>

<Header />
<MotionNotice />
<ToastHost />

{#if showBreadcrumbs}
	<Breadcrumbs />
{/if}

<ScrollToTop />

<main class="min-h-screen">
	<slot />
</main>

<Footer />
