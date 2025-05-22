<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
</script>

<div class="header-outer">
	<div class="header-inner">
		<!-- Logo -->
		<a href="/" aria-label="Home" class="logo-wrapper">
			<img src="/logo-1.png" alt="Logo de la aplicación" class="logo" />
		</a>

		<!-- Navbar -->
		<nav class="navbar flex items-center justify-center gap-10">
			<a href="/">Inicio</a>
			<a href="/about">Acerca de</a>
			<a href="/projects">Proyectos</a>
			<a href="/faq">FAQ</a>
			<a href="/contact">Contacto</a>
		</nav>

		<!-- Botón -->
		<div class="button-wrapper">
			<Button label="Registrarse" variant="primary" />
		</div>
	</div>
</div>

<style>
	.header-outer {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		padding: 30px 0;
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
	}

	.logo-wrapper,
	.button-wrapper {
		flex: 0 0 auto; /* Evita compresión */
		display: flex;
		align-items: center;
		min-width: max-content; /* Mantiene el tamaño natural */
	}

	.logo {
		width: 50px;
		height: 50px;
		object-fit: contain;
	}

	.navbar {
		display: flex;
		align-items: center;
		gap: 32px;
		flex: 1 1 auto;
		overflow: hidden;
		font-family: 'Inter', sans-serif;
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

	.button-wrapper {
		flex-shrink: 0;
		min-width: max-content;
		display: flex;
		align-items: center;
	}
</style>
