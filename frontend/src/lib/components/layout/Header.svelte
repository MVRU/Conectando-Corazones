<!--
* Componente: Header
	-*- Descripción: barra de navegación superior con logo, enlaces y botón de registro.

* Props:
-*- `menuOpen`: Estado del menú móvil (abierto/cerrado).
-*- `visible`: Indica si el header es visible en la pantalla.
-*- `showHeader`: Controla la visibilidad del header al hacer scroll.
-*- `lastScrollY`: Guarda la última posición del scroll para determinar si ocultar el header.
-*- `navLinks`: Array de objetos con `label` y `href` para los enlaces de navegación.

TODO:
	- [ ] Agregar overlay oscuro al abrir el menú móvil.
-->

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Image from '$lib/components/ui/Image.svelte';

	let menuOpen = false;
	let visible = false;
	let showHeader = true;
	let lastScrollY = 0;
	let headerRef: HTMLElement;

	// Rutas de navegación (esto permite agregar más en el futuro o cambiarlas sin modificar el código)
	const navLinks = [
		{ label: 'Inicio', href: '/' },
		{ label: 'Acerca de', href: '/about' },
		{ label: 'Proyectos', href: '/projects' },
		{ label: 'FAQ', href: '/faq' },
		{ label: 'Contacto', href: '/contact' }
	];

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

<header
	bind:this={headerRef}
	class="sticky top-0 z-50 w-full bg-[rgb(var(--base-color))] text-white shadow-[0_2px_6px_rgba(0,0,0,.22)] transition-transform duration-500"
	style="transform:translateY({showHeader ? 0 : -110}%);"
>
	<div class="mx-auto flex max-w-7xl items-center justify-between gap-8 px-5 py-4 md:px-8">
		<!-- Logo animado -->
		<div class="header-logo" style="animation:fadePop .8s .06s both; opacity:{visible ? 1 : 0};">
			<Image
				src="/logo-1.png"
				alt="Logo de Conectando Corazones"
				width="50px"
				animate="heartbeat"
				href="/"
			/>
		</div>

		<!-- Nav Desktop -->
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

		<!-- CTA Desktop -->
		<div
			class="hidden md:block"
			style="animation:fadeSlide .7s .54s both; opacity:{visible ? 1 : 0};"
		>
			<Button label="Registrarse" href="/signin" />
		</div>

		<!-- Hamburguesa Mobile -->
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

	<!-- Menú Mobile -->
	{#if menuOpen}
		<nav
			class="mobile-menu absolute left-0 right-0 top-full z-50 flex flex-col gap-5
			bg-[rgba(24,25,46,0.98)] px-8 py-8 shadow-2xl backdrop-blur-md"
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
			<div style="animation:fadePop .65s .52s both;">
				<Button label="Registrarse" href="/signin" variant="ghost" />
			</div>
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
