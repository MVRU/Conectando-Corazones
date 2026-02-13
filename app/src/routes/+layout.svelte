<script lang="ts">
	import '../app.css';
	import type { LayoutData } from './$types';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Breadcrumbs from '$lib/components/ui/navegacion/Breadcrumbs.svelte';
	import { breadcrumbs, clearBreadcrumbs } from '$lib/stores/breadcrumbs';
	import { shouldShowBreadcrumbs } from '$lib/infrastructure/config/breadcrumbs.config';
	import { page } from '$app/stores';
	import ScrollToTop from '$lib/components/ui/navegacion/ScrollToTop.svelte';
	import { beforeNavigate, invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import {
		authActions,
		canAccessRoute,
		isLoading,
		authStore,
		unauthenticatedState
	} from '$lib/stores/auth';
	import { toastStore } from '$lib/stores/toast';
	import ToastHost from '$lib/components/ui/feedback/ToastHost.svelte';
	import { goto } from '$app/navigation';

	import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
	import { Usuario } from '$lib/domain/entities/Usuario';

	export let data: LayoutData;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	let showBreadcrumbs = false;
	$: showBreadcrumbs = shouldShowBreadcrumbs($page.url.pathname) && $breadcrumbs.length >= 2;

	let mounted = false;

	onMount(() => {
		beforeNavigate(clearBreadcrumbs);

		const { data: subscription } = supabase.auth.onAuthStateChange(
			(event: AuthChangeEvent, _session: Session | null) => {
				if (_session?.expires_at !== session?.expires_at) {
					invalidate('supabase:auth');
				}
			}
		);

		// Inicializar estado global de auth con datos del servidor
		if (data.usuario) {
			const usuarioInstance = new Usuario(data.usuario);
			authStore.update((s) => ({
				...s,
				usuario: usuarioInstance,
				isAuthenticated: true,
				isLoading: false
			}));
		} else {
			if (session) {
				authStore.update((s) => ({ ...s, isLoading: false }));
			} else {
				// Sin sesión
				authStore.set(unauthenticatedState);
			}
		}

		mounted = true;

		return () => subscription.subscription.unsubscribe();
	});

	$: if (mounted && !$isLoading) {
		if (!canAccessRoute($page.url.pathname)) {
			goto('/iniciar-sesion');
		}
	}

	import { browser } from '$app/environment';

	$: if (browser) {
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

<Header proyectos={data.proyectos} />
<ToastHost />

{#if showBreadcrumbs}
	<Breadcrumbs />
{/if}

<ScrollToTop />

<main class="min-h-screen">
	<slot />
</main>

<Footer />
