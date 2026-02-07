<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import Image from '$lib/components/ui/elementos/Image.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import {
		isAuthenticated,
		usuario as usuarioStore,
		authActions,
		isAdmin,
		isInstitucion,
		isColaborador,
		isInstitucionVerificada
	} from '$lib/stores/auth';
	import { layoutStore } from '$lib/stores/layout';
	import type { Proyecto } from '$lib/domain/types/Proyecto';
	import type { Verificacion } from '$lib/domain/types/Verificacion';
	import {
		MessageCircle,
		ChevronDown,
		LayoutDashboard,
		PlusCircle,
		User,
		FileText,
		Settings,
		LogOut,
		Menu,
		X,
		FileWarning
	} from 'lucide-svelte';

	export let proyectos: Proyecto[] = [];

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
		goto('/');
	}

	$: verificacionAprobada = $isInstitucionVerificada;

	$: proyectosEnCursoCount = $usuarioStore
		? proyectos.filter(
				(p) => p.institucion_id === $usuarioStore?.id_usuario && p.estado === 'en_curso'
			).length
		: 0;

	$: limiteProyectosAlcanzado = proyectosEnCursoCount >= 5;

	$: emailUsuario =
		$usuarioStore?.contactos?.find((c) => c.tipo_contacto === 'email' && c.etiqueta === 'principal')
			?.valor || 'Sin email';

	function toggleDropdown() {
		mostrarDropdown = !mostrarDropdown;
	}

	function closeDropdownOnClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (mostrarDropdown && !target.closest('.user-menu-container')) {
			mostrarDropdown = false;
		}
	}

	function handleNavClick(event: MouseEvent, href: string) {
		menuAbierto = false;
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
				layoutStore.setHeaderVisible(false);
			} else {
				mostrarHeader = true;
				layoutStore.setHeaderVisible(true);
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

{#if menuAbierto}
	<div
		class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
		aria-hidden="true"
		on:click={() => (menuAbierto = false)}
	></div>
{/if}

<header
	bind:this={headerRef}
	class="sticky top-0 z-50 w-full bg-[#0f1029] text-white shadow-lg transition-transform duration-500"
	style="transform:translateY({mostrarHeader ? 0 : -110}%);"
>
	<div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
		<!-- Logo -->
		<div class="header-logo shrink-0" style="opacity:{visible ? 1 : 0};">
			<Image
				src="/logo-1.png"
				alt="Logo de Conectando Corazones"
				width="45px"
				animate="heartbeat"
				href="/"
			/>
		</div>

		<!-- Navegación Desktop -->
		<nav
			class="hidden items-center gap-6 md:flex"
			style="opacity:{visible ? 1 : 0}; transform:translateY({visible ? 0 : '12px'});"
		>
			{#each navLinks as { label, href }, i (i)}
				<a
					{href}
					class="group relative px-1 py-1 text-sm font-medium text-blue-100 transition-colors duration-200 hover:text-white"
					style="transition-delay:{i * 50}ms"
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
			class="flex items-center gap-4"
			style="opacity:{visible ? 1 : 0}; transform:translateX({visible ? 0 : '16px'});"
		>
			{#if $isAuthenticated}
				<!-- Mis mensajes (Desktop) -->
				<div class="hidden md:block">
					<a
						href="/mensajes"
						class="group flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-200 transition-all hover:bg-blue-500/20 hover:text-white"
						title="Mis chats"
					>
						<MessageCircle class="h-4 w-4" />
						<span>Mis chats</span>
					</a>
				</div>

				<!-- Dropdown Auth -->
				<div class="user-menu-container relative hidden md:block">
					<button
						aria-label="Menú de usuario"
						aria-haspopup="true"
						aria-expanded={mostrarDropdown}
						on:click={toggleDropdown}
						class="flex items-center gap-2 rounded-full border border-transparent bg-transparent p-1 pr-3 pl-2 transition-all hover:bg-blue-500/10 focus:ring-2 focus:ring-blue-400/50 focus:outline-none active:scale-95 {mostrarDropdown
							? 'bg-blue-500/10 ring-2 ring-blue-400/50'
							: ''}"
					>
						<div class="h-8 w-8 overflow-hidden rounded-full border-2 border-blue-400/60">
							<img
								src={$usuarioStore?.url_foto ?? '/users/escuela-esperanza.jpg'}
								alt="Avatar"
								class="h-full w-full object-cover"
							/>
						</div>
						<div class="hidden flex-col items-start leading-none md:flex">
							<span class="text-sm font-semibold text-white"
								>{$usuarioStore?.nombre || 'Usuario'}</span
							>
						</div>
						<ChevronDown
							class="h-4 w-4 text-blue-200 transition-transform duration-200 {mostrarDropdown
								? 'rotate-180'
								: ''}"
						/>
					</button>

					{#if mostrarDropdown}
						<div
							class="absolute right-0 z-50 mt-2 w-64 origin-top-right overflow-hidden rounded-xl border border-blue-500/20 bg-[#161b33] shadow-2xl ring-1 ring-black/5"
							style="animation: scaleIn .2s ease-out forwards;"
						>
							<!-- Header del menú -->
							<div class="border-b border-blue-500/10 bg-blue-500/5 px-4 py-3">
								<p class="text-sm font-medium text-white">
									{$usuarioStore?.nombre}
									{$usuarioStore?.apellido}
								</p>
								<p class="truncate text-xs text-blue-300">{emailUsuario}</p>
							</div>

							<!-- Acciones Principales -->
							<div class="p-1">
								{#if $isInstitucion}
									{#if verificacionAprobada && !limiteProyectosAlcanzado}
										<a
											href="/proyectos/crear"
											class="group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-200 hover:bg-blue-500/20 hover:text-white"
											on:click={() => (mostrarDropdown = false)}
										>
											<PlusCircle class="h-4 w-4 text-blue-400 group-hover:text-blue-300" />
											Crear proyecto
										</a>
									{:else}
										<div
											class="flex w-full cursor-not-allowed items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 opacity-60"
											title={!verificacionAprobada
												? 'Debés tener la verificación aprobada'
												: 'Límite de proyectos alcanzado'}
										>
											<PlusCircle class="h-4 w-4" />
											Crear proyecto
										</div>
									{/if}
								{/if}

								<a
									href={$isInstitucion ? '/institucion/mi-panel' : '/colaborador/mi-panel'}
									class="group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-200 hover:bg-blue-500/20 hover:text-white"
									on:click={() => (mostrarDropdown = false)}
								>
									<LayoutDashboard class="h-4 w-4 text-blue-400 group-hover:text-blue-300" />
									{$isAdmin ? 'Panel de admin' : 'Panel de control'}
								</a>
							</div>

							<div class="my-1 h-px bg-blue-500/10"></div>

							<!-- Navegación Personal -->
							<div class="p-1">
								<a
									href="/perfil"
									class="group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-200 hover:bg-blue-500/20 hover:text-white"
									on:click={() => (mostrarDropdown = false)}
								>
									<User class="h-4 w-4 text-gray-400 group-hover:text-white" />
									Mi perfil
								</a>

								{#if $isAdmin}
									<a
										href="/reportes"
										class="group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-200 hover:bg-blue-500/20 hover:text-white"
										on:click={() => (mostrarDropdown = false)}
									>
										<FileWarning class="h-4 w-4 text-gray-400 group-hover:text-white" />
										Reportes
									</a>
								{/if}

								{#if $isInstitucion || $isColaborador}
									<a
										href="/reportes"
										class="group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-200 hover:bg-blue-500/20 hover:text-white"
										on:click={() => (mostrarDropdown = false)}
									>
										<FileText class="h-4 w-4 text-gray-400 group-hover:text-white" />
										Mis reportes
									</a>
								{/if}

								<a
									href="/configuracion"
									class="group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-200 hover:bg-blue-500/20 hover:text-white"
									on:click={() => (mostrarDropdown = false)}
								>
									<Settings class="h-4 w-4 text-gray-400 group-hover:text-white" />
									Configuración
								</a>
							</div>

							<div class="my-1 h-px bg-blue-500/10"></div>

							<!-- Cerrar Sesión -->
							<div class="p-1">
								<button
									on:click={handleLogout}
									class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300"
								>
									<LogOut class="h-4 w-4" />
									Cerrar sesión
								</button>
							</div>
						</div>
					{/if}
				</div>
			{:else}
				<!-- Solo en desktop -->
				<div class="hidden md:block">
					<Button label="Iniciar sesión" href="/iniciar-sesion" />
				</div>
			{/if}

			<!-- Menu Toggle Mobile -->
			<button
				aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
				class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10 text-blue-100 transition-colors hover:bg-blue-600/20 md:hidden"
				on:click={() => (menuAbierto = !menuAbierto)}
			>
				{#if menuAbierto}
					<X class="h-6 w-6" />
				{:else}
					<Menu class="h-6 w-6" />
				{/if}
			</button>
		</div>
	</div>

	<!-- Menú Mobile Expandido -->
	{#if menuAbierto}
		<nav
			class="absolute top-full right-0 left-0 z-50 overflow-y-auto border-t border-blue-500/20 bg-[#0f1029] shadow-2xl md:hidden"
			style="max-height: calc(100vh - 80px); animation:slideUp .3s ease-out forwards;"
		>
			<div class="flex flex-col p-4">
				{#if $isAuthenticated}
					<!-- Perfil Mobile -->
					<div class="mb-4 flex items-center gap-3 rounded-xl bg-blue-500/5 p-3">
						<img
							src={$usuarioStore?.url_foto ?? '/users/escuela-esperanza.jpg'}
							alt="Avatar"
							class="h-10 w-10 rounded-full object-cover"
						/>
						<div class="flex flex-col">
							<span class="font-medium text-white">{$usuarioStore?.nombre}</span>
							<span class="text-xs text-blue-300">{emailUsuario}</span>
						</div>
					</div>

					<!-- Enlaces rápidos de usuario -->
					<div class="mb-4 grid grid-cols-2 gap-2">
						<a
							href="/mensajes"
							class="flex flex-col items-center justify-center gap-1 rounded-lg bg-blue-500/10 p-3 text-center transition-colors hover:bg-blue-500/20"
							on:click={() => (menuAbierto = false)}
						>
							<MessageCircle class="h-5 w-5 text-blue-400" />
							<span class="text-xs font-medium text-blue-100">Mis chats</span>
						</a>
						<a
							href={$isInstitucion ? '/institucion/mi-panel' : '/colaborador/mi-panel'}
							class="flex flex-col items-center justify-center gap-1 rounded-lg bg-blue-500/10 p-3 text-center transition-colors hover:bg-blue-500/20"
							on:click={() => (menuAbierto = false)}
						>
							<LayoutDashboard class="h-5 w-5 text-blue-400" />
							<span class="text-xs font-medium text-blue-100">Panel</span>
						</a>
					</div>
				{:else}
					<div class="mb-4">
						<a
							href="/iniciar-sesion"
							class="flex w-full items-center justify-center rounded-lg bg-blue-600 py-3 font-semibold text-white shadow-lg transition-transform active:scale-95"
							on:click={() => (menuAbierto = false)}
						>
							Iniciar sesión
						</a>
					</div>
				{/if}

				<!-- Links de navegación generales -->
				<div class="space-y-1">
					{#each navLinks as { label, href }}
						<a
							{href}
							class="block rounded-lg px-4 py-3 text-base font-medium text-blue-100 transition-colors hover:bg-blue-500/10 hover:text-white"
							on:click={(e) => handleNavClick(e, href)}
						>
							{label}
						</a>
					{/each}
				</div>

				{#if $isAuthenticated}
					<div class="my-4 border-t border-blue-500/20"></div>
					<!-- Botones extra del menú de usuario mobile -->
					<div class="space-y-1">
						{#if $isInstitucion}
							<a
								href="/proyectos/crear"
								class="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-300 hover:bg-blue-500/10 hover:text-white"
								on:click={() => (menuAbierto = false)}
							>
								<PlusCircle class="h-4 w-4" /> Crear proyecto
							</a>
						{/if}
						<a
							href="/perfil"
							class="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-300 hover:bg-blue-500/10 hover:text-white"
							on:click={() => (menuAbierto = false)}
						>
							<User class="h-4 w-4" /> Mi perfil
						</a>
						<a
							href="/configuracion"
							class="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-300 hover:bg-blue-500/10 hover:text-white"
							on:click={() => (menuAbierto = false)}
						>
							<Settings class="h-4 w-4" /> Configuración
						</a>
						<button
							on:click={handleLogout}
							class="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300"
						>
							<LogOut class="h-4 w-4" /> Cerrar sesión
						</button>
					</div>
				{/if}
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
