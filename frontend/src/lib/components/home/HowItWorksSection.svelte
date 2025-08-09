<!--
TODO:
	- [ ] (Opcional) Parametrizar pasos para admitir contenido dinámico en el futuro.
-->
<script lang="ts">
	import StepCard from '$lib/components/ui/cards/StepCard.svelte';
	import Badge from '$lib/components/ui/elements/Badge.svelte';
	import Button from '$lib/components/ui/elements/Button.svelte';
	import { steps } from '$lib/data/how-it-works';
	import { inView } from '$lib/actions/inView';
	import { reducedMotion } from '$lib/stores/reducedMotion';

	let inViewSection = false;
</script>

<section
	class="py-50 relative isolate w-full overflow-hidden bg-white px-4 md:px-8"
	use:inView={{
		onChange: (v) => (inViewSection = v),
		rootMargin: '0px 0px -15% 0px',
		threshold: 0.1
	}}
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
		class:duration-0={$reducedMotion}
		class:opacity-0={!inViewSection}
		class:translate-y-8={!inViewSection}
	>
		<div class="flex justify-center">
			<Badge text="¿Cómo funciona?" customColor="#0066d5" />
		</div>

		<h2 class="mt-4 text-3xl font-extrabold leading-snug text-gray-900 sm:text-4xl">
			Es simple,
			<span class="text-gray-500"> conectamos <br />necesidades con soluciones. </span>
		</h2>
	</header>

	<!-- *Grid de pasos -->
	<div
		class="duration-600 relative mx-auto grid max-w-7xl
                       gap-8 transition-opacity
                       ease-out sm:grid-cols-2 lg:grid-cols-3"
		class:duration-0={$reducedMotion}
		class:opacity-0={!inViewSection}
		class:translate-y-6={!inViewSection}
	>
		{#each steps as step (step)}
			<StepCard {...step} />
		{/each}
	</div>

	<!-- *CTA -->
	<div
		class="duration-600 relative mt-12 flex justify-center transition-opacity"
		class:duration-0={$reducedMotion}
		class:opacity-0={!inViewSection}
	>
		<Button
			label="Empezá a conectar hoy"
			href="/signin"
			customClass="hover:-translate-y-0.5 hover:shadow-xl active:scale-95 transition duration-200 shadow-md"
		/>
	</div>
</section>
