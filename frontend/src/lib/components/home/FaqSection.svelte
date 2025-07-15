<!--
* Componente: FaqSection
	-*- Descripción: sección de preguntas frecuentes que aclara dudas comunes sobre el uso de la plataforma.
	-*- Funcionalidad: muestra una lista de preguntas y respuestas con un diseño atractivo y una imagen relevante.

* Props:
	-*- No recibe props por ahora (contenido estático).
-->

<script lang="ts">
	import FaqItem from '$lib/components/ui/elements/FaqItem.svelte';
	import Image from '$lib/components/ui/elements/Image.svelte';
	import { faqs as allFaqs } from '$lib/data/faqs';
	import { inView } from '$lib/actions/inView';
	import { reducedMotion } from '$lib/stores/reducedMotion';

	let visibleFaq = false;
	let visibleImg = false;

	// Filtrar solo las FAQs con categoría "General"
	const faqs = allFaqs.filter((faq) => faq.category === 'General');
</script>

<section
	id="faq"
	class="py-50 w-full bg-gradient-to-b from-[#f7f8fd] to-white px-2 sm:px-4 md:px-8"
>
	<div class="mx-auto grid max-w-7xl grid-cols-1 gap-10 sm:gap-16 md:grid-cols-2 md:items-center">
		<!-- *Contenido -->
		<div
			class="flex flex-col justify-center transition-all duration-1000"
			class:duration-0={$reducedMotion}
			class:faq-appear={visibleFaq}
			class:faq-hidden={!visibleFaq}
			use:inView={{ onChange: (v) => (visibleFaq = v), threshold: 0.12 }}
		>
			<h2
				class="mb-6 text-center text-2xl font-extrabold leading-tight tracking-tight text-[--base-color] sm:text-3xl md:text-left"
			>
				Respuestas claras y concisas<br class="hidden sm:inline" />
				<span class="block text-gray-500">para empezar tu camino solidario.</span>
			</h2>
			<div class="space-y-3">
				{#each faqs as faq, i}
					<FaqItem question={faq.question} answer={faq.answer} initiallyOpen={i === 0} />
				{/each}
			</div>
			<p class="mt-7 text-center text-sm text-gray-500 sm:mt-8 sm:text-base lg:text-left">
				¿Tenés más preguntas?
				<a
					href="/contact"
					class="ml-1 inline-block font-semibold text-blue-500 underline underline-offset-4 transition-colors hover:text-blue-600"
					>¡Contactanos!</a
				>
			</p>
		</div>

		<!-- *Imagen aparece debajo en mobile -->
		<div
			class="duration-800 group relative mx-auto w-full max-w-[350px] overflow-visible rounded-[1.6rem] shadow-xl shadow-blue-950/20 ring-2 ring-blue-400/10 transition-all hover:ring-blue-400/30 sm:max-w-[340px] md:w-[92%] md:max-w-[360px] lg:w-[90%] lg:max-w-[380px] xl:w-[80%] xl:max-w-[400px]"
			class:duration-0={$reducedMotion}
			class:img-appear={visibleImg}
			class:img-hidden={!visibleImg}
			use:inView={{ onChange: (v) => (visibleImg = v), threshold: 0.12 }}
		>
			<div
				class="left-0 top-0 h-full w-full overflow-hidden rounded-[1.6rem]"
				style="will-change: transform; transition: transform 0.85s cubic-bezier(.43,0,.15,1);"
				tabindex="-1"
			>
				<div class="aspect-[6/5] w-full transition-transform duration-700 group-hover:scale-105">
					<Image
						src="/img/faq-1.webp"
						alt="Personas uniendo manos en señal de equipo y ayuda"
						variant="card"
					/>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.faq-hidden {
		opacity: 0;
		transform: translateX(-48px) scale(0.97);
		filter: blur(6px);
		pointer-events: none;
		transition: all 1.05s cubic-bezier(0.38, 0, 0.21, 1);
	}
	.faq-appear {
		opacity: 1;
		transform: translateX(0) scale(1);
		filter: blur(0);
		pointer-events: auto;
		transition: all 1.08s cubic-bezier(0.36, 0, 0.21, 1);
	}
	.img-hidden {
		opacity: 0;
		transform: translateX(44px) scale(0.95) rotate(4deg);
		filter: blur(8px);
		transition: all 1.05s cubic-bezier(0.36, 0, 0.19, 1);
	}
	.img-appear {
		opacity: 1;
		transform: translateX(0) scale(1) rotate(0.2deg);
		filter: blur(0);
		transition: all 1.08s cubic-bezier(0.36, 0, 0.19, 1);
	}
</style>
