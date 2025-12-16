<script lang="ts">

	import '../app.css';

	import Header from '$lib/components/layout/Header.svelte';

	import Footer from '$lib/components/layout/Footer.svelte';

	import Breadcrumbs from '$lib/components/ui/navegacion/Breadcrumbs.svelte';

	import MotionNotice from '$lib/components/feedback/MotionNotice.svelte';

	import '$lib/stores/reducedMotion';

	import { breadcrumbs as breadcrumbsStore, clearBreadcrumbs } from '$lib/stores/breadcrumbs';

	import { shouldShowBreadcrumbs } from '$lib/config/breadcrumbs.config';

	import { page } from '$app/stores';

	import ScrollToTop from '$lib/components/ui/navegacion/ScrollToTop.svelte';

	import { beforeNavigate } from '$app/navigation';

	import { onMount } from 'svelte';

	import { authActions, isAdmin } from '$lib/stores/auth';



	const breadcrumbs = breadcrumbsStore;



	let showBreadcrumbs = false;

	$: showBreadcrumbs = shouldShowBreadcrumbs($page.url.pathname) && $breadcrumbs.length >= 2;



	let esVistaAdmin = false;

	// TODO: mover esta lógica de detección de admin a un guard de rutas o a load functions cuando se integre backend real.

	$: esVistaAdmin = $isAdmin && $page.url.pathname.startsWith('/admin');



	onMount(() => {

		beforeNavigate(clearBreadcrumbs);

		// TODO(front): revisar si checkAuth debe ejecutarse aquí o en un layout más específico cuando haya SSR.

		authActions.checkAuth();

	});

</script>



{#if !esVistaAdmin}

	<Header />

	<MotionNotice />

{/if}



{#if showBreadcrumbs && !esVistaAdmin}

	<Breadcrumbs />

{/if}



<ScrollToTop />



<main class="min-h-screen">

	<slot />

</main>



{#if !esVistaAdmin}

	<Footer />

{/if}

