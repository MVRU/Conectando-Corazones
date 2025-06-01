<!--
* Componente: HowItWorksSection
	-*- Descripción: sección informativa que explica en pasos cómo funciona la plataforma.
	-*- Funcionalidad: presenta 6 pasos numerados con fondo visual, título y descripción. Cada paso usa el componente `StepCard`.

* Props:
	-*- No recibe props por ahora; los pasos están definidos internamente.

TODO:
	- [ ] Parametrizar pasos para admitir contenido dinámico en el futuro (de ser necesario).
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import StepCard from '$lib/components/ui/StepCard.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { steps } from '$lib/data/how-it-works';

	let inView = false;
	let holder: HTMLElement;

	onMount(() => {
		const io = new IntersectionObserver(([entry]) => (inView = entry.isIntersecting), {
			rootMargin: '0px 0px -15% 0px',
			threshold: 0.1
		});
		io.observe(holder);
	});
</script>

<section
	bind:this={holder}
	class="relative isolate w-full overflow-hidden bg-white px-4 py-20 md:px-8"
>
	<span
		class="pointer-events-none absolute -left-24 -top-16 h-72 w-72 rounded-full
	             bg-[#007fff]/10 blur-3xl"
	></span>

	<!-- *Encabezado -->
	<header
		class="duration-600 relative mx-auto mb-12 max-w-4xl
		       text-center transition-transform ease-out
		       md:max-w-3xl"
		class:opacity-0={!inView}
		class:translate-y-8={!inView}
	>
		<div class="flex justify-center">
			<Badge text="¿Cómo funciona?" customColor="#0066d5" />
		</div>

		<h2 class="mt-4 text-3xl font-extrabold leading-snug text-gray-900 sm:text-4xl">
			Es simple,
			<span class="block text-gray-500"> conectamos necesidades con soluciones. </span>
		</h2>
	</header>

	<!-- *Grid de pasos -->
	<div
		class="duration-600 relative mx-auto grid max-w-7xl
		       gap-8 transition-opacity
		       ease-out sm:grid-cols-2 lg:grid-cols-3"
		class:opacity-0={!inView}
		class:translate-y-6={!inView}
	>
		{#each steps as step (step)}
			<StepCard {...step} animate={inView} />
		{/each}
	</div>

	<!-- *CTA -->
	<div
		class="duration-600 relative mt-12 flex justify-center transition-opacity"
		class:opacity-0={!inView}
	>
		<Button label="Empezá a conectar hoy" />
	</div>
</section>
