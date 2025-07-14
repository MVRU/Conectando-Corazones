<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Breadcrumbs from '$lib/components/ui/navigation/Breadcrumbs.svelte';
	import { breadcrumbs, clearBreadcrumbs } from '$lib/stores/breadcrumbs';
	import MotionNotice from '$lib/components/feedback/MotionNotice.svelte';
	import '$lib/stores/reducedMotion';
	import ScrollToTop from '$lib/components/ui/navigation/ScrollToTop.svelte';
	import { beforeNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { authActions } from '$lib/stores/auth';

	/**
	 * ! DECISIÓN DE DISEÑO
	 * -!- El store centraliza las migas y decide cuándo mostrar el componente
	 * -!- Se limpian antes de navegar para evitar estados huérfanos
	 */

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

{#if $breadcrumbs.length}
	<Breadcrumbs />
{/if}

<ScrollToTop />

<main class="min-h-screen">
	<slot />
</main>

<Footer />
