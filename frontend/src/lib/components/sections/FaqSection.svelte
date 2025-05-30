<!--
* Componente: FaqSection
    -*- Descripción: sección de preguntas frecuentes con acordeón y soporte para imagen.
    -*- Funcionalidad: muestra preguntas frecuentes con respuestas expandibles y CTA de contacto.
    -*- Props: contenido estático por ahora.

TODO:
    - [ ] Mejorar estilos y responsividad.
    - [ ] Agregar animaciones al acordeón.
    - [ ] Cargar preguntas desde models y data.
-->

<script lang="ts">
	import FaqItem from '$lib/components/ui/FaqItem.svelte';
	import Image from '$lib/components/ui/Image.svelte';

	const faqs = [
		{
			question: '¿Quién puede registrarse en la plataforma?',
			answer:
				'Cualquier institución que necesite ayuda o cualquier organización interesada en colaborar.'
		},
		{
			question: '¿Cómo se seleccionan las organizaciones para un proyecto?',
			answer:
				'Las instituciones revisan las solicitudes recibidas y eligen a las organizaciones que mejor se alinean con sus necesidades..'
		},
		{
			question: '¿Es gratuito usar la plataforma?',
			answer: 'Sí, el registro y uso de la plataforma son completamente gratuitos.'
		},
		{
			question: '¿Qué tipo de ayuda puedo ofrecer?',
			answer:
				'Podés ofrecer recursos materiales, financiamiento, voluntariado u otros tipos de apoyo según el proyecto.'
		}
	];
</script>

<section class="w-full bg-white px-4 py-20 md:px-8">
	<div class="mx-auto grid max-w-7xl grid-cols-1 gap-16 md:grid-cols-2">
		<!-- Columna de FAQ -->
		<div class="flex flex-col justify-center">
			<h2 class="mb-4 text-2xl font-bold text-gray-900">
				Respuestas claras y concisas para <span class="text-gray-500"
					>empezar tu camino solidario.
				</span>
			</h2>
			<div class="space-y-4">
				{#each faqs as faq, i}
					<FaqItem question={faq.question} answer={faq.answer} initiallyOpen={i === 0} />
				{/each}
			</div>
			<p class="mt-6 text-sm text-gray-600">
				¿Tenés más preguntas?
				<a href="/contacto" class=" underline transition"> ¡Contactanos! </a>
			</p>
		</div>

		<!-- Columna de imagen -->
		<div class="flex items-center justify-center">
			<div class="w-full max-w-md overflow-hidden rounded-3xl shadow-lg">
				<Image
					src="/img/faq-1.jpg"
					alt="Personas uniendo manos en señal de equipo y ayuda"
					width="100%"
					height="auto"
				/>
			</div>
		</div>
	</div>
</section>
