<!--
* Componente: FaqSection
	-*- Descripción: sección de preguntas frecuentes que aclara dudas comunes sobre el uso de la plataforma.
	-*- Funcionalidad: muestra una lista de preguntas y respuestas con un diseño atractivo y una imagen relevante.

* Props:
	-*- No recibe props por ahora (contenido estático).
-->

<script lang="ts">
	import FaqItem from '$lib/components/ui/FaqItem.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import { faqs } from '$lib/data/faqs';
</script>

<section class="w-full bg-gradient-to-b from-[#f7f8fd] to-white px-4 py-20 md:px-8">
	<div class="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 md:grid-cols-2">
		<!-- FAQ -->
		<div class="animate-fadeInLeft flex flex-col justify-center">
			<h2 class="mb-6 text-3xl font-extrabold leading-tight tracking-tight text-[--base-color]">
				Respuestas claras y concisas para <span class="text-gray-500"
					>empezar tu camino solidario.</span
				>
			</h2>
			<div class="space-y-4">
				{#each faqs as faq, i}
					<FaqItem question={faq.question} answer={faq.answer} initiallyOpen={i === 0} />
				{/each}
			</div>
			<p class="mt-8 text-center text-base text-gray-500 lg:text-left">
				¿Tenés más preguntas?
				<a
					href="/contacto"
					class="ml-1 inline-block font-semibold text-blue-500 underline underline-offset-4 transition-colors hover:text-blue-600"
					>¡Contactanos!</a
				>
			</p>
		</div>

		<!-- Imagen -->
		<div
			class=" cta-img-outer animate-fadeInRight group relative mx-auto w-[80%] max-w-[340px] overflow-visible rounded-[2rem] shadow-xl shadow-blue-950/20 ring-2 ring-blue-400/10 transition-all duration-500 hover:ring-blue-400/30 md:w-[92%] md:max-w-[360px] lg:w-[90%] lg:max-w-[380px] xl:w-[80%] xl:max-w-[400px]"
		>
			<div
				class=" left-0 top-0 h-full w-full overflow-hidden rounded-[2rem]"
				style="
		will-change: transform;
		transition: transform 0.85s cubic-bezier(.43,0,.15,1);
	"
				tabindex="-1"
			>
				<div class="h-full w-full transition-transform duration-700 group-hover:scale-105">
					<Image
						src="/img/faq-1.jpg"
						alt="Personas uniendo manos en señal de equipo y ayuda"
						variant="card"
					/>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	@keyframes fadeInLeft {
		0% {
			opacity: 0;
			transform: translateX(-40px);
		}
		100% {
			opacity: 1;
			transform: translateX(0);
		}
	}
	@keyframes fadeInRight {
		0% {
			opacity: 0;
			transform: translateX(40px);
		}
		100% {
			opacity: 1;
			transform: translateX(0);
		}
	}
	.animate-fadeInLeft {
		animation: fadeInLeft 1.2s cubic-bezier(0.46, 0.03, 0.52, 0.96) both;
	}
	.animate-fadeInRight {
		animation: fadeInRight 1.2s cubic-bezier(0.46, 0.03, 0.52, 0.96) both;
	}
</style>
