<script lang="ts">
	import Button from '$lib/components/ui/elements/Button.svelte';
</script>

<main
	class="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center text-gray-800"
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="mb-6 h-24 w-24 text-blue-400"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="1.5"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
		/>
	</svg>

	<!-- Código de error -->
	<h1 class="animate-fade-in mb-2 text-6xl font-bold tracking-tight text-blue-500">404</h1>

	<p class="mb-2 mt-4 text-2xl font-semibold">Uy... no encontramos lo que buscás</p>

	<p class="mb-10 max-w-md text-gray-600">
		Es posible que el enlace esté roto o nunca haya existido. <br />
		<span class="font-bold">¡Pero no te preocupes, te guiamos de vuelta!</span>
	</p>

	<!-- Botón de acción -->
	<Button href="/" label="Volver al inicio" />
</main>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fade-in {
		animation: fade-in 0.6s ease-out forwards;
	}
</style>
