<!--
* Componente: Header
	-*- Descripción: barra de navegación superior con logo, enlaces y botón de inicio de sesión.

* Props:
-*- `menuOpen`: Estado del menú móvil (abierto/cerrado).
-*- `visible`: Indica si el header es visible en la pantalla.
-*- `showHeader`: Controla la visibilidad del header al hacer scroll.
-*- `lastScrollY`: Guarda la última posición del scroll para determinar si ocultar el header.
-*- `navLinks`: Array de objetos con `label` y `href` para los enlaces de navegación.
-->

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
        import Button from '$lib/components/ui/elements/Button.svelte';
        import Image from '$lib/components/ui/elements/Image.svelte';
	import { page } from '$app/stores';
	import { isAuthenticated, user, authActions } from '$lib/stores/auth';

	let menuOpen = false;
	let visible = false;
	let showHeader = true;
	let lastScrollY = 0;
	let headerRef: HTMLElement;

	$: isHome = $page.url.pathname === '/';

	$: navLinks = [
		{ label: 'Inicio', href: '/' },
		{ label: 'Acerca de', href: '/about' },
		{ label: 'Proyectos', href: '/projects' },
		{ label: 'FAQ', href: isHome ? '#faq' : '/faq' },
		{ label: 'Contacto', href: isHome ? '#support' : '/contact' },
		{ label: 'Configuracion', href: '/settings' }
	];

	// Función para manejar el logout
	async function handleLogout() {
		await authActions.logout();
		menuOpen = false;
	}

	onMount(() => {
		const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.1 });
		if (headerRef) io.observe(headerRef);

		const onScroll = () => {
			const currentScroll = window.scrollY;
			if (currentScroll > 600 && currentScroll > lastScrollY) {
				showHeader = false;
			} else {
				showHeader = true;
			}
			lastScrollY = currentScroll;
		};
		window.addEventListener('scroll', onScroll);

		return () => {
			io.disconnect();
			window.removeEventListener('scroll', onScroll);
		};
	});
</script>

{#if menuOpen}
	<div
		class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
		role="button"
		tabindex="0"
		aria-label="Cerrar menú"
		on:click={() => (menuOpen = false)}
		on:keydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') menuOpen = false;
		}}
	></div>
{/if}

<header
	bind:this={headerRef}
	class="sticky top-0 z-50 w-full bg-[rgb(var(--base-color))] text-white shadow-[0_2px_6px_rgba(0,0,0,.22)] transition-transform duration-500"
	style="transform:translateY({showHeader ? 0 : -110}%);"
>
	<div class="mx-auto flex max-w-7xl items-center justify-between gap-8 px-5 py-4 md:px-8">
		<!-- *Logo animado -->
		<div class="header-logo" style="animation:fadePop .8s .06s both; opacity:{visible ? 1 : 0};">
			<Image
				src="/logo-1.png"
				alt="Logo de Conectando Corazones"
				width="50px"
				animate="heartbeat"
				href="/"
			/>
		</div>

		<!-- *Nav Desktop -->
		<nav class="hidden items-center gap-8 text-[17px] font-semibold md:flex">
			{#each navLinks as { label, href }, i}
				<a
					{href}
					class="nav-link inline-block"
					style="animation:fadeSlide .64s both;animation-delay:{(i + 1) * 90 +
						100}ms; opacity:{visible ? 1 : 0};">{label}</a
				>
			{/each}
		</nav>

		<!-- *CTA Desktop -->
		<div
			class="hidden md:block"
			style="animation:fadeSlide .7s .54s both; opacity:{visible ? 1 : 0};"
		>
			{#if $isAuthenticated}
				<div class="flex items-center gap-4">
					<span class="text-sm text-gray-300">Hola, {$user?.nombre}</span>
					<Button label="Mi Perfil" href="/perfil" />
					<Button label="Configuración" href="/settings" variant="ghost" />
					<button
						on:click={handleLogout}
						class="cta-minimal-shine-btn rounded-4xl group relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden border border-blue-400 bg-white/5 font-semibold tracking-tight text-blue-400 shadow-none outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-300 h-12 min-w-[140px] px-8 py-3 md:h-14"
					>
						<span class="relative z-10 flex items-center gap-2 transition-colors duration-200">
							Cerrar Sesión
							<svg
								class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="#3b82f6"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M5 12h14M12 5l7 7-7 7" />
							</svg>
						</span>
						<span class="cta-btn-bg pointer-events-none absolute inset-0 z-0"></span>
					</button>
				</div>
			{:else}
				<Button label="Iniciar Sesión" href="/login" />
			{/if}
		</div>

		<!-- *Hamburguesa Mobile -->
		<div class="md:hidden">
			<button
				aria-label="Abrir menú"
				class="relative z-50 flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
				on:click={() => (menuOpen = !menuOpen)}
				style="animation:fadePop .7s .36s both; opacity:{visible ? 1 : 0};"
			>
				<svg
					class="h-7 w-7 transition-transform duration-300"
					style="transform:rotate({menuOpen ? 180 : 0}deg)"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					{#if menuOpen}
						<path d="M6 6l12 12M6 18L18 6" />
					{:else}
						<path d="M3 6h18M3 12h18M3 18h18" />
					{/if}
				</svg>
			</button>
		</div>
	</div>

	{#if menuOpen}
		<!-- *Menú Mobile -->
		<nav
			class="mobile-menu absolute left-0 right-0 top-full z-50 flex flex-col gap-5
			bg-[#0f1028] px-8 py-8 shadow-2xl backdrop-blur-md"
			style="animation:slideInDown 0.45s cubic-bezier(.4,0,.2,1) both"
		>
			{#each navLinks as { label, href }, j}
				<a
					{href}
					class="mobile-link self-start"
					style="animation:fadeSlide .6s both;animation-delay:{j * 100 + 120}ms"
					on:click={() => (menuOpen = false)}>{label}</a
				>
			{/each}
			
			{#if $isAuthenticated}
				<div class="space-y-3">
					<div class="text-sm text-gray-300">Hola, {$user?.nombre}</div>
					<Button label="Mi Perfil" href="/perfil" variant="ghost" />
					<Button label="Configuración" href="/settings" variant="ghost" />
					<button
						on:click={handleLogout}
						class="cta-minimal-shine-btn rounded-4xl group relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden border border-blue-400 bg-white/5 font-semibold tracking-tight text-blue-400 shadow-none outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-300 h-12 min-w-[140px] px-8 py-3 md:h-14"
					>
						<span class="relative z-10 flex items-center gap-2 transition-colors duration-200">
							Cerrar Sesión
							<svg
								class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="#3b82f6"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M5 12h14M12 5l7 7-7 7" />
							</svg>
						</span>
						<span class="cta-btn-bg pointer-events-none absolute inset-0 z-0"></span>
					</button>
				</div>
			{:else}
				<div
					role="button"
					tabindex="0"
					on:click={() => (menuOpen = false)}
					on:keydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							menuOpen = false;
						}
					}}
					aria-label="Iniciar Sesión"
				>
					<Button label="Iniciar Sesión" href="/login" variant="ghost" />
				</div>
			{/if}
		</nav>
	{/if}
</header>

<style>
	.header-logo {
		display: flex;
		align-items: center;
	}

	.nav-link,
	.mobile-link {
		position: relative;
		opacity: 0.85;
		transition:
			color 0.25s,
			opacity 0.22s;
		padding-bottom: 2px;
	}
	.nav-link::after,
	.mobile-link::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -2px;
		height: 2px;
		width: 0;
		border-radius: 2px;
		background: linear-gradient(90deg, #60a5fa 0%, #bae6fd 100%);
		transition: width 0.34s cubic-bezier(0.42, 0, 0.18, 1);
	}
	.nav-link:hover::after,
	.mobile-link:hover::after {
		width: 100%;
	}
	.nav-link:hover,
	.mobile-link:hover {
		color: #7dd3fc;
		opacity: 1;
	}

	/* --- Animaciones personalizadas --- */
	@keyframes fadeSlide {
		0% {
			opacity: 0;
			transform: translateY(-16px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}
	@keyframes fadePop {
		0% {
			opacity: 0;
			transform: scale(0.85);
		}
		80% {
			opacity: 1;
			transform: scale(1.06);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}
	@keyframes slideInDown {
		from {
			opacity: 0;
			transform: translateY(-28px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
