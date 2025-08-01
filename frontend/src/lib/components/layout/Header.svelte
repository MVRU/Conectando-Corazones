<!--
* Componente: Header
	-*- Descripción: barra de navegación superior con logo, enlaces y gestión de sesión.
	-*- Se añadió avatar con menú desplegable para acceder a opciones de usuario.

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
	let showDropdown = false;

	$: isHome = $page.url.pathname === '/';

	$: navLinks = [
		{ label: 'Inicio', href: '/' },
		{ label: 'Acerca de', href: '/about' },
		{ label: 'Proyectos', href: '/projects' },
		{ label: 'FAQ', href: isHome ? '#faq' : '/faq' },
		{ label: 'Contacto', href: isHome ? '#support' : '/contact' }
	];

	// Función para manejar el logout
	async function handleLogout() {
		await authActions.logout();
		menuOpen = false;
		showDropdown = false;
	}

	function toggleDropdown() {
		showDropdown = !showDropdown;
	}

	function closeDropdownOnClickOutside(event: MouseEvent) {
		if (showDropdown && !(event.target as HTMLElement).closest('.user-menu, .user-avatar')) {
			showDropdown = false;
		}
	}

	onMount(() => {
		const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.1 });
		if (headerRef) io.observe(headerRef);

		window.addEventListener('click', closeDropdownOnClickOutside);

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
			window.removeEventListener('click', closeDropdownOnClickOutside);
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

		<!-- *Usuario + Hamburguesa (todos los dispositivos) -->
		<div
			class="flex items-center gap-4"
			style="animation:fadeSlide .7s .54s both; opacity:{visible ? 1 : 0};"
		>
			<!-- Avatar (solo si autenticado) -->
			{#if $isAuthenticated}
				<div class="user-avatar relative">
					<button
						aria-label="Menú de usuario"
						aria-haspopup="menu"
						aria-expanded={showDropdown}
						on:click|stopPropagation={toggleDropdown}
						class="h-10 w-10 overflow-hidden rounded-full border-2 border-blue-300"
					>
						<img
							src={$user?.profile ?? '/users/escuela-esperanza.jpg'}
							alt="Foto de perfil"
							class="h-full w-full cursor-pointer object-cover"
						/>
					</button>

					{#if showDropdown}
						<ul
							class="user-menu absolute right-0 z-50 mt-2 w-40 rounded-lg border border-gray-200 bg-white py-2 text-sm text-gray-800 shadow-lg"
						>
							<li>
								<a
									href="/profile"
									class="block px-4 py-2 hover:bg-blue-50"
									on:click={() => (showDropdown = false)}>Perfil</a
								>
							</li>
							<li>
								<a
									href="/dashboard"
									class="block px-4 py-2 hover:bg-blue-50"
									on:click={() => (showDropdown = false)}>Dashboard</a
								>
							</li>
							<li>
								<a
									href="/settings"
									class="block px-4 py-2 hover:bg-blue-50"
									on:click={() => (showDropdown = false)}>Configuración</a
								>
							</li>
							<li>
								<button
									class="block w-full cursor-pointer px-4 py-2 text-left hover:bg-blue-50"
									on:click={handleLogout}>Cerrar Sesión</button
								>
							</li>
						</ul>
					{/if}
				</div>
			{:else}
				<!-- Botón de login visible en todos los tamaños -->
				<Button label="Iniciar Sesión" href="/login" />
			{/if}

			<!-- Botón hamburguesa -->
			<div class="md:hidden">
				<button
					aria-label="Abrir menú"
					class="relative z-50 flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
					on:click={() => (menuOpen = !menuOpen)}
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

			{#if !$isAuthenticated}
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

	.user-menu {
		animation: fadeSlide 0.3s both;
	}
</style>
