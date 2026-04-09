<script lang="ts">
	import '../app.css';
	import type { LayoutData } from './$types';
	import { createBrowserClient, parse, serialize } from '@supabase/ssr';
	import { env } from '$lib/infrastructure/config/env';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Breadcrumbs from '$lib/components/ui/navegacion/Breadcrumbs.svelte';
	import { breadcrumbs, clearBreadcrumbs } from '$lib/stores/breadcrumbs';
	import { shouldShowBreadcrumbs } from '$lib/infrastructure/config/breadcrumbs.config';
	import { page } from '$app/state';
	import ScrollToTop from '$lib/components/ui/navegacion/ScrollToTop.svelte';
	import { beforeNavigate, invalidate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { syncAuthState } from '$lib/stores/auth';
	import { toastStore } from '$lib/stores/toast';
	import ToastHost from '$lib/components/ui/feedback/ToastHost.svelte';
	import { untrack } from 'svelte';

	import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
	import { Usuario } from '$lib/domain/entities/Usuario';

	import type { Snippet } from 'svelte';
	let { children, data }: { data: LayoutData; children: Snippet } = $props();

	const supabase = browser
		? createBrowserClient(env.SUPABASE_URL || '', env.SUPABASE_ANON_KEY || '', {
				cookies: {
					get(key) {
						return parse(document.cookie)[key];
					},
					set(key, value, options) {
						document.cookie = serialize(key, value, options);
					},
					remove(key, options) {
						document.cookie = serialize(key, '', { ...options, maxAge: 0 });
					}
				}
			})
		: null;
	let session = $derived(data.session);

	let showBreadcrumbs = $derived(shouldShowBreadcrumbs(page.url) && $breadcrumbs.length >= 2);

	$effect(() => {
		beforeNavigate(untrack(() => clearBreadcrumbs));
	});

	$effect(() => {
		if (!supabase) {
			return;
		}

		const { data: subscription } = supabase.auth.onAuthStateChange(
			(event: AuthChangeEvent, _session: Session | null) => {
				const currentSession = untrack(() => session);
				if (_session?.expires_at !== currentSession?.expires_at) {
					invalidate('supabase:auth');
				}
			}
		);

		return () => subscription.subscription.unsubscribe();
	});

	$effect(() => {
		syncAuthState(data.usuario ? new Usuario(data.usuario) : null);
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

<Header />
<ToastHost />

{#if showBreadcrumbs}
	<Breadcrumbs />
{/if}

<ScrollToTop />

<main class="min-h-screen">
	{@render children()}
</main>

<Footer />
