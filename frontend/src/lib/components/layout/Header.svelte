<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	let menuOpen = false;
</script>

<div class="header-outer">
	<div class="header-inner">
		<!-- Logo -->
		<Image
			src="/logo-1.png"
			alt="Logo de Conectando Corazones"
			width="50px"
			animate="heartbeat"
			href="/"
		/>

		<!-- Navbar Desktop -->
		<nav class="navbar hidden gap-10 md:flex">
			<a href="/">Inicio</a>
			<a href="/about">Acerca de</a>
			<a href="/projects">Proyectos</a>
			<a href="/faq">FAQ</a>
			<a href="/contact">Contacto</a>
		</nav>

		<!-- Botón desktop -->
		<div class="button-wrapper hidden md:flex">
			<Button label="Registrarse" href="/signin" />
		</div>
	</div>
	<!-- Menú hamburguesa mobile -->
	<div class="menu-icon menu-icon-mobile z-50 flex items-center p-0 md:hidden">
		<button
			on:click={() => (menuOpen = !menuOpen)}
			aria-label="Toggle navigation"
			class="relative m-0 flex h-6 w-6 cursor-pointer appearance-none items-center justify-center border-0 bg-transparent p-0"
		>
			<svg
				class="hamburger-icon absolute inset-0 z-50 transition-transform duration-300 ease-in-out"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class:rotate-90={menuOpen}
			>
				{#if menuOpen}
					<!-- Icono cerrar -->
					<path d="M6 18L18 6M6 6l12 12" />
				{:else}
					<!-- Icono menú -->
					<path d="M3 12h18M3 6h18M3 18h18" />
				{/if}
			</svg>
		</button>
	</div>

	<!-- Overlay negro para el menú mobile -->
	{#if menuOpen}
		<div class="fixed inset-0 z-40 bg-black/30"></div>
	{/if}

	<!-- Menú mobile -->
	{#if menuOpen}
		<div
			class="mobile-menu absolute left-0 right-0 top-full z-50 rounded-b-lg rounded-t-none px-8 py-6 shadow-lg"
			class:slideDown={menuOpen}
			class:slideUp={!menuOpen}
		>
			<nav class="flex flex-col gap-4">
				<a
					class="font-inter menu-link text-base font-semibold opacity-80 hover:opacity-100"
					href="/"
					on:click={() => (menuOpen = false)}>Inicio</a
				>
				<a
					class="font-inter menu-link text-base font-semibold opacity-80 hover:opacity-100"
					href="/about"
					on:click={() => (menuOpen = false)}>Acerca de</a
				>
				<a
					class="font-inter menu-link text-base font-semibold opacity-80 hover:opacity-100"
					href="/projects"
					on:click={() => (menuOpen = false)}>Proyectos</a
				>
				<a
					class="font-inter menu-link text-base font-semibold opacity-80 hover:opacity-100"
					href="/faq"
					on:click={() => (menuOpen = false)}>FAQ</a
				>
				<a
					class="font-inter menu-link text-base font-semibold opacity-80 hover:opacity-100"
					href="/contact"
					on:click={() => (menuOpen = false)}>Contacto</a
				>
			</nav>
		</div>
	{/if}
</div>

<style>
	.header-outer {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		padding: 30px 0px;
		background-color: rgb(var(--base-color));
		position: relative;
		box-sizing: border-box;
	}

	.header-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 48px;
		width: 100%;
		max-width: 1366px;
		margin: 0 auto;
		height: min-content;
		padding-left: 2rem;
	}

	.navbar a {
		text-decoration: none;
		color: rgb(var(--text-primary));
		font-size: 1.125rem;
		font-weight: 600;
		opacity: 0.8;
		transition: opacity 0.3s ease-in-out;
		white-space: nowrap;
	}

	.navbar a:hover {
		opacity: 1;
	}

	.mobile-menu {
		display: flex;
		flex-direction: column;
		background-image: linear-gradient(to bottom, rgb(11, 11, 29), rgb(var(--base-color)));
		padding: 1.5rem 1rem;
		animation: slideDown 0.3s ease-in-out forwards;
		position: absolute;
		left: 0;
		right: 0;
		top: 100%;
		z-index: 50;
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
	}

	@keyframes slideDown {
		from {
			transform: translateY(-10px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	@keyframes slideUp {
		from {
			transform: translateY(0);
			opacity: 1;
		}
		to {
			transform: translateY(-10px);
			opacity: 0;
		}
	}

	.hamburger-icon {
		position: absolute;
		top: 0;
		left: 0;
		transition: all 0.3s ease-in-out;
	}

	.rotate-90 {
		transform: rotate(90deg);
	}

	.menu-link {
		opacity: 0.8;
		transition: all 0.3s ease-in-out;
	}

	.menu-link:hover {
		opacity: 1;
	}

	@keyframes heartbeat {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
		100% {
			transform: scale(1);
		}
	}

	.menu-icon-mobile {
		position: absolute;
		right: -4.5rem;
		top: 50%;
		padding: 0rem 0rem;
		transform: translateY(-50%);
		z-index: 50;
	}
	@media (min-width: 768px) {
		.menu-icon-mobile {
			display: none;
		}
	}
</style>
