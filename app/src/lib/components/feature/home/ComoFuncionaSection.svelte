<!--
TODO:
	- [ ] (Opcional) Parametrizar pasos para admitir contenido dinámico en el futuro.
-->
<script lang="ts">
	import StepCard from '$lib/components/ui/cards/StepCard.svelte';
	import Badge from '$lib/components/ui/elementos/Badge.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { steps } from '\$lib/domain/types/static-data/como-funciona';
	import { inView } from '\$lib/utils/actions/inView';

	let inViewSection = false;
</script>

<section
	class="relative isolate w-full overflow-hidden bg-white px-4 py-50 md:px-8"
	use:inView={{
		onChange: (v) => (inViewSection = v),
		rootMargin: '0px 0px -15% 0px',
		threshold: 0.1
	}}
>
	<span
		class="pointer-events-none absolute -top-16 -left-24 h-72 w-72 rounded-full
	             bg-[#007fff]/10 blur-3xl"
	></span>

	<!-- *Encabezado -->
	<header
		class="relative mx-auto mb-12 max-w-4xl text-center
                       transition-transform duration-600 ease-out
                       md:max-w-3xl"
		class:opacity-0={!inViewSection}
		class:translate-y-8={!inViewSection}
	>
		<div class="flex justify-center">
			<Badge text="¿Cómo funciona?" customColor="#0066d5" />
		</div>

		<h2 class="mt-4 text-3xl leading-snug font-extrabold text-gray-900 sm:text-4xl">
			Es simple,
			<span class="text-gray-500"> conectamos <br />necesidades con soluciones. </span>
		</h2>
	</header>

	<!-- *Grid de pasos -->
	<div
		class="relative mx-auto grid max-w-7xl gap-8
                       transition-opacity duration-600
                       ease-out sm:grid-cols-2 lg:grid-cols-3"
		class:opacity-0={!inViewSection}
		class:translate-y-6={!inViewSection}
	>
		{#each steps as step (step)}
			<StepCard {...step} />
		{/each}
	</div>

	<!-- *CTA -->
	<div
		class="relative mt-12 flex justify-center transition-opacity duration-600"
		class:opacity-0={!inViewSection}
	>
		<Button
			label="Empezá a conectar hoy"
			href="/registrarse"
			customClass="hover:-translate-y-0.5 hover:shadow-xl active:scale-95 transition duration-200 shadow-md"
		/>
	</div>
</section>


