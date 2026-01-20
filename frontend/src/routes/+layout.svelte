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
	import { beforeNavigate, goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { authActions, canAccessRoute, isLoading } from '$lib/stores/auth';
	import { toastStore } from '$lib/stores/toast';
	import ToastHost from '$lib/components/ui/feedback/ToastHost.svelte';

	const breadcrumbs = breadcrumbsStore;

	let showBreadcrumbs = false;
	$: showBreadcrumbs = shouldShowBreadcrumbs($page.url.pathname) && $breadcrumbs.length >= 2;

	let mounted = false;
	/**
	 * * Limpia migas de pan al cambiar de ruta para evitar estados huérfanos
	 */
	onMount(async () => {
		beforeNavigate(clearBreadcrumbs);
		await authActions.checkAuth();
		mounted = true;
	});

	$: if (mounted && !$isLoading) {
		if (!canAccessRoute($page.url.pathname)) {
			goto('/iniciar-sesion');
		}
	}

	$: {
		const error = $page.url.searchParams.get('error');
		if (error === 'already_logged_in') {
			setTimeout(() => {
				toastStore.show({
					title: 'Sesión activa',
					message: 'Ya iniciaste sesión. Si deseás registrarte nuevamente, cerrá la sesión actual.',
					variant: 'info'
				});

				const newUrl = new URL($page.url);
				newUrl.searchParams.delete('error');
				window.history.replaceState({}, '', newUrl.toString());
			}, 0);
		}
	}
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
