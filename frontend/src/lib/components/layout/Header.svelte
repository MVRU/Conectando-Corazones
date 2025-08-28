<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import Image from '$lib/components/ui/elementos/Image.svelte';
	import { page } from '$app/stores';
	import { isAuthenticated, usuario as usuarioStore, authActions } from '$lib/stores/auth';
	import type {
		Usuario,
		Institucion,
		Organizacion,
		Unipersonal,
		Administrador
	} from '$lib/types/Usuario';

	let menuAbierto = false;
	let visible = false;
	let mostrarHeader = true;
	let lastScrollY = 0;
	let headerRef: HTMLElement;
	let mostrarDropdown = false;

	$: isHome = $page.url.pathname === '/';

	$: navLinks = [
		{ label: 'Inicio', href: '/' },
		{ label: 'Nosotros', href: '/nosotros' },
		{ label: 'Proyectos', href: '/proyectos' },
		{ label: 'FAQ', href: isHome ? '#faq' : '/faq' },
		{ label: 'Contacto', href: isHome ? '#support' : '/contacto' }
	];

	async function handleLogout() {
		await authActions.logout();
		menuAbierto = false;
		mostrarDropdown = false;
	}

	function toggleDropdown() {
		mostrarDropdown = !mostrarDropdown;
	}

	function closeDropdownOnClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (mostrarDropdown && !target.closest('.user-menu-container')) {
			mostrarDropdown = false;
		}
	}

	/**
	 * * Desplaza suavemente a una sección interna, ajustando el offset por la altura del header
	 */
	function handleNavClick(event: MouseEvent, href: string) {
		menuAbierto = false; // cierra menú móvil

		if (href.startsWith('#')) {
			event.preventDefault();
			const id = href.slice(1);
			const target = document.getElementById(id);
			if (target) {
				const offset = headerRef?.offsetHeight ?? 0;
				const top = target.getBoundingClientRect().top + window.scrollY - offset;
				window.scrollTo({ top, behavior: 'smooth' });
			}
		} else {
			mostrarDropdown = false;
		}
	}

	onMount(() => {
		const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), {
			threshold: 0.1
		});

		if (headerRef) observer.observe(headerRef);

		window.addEventListener('click', closeDropdownOnClickOutside);

		const handleScroll = () => {
			const current = window.scrollY;
			if (current > 100 && current > lastScrollY) {
				mostrarHeader = false;
			} else {
				mostrarHeader = true;
			}
			lastScrollY = current;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			observer.disconnect();
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('click', closeDropdownOnClickOutside);
		};
	});
</script>

<!-- Fondo semitransparente para menú móvil -->
{#if menuAbierto}
	<div
		class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-out"
		aria-hidden="true"
		on:click={() => (menuAbierto = false)}
	></div>
{/if}

<!-- Header principal -->
<header
	bind:this={headerRef}
	class="sticky top-0 z-50 w-full bg-[rgb(var(--base-color))] text-white shadow-[0_2px_6px_rgba(0,0,0,.22)] transition-transform duration-500"
	style="transform:translateY({mostrarHeader ? 0 : -110}%);"
>
	<div class="mx-auto flex max-w-7xl items-center justify-between gap-8 px-5 py-4 md:px-8">
		<!-- Logo -->
		<div class="header-logo" style="animation:fadePop .8s .06s both; opacity:{visible ? 1 : 0};">
			<Image
				src="/logo-1.png"
				alt="Logo de Conectando Corazones"
				width="50px"
				animate="heartbeat"
				href="/"
			/>
		</div>

		<!-- Navegación Desktop -->
		<nav
			class="hidden items-center gap-8 md:flex"
			style="opacity:{visible ? 1 : 0}; transform:translateY({visible ? 0 : '12px'});"
		>
			{#each navLinks as { label, href }, i}
				<a
					{href}
					class="group relative px-1 py-2 text-base font-medium text-blue-100 transition-colors duration-200 hover:text-white"
					style="transition-delay:{i * 60}ms"
					on:click={(e) => handleNavClick(e, href)}
				>
					{label}
					<span
						class="absolute bottom-0 left-0 h-0.5 w-0 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300 transition-all duration-300 group-hover:w-full"
					></span>
				</a>
			{/each}
		</nav>

		<!-- Acciones -->
		<div
			class="flex items-center gap-3"
			style="opacity:{visible ? 1 : 0}; transform:translateX({visible ? 0 : '16px'});"
		>
			{#if $isAuthenticated}
				<!-- Dropdown Auth -->
				<div class="user-menu-container relative">
					<button
						aria-label="Abrir menú de usuario"
						aria-haspopup="true"
						aria-expanded={mostrarDropdown}
						on:click={toggleDropdown}
						class="h-10 w-10 overflow-hidden rounded-full border-2 border-blue-400/60 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
					>
						<img
							src={$usuarioStore?.url_foto ?? '/users/escuela-esperanza.jpg'}
							alt={`Foto de perfil`}
							class="h-full w-full cursor-pointer object-cover"
						/>
					</button>

					{#if mostrarDropdown}
						<ul
							class="absolute right-0 z-50 mt-3 w-56 overflow-hidden rounded-2xl border border-blue-500/20 bg-[#0f1029] text-white shadow-2xl"
							style="animation:scaleIn .3s cubic-bezier(0.16, 1, 0.3, 1) forwards;"
						>
							<li
								class="border-b border-blue-500/20 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-blue-300"
							>
								Mi cuenta
							</li>

							{#each [{ label: 'Perfil', href: '/perfil' }, { label: 'Mis proyectos', href: '/mis-proyectos' }, { label: 'Crear proyecto', href: '/proyectos/crear' }, { label: 'Configuración', href: '/configuracion' }] as item}
								<li>
									<a
										href={item.href}
										class="block px-4 py-3 text-sm font-medium transition-colors duration-200 hover:bg-blue-500/10 hover:text-blue-200"
										on:click={() => ((menuAbierto = false), (mostrarDropdown = false))}
									>
										{item.label}
									</a>
								</li>
							{/each}

							<li class="border-t border-blue-500/20">
								<button
									on:click={handleLogout}
									class="w-full cursor-pointer px-4 py-3 text-left text-sm font-medium text-red-400 transition-colors duration-200 hover:bg-red-500/10 hover:text-red-300"
								>
									Cerrar sesión
								</button>
							</li>
						</ul>
					{/if}
				</div>
			{:else}
				<!-- Solo en desktop -->
				<div class="hidden md:block">
					<Button label="Iniciar Sesión" href="/iniciar-sesion" />
				</div>
			{/if}

			<!-- Hamburguesa -->
			<button
				aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
				class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20 text-blue-100 transition-all duration-300 hover:bg-blue-600/30 focus:outline-none focus:ring-2 focus:ring-blue-400/50 md:hidden"
				on:click={() => (menuAbierto = !menuAbierto)}
			>
				<svg
					class="h-6 w-6 transition-transform duration-300"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					style="transform:rotate({menuAbierto ? 180 : 0}deg)"
				>
					{#if menuAbierto}
						<path d="M6 6l12 12M6 18L18 6" />
					{:else}
						<path d="M3 6h18M3 12h18M3 18h18" />
					{/if}
				</svg>
			</button>
		</div>
	</div>

	<!-- Menú Mobile -->
	{#if menuAbierto}
		<nav
			class="absolute left-0 right-0 top-full z-50 border-t border-blue-500/20 bg-[#0f1029] shadow-2xl md:hidden"
			style="animation:slideUp .4s cubic-bezier(0.22, 1, 0.36, 1) forwards;"
		>
			<div class="flex flex-col gap-1 px-5 py-4">
				{#if !$isAuthenticated}
					<a
						href="/iniciar-sesion"
						class="mb-2 rounded-lg px-4 py-3 text-base font-medium text-blue-300 transition-colors duration-200 hover:bg-blue-500/10 hover:text-white"
						on:click={() => (menuAbierto = false)}
					>
						Iniciar sesión
					</a>
				{/if}

				{#each navLinks as { label, href }, i}
					<a
						{href}
						class="group flex items-center rounded-lg px-4 py-3 text-base font-medium text-blue-100 transition-colors duration-200 hover:bg-blue-500/10 hover:text-white"
						style="transition-delay:{i * 60}ms"
						on:click={(e) => handleNavClick(e, href)}
					>
						<span>{label}</span>
						<span class="ml-auto opacity-0 transition-opacity duration-200 group-hover:opacity-100">
							→
						</span>
					</a>
				{/each}
			</div>
		</nav>
	{/if}
</header>

<style>
	@keyframes scaleIn {
		from {
			opacity: 0;
			transform: scale(0.95) translateY(-8px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
