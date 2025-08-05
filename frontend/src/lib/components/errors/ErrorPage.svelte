<!--
* DECISIÓN DE DISEÑO: se centraliza la presentación de errores para reutilizar estilos y mensajes.
-!- Riesgo: un cambio de estilo afecta simultáneamente a todas las páginas de error.
-->

<script lang="ts">
	import Button from '$lib/components/ui/elements/Button.svelte';
	export let status: number;
	export let message: string | undefined = undefined;

	const defaults = {
		404: {
			title: 'Uy... no encontramos lo que buscás',
			description:
				'Es posible que el enlace esté roto o nunca haya existido. <br /><span class="font-bold">¡Pero no te preocupes, te guiamos de vuelta!</span>'
		},
		500: {
			title: 'Uy... algo salió mal',
			description:
				'Estamos trabajando para solucionarlo. <br /><span class="font-bold">Intenta nuevamente más tarde.</span>'
		}
	} as const;

	const fallback = {
		title: 'Ocurrió un error inesperado',
		description: message ?? 'Intenta recargar la página o volver al inicio.'
	};

	const { title, description } = defaults[status as 404 | 500] ?? fallback;
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

	<h1 class="animate-fade-in mb-2 text-6xl font-bold tracking-tight text-blue-500">
		{status}
	</h1>

	<p class="mb-2 mt-4 text-2xl font-semibold">{@html title}</p>

	<p class="mb-10 max-w-md text-gray-600">{@html description}</p>

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
