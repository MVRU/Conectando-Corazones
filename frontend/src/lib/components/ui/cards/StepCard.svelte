<!--
* Componente: StepCard
	-*- Descripción: tarjeta que representa un paso en el proceso de la funcionalidad de Conectando Corazones.
	-*- Funcionalidad: muestra un número, título, resumen y detalles del paso. Incluye una imagen de fondo y un círculo interactivo que revela más información al hacer clic.

* Props:
	-*- stepNumber: número del paso (1-6).
	-*- title: título del paso.
	-*- summary: resumen breve del paso.
	-*- details: descripción detallada del paso.
	-*- image: URL de la imagen de fondo del paso.
	-*- delay: tiempo de retraso para la animación de entrada (opcional, por defecto 0).
-->

<script lang="ts">
       import { inView } from '$lib/actions/inView';
       import { reducedMotion } from '$lib/stores/reducedMotion';
       import { Motion } from '@motionone/svelte';

       export let stepNumber: number;
       export let title: string;
       export let summary: string;
       export let details: string;
       export let image: string;
       export let delay = 0;
       export let animate = false;
</script>

<!-- *Contenedor -->
<Motion.div
        role="region"
        aria-label={`Paso ${stepNumber}: ${title}`}
        class="group relative h-96 transform-gpu overflow-hidden rounded-3xl bg-white
               shadow-md transition-transform duration-300"
        class:duration-0={$reducedMotion}
        class:hover:-translate-y-1={!$reducedMotion}
        class:hover:scale-[1.015]={!$reducedMotion}
        style={`transition-delay:${delay}ms`}
        animate={{ opacity: animate ? 1 : 0, translateY: animate ? 0 : 32 }}
        transition={{ duration: 0.6, delay: delay / 1000 }}
        use:inView={{ onChange: (v) => (animate = v), once: true, threshold: 0.2 }}
>
	<!-- *Imagen -->
	<img
		src={image}
		alt={title}
		loading="lazy"
		class="absolute inset-0 h-full w-full object-cover
		       transition-transform duration-700 group-hover:scale-105"
	/>

	<!-- *Overlay -->
	<div
		class="relative z-10 flex h-full flex-col justify-end bg-gradient-to-t
		       from-[#0f1029]/60 via-[#0f1029]/35 to-transparent p-5
		       transition-colors duration-500
		       group-hover:from-[#0f1029]/75 group-hover:via-[#0f1029]/50"
	>
		<!-- *Círculo con número (step) -->
		<div
			class="flex h-16 w-16 items-center justify-center self-start
			       rounded-full border-2 border-[#007fff] bg-white
			       text-3xl font-bold text-[#0f1029] shadow-md"
		>
			{stepNumber}
		</div>

		<!-- *Textos -->
		<h3
                        class="mt-4 text-lg font-semibold text-white drop-shadow
                               transition-transform duration-300"
                        class:duration-0={$reducedMotion}
                        class:group-hover:translate-y-6={!$reducedMotion}
		>
			{title}
		</h3>
		<p
                        class="text-sm text-white/90 transition-all duration-300"
                        class:duration-0={$reducedMotion}
                        class:group-hover:translate-y-2={!$reducedMotion}
                        class:group-hover:opacity-0={!$reducedMotion}
		>
			{summary}
		</p>

		<!-- *Detalles (fade on hover) -->
		<p
                        class="translate-y-4 text-xs text-white/80 opacity-0
                               transition-all duration-300"
                        class:duration-0={$reducedMotion}
                        class:group-hover:translate-y-0={!$reducedMotion}
                        class:group-hover:opacity-100={!$reducedMotion}
		>
			{details}
		</p>
	</div>
</Motion.div>

<style>
        /* Animaciones reemplazadas por MotionOne */
        .group:hover {
                box-shadow:
                        0 10px 32px 0 #19318a1a,
                        0 1.5px 10px 0 #e6466611;
                transform: translateY(-3px) scale(1.02);
        }
</style>

