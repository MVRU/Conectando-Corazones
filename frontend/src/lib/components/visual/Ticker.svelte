<script lang="ts">
	export let logos: string[] = [];
</script>

<div class="relative h-20 w-full overflow-hidden bg-[rgb(var(--base-color))]">
	<!-- Gradientes laterales -->
	<div
		class="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[rgb(var(--base-color))] to-transparent"
	></div>
	<div
		class="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[rgb(var(--base-color))] to-transparent"
	></div>

	<!-- Contenedor deslizante -->
	<div class="ticker-track flex h-full w-max items-center gap-32">
		{#each Array(6).fill(logos).flat() as logo, i}
			<img src={logo} alt="Logo institución" class="h-12 w-auto object-contain" loading="lazy" />
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
</style>
