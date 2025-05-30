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
	import { onMount, onDestroy } from 'svelte';
	import StepCard from '$lib/components/ui/StepCard.svelte';
	import Badge from '../ui/Badge.svelte';
	import Button from '../ui/Button.svelte';
	import { steps } from '$lib/data/how-it-works';

	let sectionRef: HTMLElement;
	let animateSteps = false;
	let observer: IntersectionObserver;

	onMount(() => {
		observer = new IntersectionObserver(
			([entry]) => {
				animateSteps = entry.isIntersecting;
			},
			{
				threshold: 0.18
			}
		);
		if (sectionRef) observer.observe(sectionRef);

		return () => {
			if (observer && sectionRef) observer.unobserve(sectionRef);
		};
	});
</script>

<section bind:this={sectionRef} class="w-full bg-white px-4 py-20 md:px-8">
	<div
		class="mx-auto mb-12 max-w-4xl text-center
		transition-all duration-700"
		style="opacity:{animateSteps ? 1 : 0}; transform:translateY({animateSteps
			? 0
			: 36}px) scale({animateSteps ? 1 : 0.96});"
	>
		<div class="flex justify-center">
			<Badge text="¿Cómo funciona?" />
		</div>
		<h2 class="mt-4 text-3xl font-extrabold leading-snug text-gray-900 sm:text-4xl">
			Es simple,
			<span class="text-gray-500">conectamos<br />necesidades con soluciones.</span>
		</h2>
	</div>

	<div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
		{#each steps as step, i}
			<StepCard
				{...step}
				delay={animateSteps ? i * 110 + Math.max(340 - i * 55, 50) : 0}
				animate={animateSteps}
			/>
		{/each}
	</div>

	<div
		class="mt-12 flex justify-center
		transition-all duration-700"
		style="opacity:{animateSteps ? 1 : 0}; transform:translateY({animateSteps ? 0 : 24}px);"
	>
		<Button label="Empezá a conectar hoy" />
	</div>
</section>
