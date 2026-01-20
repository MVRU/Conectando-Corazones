<script lang="ts">
	import FaqItem from '$lib/components/ui/elementos/FaqItem.svelte';
	import Image from '$lib/components/ui/elementos/Image.svelte';
	import { faqs as allFaqs } from '$lib/data/faqs';
	import { inView } from '$lib/actions/inView';

	let faqVisible = false;
	let imagenVisible = false;

	// Filtrar solo las FAQs con categoría "General" (NO CAMBIAR)
	const faqs = allFaqs.filter((faq) => faq.categoria === 'General');
</script>

<section
	id="faq"
	class="w-full bg-gradient-to-b from-[#f7f8fd] to-white px-2 py-50 sm:px-4 md:px-8"
>
	<div class="mx-auto grid max-w-7xl grid-cols-1 gap-10 sm:gap-16 md:grid-cols-2 md:items-center">
		<!-- *Contenido -->
		<div
			class="flex flex-col justify-center transition-all duration-1000"
			class:faq-appear={faqVisible}
			class:faq-hidden={!faqVisible}
			use:inView={{ onChange: (v) => (faqVisible = v), threshold: 0.12 }}
		>
			<h2
				class="mb-6 text-center text-2xl leading-tight font-extrabold tracking-tight text-[--base-color] sm:text-3xl md:text-left"
			>
				Respuestas claras y concisas<br class="hidden sm:inline" />
				<span class="block text-gray-500">para empezar tu camino solidario.</span>
			</h2>
			<div class="space-y-3">
				{#each faqs as faq, i (i)}
					<FaqItem question={faq.pregunta} answer={faq.respuesta} initiallyOpen={i === 0} />
				{/each}
			</div>
			<p class="mt-7 text-center text-sm text-gray-500 sm:mt-8 sm:text-base lg:text-left">
				¿Tenés más preguntas?
				<a
					href="/contacto"
					class="ml-1 inline-block font-semibold text-blue-500 underline underline-offset-4 transition-colors hover:text-blue-600"
					>¡Contactanos!</a
				>
			</p>
		</div>

		<!-- *Imagen aparece debajo en mobile -->
		<div
			class="group relative mx-auto w-full max-w-[350px] overflow-visible rounded-[1.6rem] shadow-xl ring-2 shadow-blue-950/20 ring-blue-400/10 transition-all duration-800 hover:ring-blue-400/30 sm:max-w-[340px] md:w-[92%] md:max-w-[360px] lg:w-[90%] lg:max-w-[380px] xl:w-[80%] xl:max-w-[400px]"
			class:img-appear={imagenVisible}
			class:img-hidden={!imagenVisible}
			use:inView={{ onChange: (v) => (imagenVisible = v), threshold: 0.12 }}
		>
			<div
				class="top-0 left-0 h-full w-full overflow-hidden rounded-[1.6rem]"
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
