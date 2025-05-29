<!--
* Componente: HowItWorks
	-*- Descripción: sección informativa que explica en pasos cómo funciona la plataforma.
	-*- Funcionalidad: presenta 6 pasos numerados con fondo visual, título y descripción. Cada paso usa el componente `StepCard`.

* Props:
	-*- No recibe props por ahora; los pasos están definidos internamente.

TODO:
	- [ ] Parametrizar pasos para admitir contenido dinámico en el futuro.

* DECISIÓN DE DISEÑO:
	-*- Se utiliza un grid de 3 columnas en desktop, 2 en tablet, 1 en mobile para máxima legibilidad.
	-*- Se usa un overlay degradado para garantizar contraste legible sobre la imagen.
-->

<script lang="ts">
	import StepCard from '$lib/components/ui/StepCard.svelte';
	import Badge from '../ui/Badge.svelte';
	import Button from '../ui/Button.svelte';
	import { steps } from '$lib/data/how-it-works';
</script>

<section class="w-full bg-white px-4 py-20 md:px-8">
	<div class="mx-auto mb-12 max-w-4xl text-center">
		<div class="flex justify-center">
			<Badge text="¿Cómo funciona?" />
		</div>
		<h2 class="mt-4 text-3xl font-extrabold leading-snug text-gray-900 sm:text-4xl">
			Es simple,
			<span class="text-gray-500">conectamos<br />necesidades con soluciones.</span>
		</h2>
	</div>

	<div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
		{#each steps as step}
			<StepCard {...step} />
		{/each}
	</div>

	<div class="mt-12 flex justify-center">
		<Button label="Empezá a conectar hoy" />
	</div>
</section>
