<!--
* Componente: Ticker
	-*- Descripción: carrusel horizontal que muestra logos de instituciones de forma animada.
	-*- Funcionalidad: los logos se deslizan en bucle de derecha a izquierda; al hacer hover, se pausa la animación general y el logo individual recupera su color original y se agranda ligeramente.

* Props:
	-*- logos (string[]): array de rutas a las imágenes de las instituciones.

TODO:
	- [ ] Permitir pasar links asociados a cada logo para hacerlos clickeables. -> cuando tengamos endpoints del backend.

! WARNING:
	-!- Las imágenes deben tener fondo transparente o adaptarse visualmente al color `--base-color`.
-->

<script lang="ts">
	export let logos: string[] = [];
</script>

<div class="group relative h-20 w-full overflow-hidden bg-[rgb(var(--base-color))]">
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
	@keyframes ticker-scroll {
		0% {
			transform: translateX(0%);
		}
		100% {
			transform: translateX(-50%);
		}
	}

	.ticker-track {
		animation: ticker-scroll 40s linear infinite;
	}

	/* Pausar animación al hacer hover sobre el contenedor */
	.group:hover .ticker-track {
		animation-play-state: paused;
	}
</style>
