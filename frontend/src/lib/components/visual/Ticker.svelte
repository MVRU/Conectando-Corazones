<!--
* Componente: Ticker
	-*- Descripción: carrusel horizontal que muestra logos de instituciones de forma animada.
	-*- Funcionalidad: los logos se deslizan en bucle de derecha a izquierda; al hacer hover, se pausa la animación general y el logo individual recupera su color original y se agranda ligeramente.

* Props:
	-*- logos (string[]): array de rutas a las imágenes de las instituciones.

TODO:
	- [ ] Permitir pasar links asociados a cada logo para hacerlos clickeables. -> cuando tengamos endpoints del backend tomaría las fotos de perfil de la institución.

! WARNING:
	-!- Las imágenes deben tener fondo transparente o adaptarse visualmente al color `--base-color`.
-->

<script lang="ts">
	import { onMount } from 'svelte';
	export let logos: string[] = [];
	let visible = false;
	let tickerRef: HTMLElement;

	onMount(() => {
		const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.12 });
		if (tickerRef) io.observe(tickerRef);
		return () => io.disconnect();
	});
</script>

<div
	bind:this={tickerRef}
	class="group relative h-20 w-full overflow-hidden bg-[rgb(var(--base-color))]
		transition-all duration-1000"
	class:ticker-fade-in={visible}
>
	<!-- Gradientes laterales -->
	<div
		class="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[rgb(var(--base-color))] to-transparent"
	></div>
	<div
		class="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[rgb(var(--base-color))] to-transparent"
	></div>

	<!-- Contenedor deslizante -->
	<div class="ticker-track group-hover:pause-animation flex h-full w-max items-center gap-32">
		{#each Array(6).fill(logos).flat() as logo, i}
			<img
				src={logo}
				alt="Logo institución"
				class="h-12 w-auto cursor-pointer object-contain grayscale transition-all duration-300 ease-in-out hover:scale-110 hover:grayscale-0"
				loading="lazy"
			/>
		{/each}
	</div>
</div>

<style>
	.ticker-fade-in {
		opacity: 1;
		transform: translateY(0);
		transition:
			opacity 0.85s cubic-bezier(0.42, 0, 0.18, 1),
			transform 0.9s cubic-bezier(0.36, 0, 0.18, 1);
	}
	.group:not(.ticker-fade-in) {
		opacity: 0;
		transform: translateY(32px);
	}

	@keyframes ticker-scroll {
		0% {
			transform: translateX(0%);
		}
		100% {
			transform: translateX(-50%);
		}
	}

	.ticker-track {
		animation: ticker-scroll 80s linear infinite;
	}
</style>
