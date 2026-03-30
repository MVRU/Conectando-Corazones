<script lang="ts">
	import '../app.css';
	import type { LayoutData } from './$types';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Breadcrumbs from '$lib/components/ui/navegacion/Breadcrumbs.svelte';
	import { breadcrumbs, clearBreadcrumbs } from '$lib/stores/breadcrumbs';
	import { shouldShowBreadcrumbs } from '$lib/infrastructure/config/breadcrumbs.config';
	import { page } from '$app/state';
	import ScrollToTop from '$lib/components/ui/navegacion/ScrollToTop.svelte';
	import { beforeNavigate, invalidate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { canAccessRoute, isLoading, authStore, unauthenticatedState, type AuthState } from '$lib/stores/auth';
	import { toastStore } from '$lib/stores/toast';
	import ToastHost from '$lib/components/ui/feedback/ToastHost.svelte';
	import { goto } from '$app/navigation';
	import { untrack } from 'svelte';

	import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
	import { Usuario } from '$lib/domain/entities/Usuario';

	import type { Snippet } from 'svelte';
	let { children, data }: { data: LayoutData; children: Snippet } = $props();

	let supabase = $derived(data.supabase);
	let session = $derived(data.session);

	let showBreadcrumbs = $derived(
		shouldShowBreadcrumbs(page.url.pathname) && $breadcrumbs.length >= 2
	);

	let mounted = $state(false);

	$effect(() => {
		beforeNavigate(untrack(() => clearBreadcrumbs));

		const { data: subscription } = supabase.auth.onAuthStateChange(
			(event: AuthChangeEvent, _session: Session | null) => {
				const currentSession = untrack(() => session);
				if (_session?.expires_at !== currentSession?.expires_at) {
					invalidate('supabase:auth');
				}
			}
		);

		// Inicializar estado global de auth con datos del servidor
		let authValue: AuthState;
		const unsubscribe = authStore.subscribe(v => { authValue = v; });
		unsubscribe(); 

		const userFromData = data.usuario;

		if (userFromData) {
			const usuarioInstance = new Usuario(userFromData);
			// Solo actualizar si el usuario cambió o no estaba autenticado
			// id_usuario es el identificador en nuestra entidad Usuario
			if (!authValue!.isAuthenticated || authValue!.usuario?.id_usuario !== userFromData.id_usuario) {
				authStore.update((s) => ({
					...s,
					usuario: usuarioInstance,
					isAuthenticated: true,
					isLoading: false
				}));
			}
		} else {
			if (session) {
				if (authValue!.isLoading) {
					authStore.update((s) => ({ ...s, isLoading: false }));
				}
			} else {
				// Sin sesión, solo resetear si no estábamos ya en unauthenticatedState
				if (authValue!.isAuthenticated || authValue!.isLoading) {
					authStore.set(unauthenticatedState);
				}
			}
		}

		mounted = true;

		return () => subscription.subscription.unsubscribe();
	});

	$effect(() => {
		// Acceso reactivo a mounted e isLoading
		// No bloqueamos el renderizado con isLoading, permitimos que children() se rinda siempre.
		// El guard de ruta solo actúa después de que el sistema está montado.
		if (mounted && !$isLoading) {
			if (!canAccessRoute(page.url.pathname)) {
				goto('/iniciar-sesion');
			}
		}
	});

	$effect(() => {
		if (browser) {
			const error = page.url.searchParams.get('error');
			if (error === 'already_logged_in') {
				setTimeout(() => {
					toastStore.show({
						title: 'Sesión activa',
						message: 'Ya iniciaste sesión. Si deseás registrarte nuevamente, cerrá la sesión actual.',
						variant: 'info'
					});

					const newUrl = new URL(page.url);
					newUrl.searchParams.delete('error');
					window.history.replaceState({}, '', newUrl.toString());
				}, 0);
			}

			const reason = page.url.searchParams.get('reason');
			if (reason === 'unauthenticated') {
				setTimeout(() => {
					toastStore.show({
						title: 'Acceso restringido',
						message: 'Necesitás iniciar sesión para acceder a esa página.',
						variant: 'warning'
					});

					const newUrl = new URL(page.url);
					newUrl.searchParams.delete('reason');
					window.history.replaceState({}, '', newUrl.toString());
				}, 0);
			} else if (reason === 'forbidden') {
				setTimeout(() => {
					toastStore.show({
						title: 'Sin permisos',
						message: 'No tenés permisos para acceder a esa sección.',
						variant: 'error'
					});

					const newUrl = new URL(page.url);
					newUrl.searchParams.delete('reason');
					window.history.replaceState({}, '', newUrl.toString());
				}, 0);
			}
		}
	});
</script>

<Header proyectos={data.proyectos} />
<ToastHost />

{#if showBreadcrumbs}
	<Breadcrumbs />
{/if}

<ScrollToTop />

<main class="min-h-screen">
	{@render children()}
</main>

<Footer />
