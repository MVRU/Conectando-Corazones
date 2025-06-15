<!--
* Componente: CallToActionSection
	-*- Descripción: sección de llamada a la acción con animaciones y diseño atractivo.
	-*- Funcionalidad: muestra un mensaje motivacional y un botón con animaciones de entrada y salida.

TODO:
	- [ ] Agregar validación para `href` en el botón.

-->

<script lang="ts">
  import { onMount } from 'svelte';
  import { Motion } from '@motionone/svelte';
  import Badge from '$lib/components/ui/elements/Badge.svelte';
  import Image from '$lib/components/ui/elements/Image.svelte';
  import Button from '$lib/components/ui/elements/Button.svelte';

  let visible = false;
  let sectionRef: HTMLDivElement;

	onMount(() => {
		const io = new IntersectionObserver(
			([e]) => {
				visible = e.isIntersecting;
			},
			{ threshold: 0.13 }
		);
		if (sectionRef) io.observe(sectionRef);
		return () => io.disconnect();
	});
</script>

<section class="w-full bg-gradient-to-br from-[#0f1029] to-[#1e2052] px-2 py-10 sm:px-4 md:px-8">
	<div
		bind:this={sectionRef}
		class="mx-auto flex max-w-7xl flex-col-reverse items-center justify-between gap-8 md:gap-12 lg:flex-row"
	>
		<!-- *Lado izquierdo: texto -->
                <Motion.div
                        class="flex-1 space-y-5 text-center text-white lg:text-left"
                        animate={{ opacity: visible ? 1 : 0, translateY: visible ? 0 : 60, scale: visible ? 1 : 0.96, filter: visible ? 'blur(0px)' : 'blur(8px)' }}
                        transition={{ duration: 0.95, delay: 0.05 }}
                >
			<!-- *Badge: variante corta en mobile, larga en desktop -->
			<div class="flex justify-center backdrop-blur lg:justify-start">
				<Badge text="Beneficios más allá de la conexión" customClass="inline-flex sm:hidden" />
				<Badge
					text="Beneficios que van más allá de la conexión"
					customClass="hidden sm:inline-flex"
				/>
			</div>
			<!-- *h2 (sin <br> en mobile, con <br> en desktop) -->
                        <Motion.h2
                                class="text-2xl font-extrabold leading-tight drop-shadow sm:text-3xl md:text-4xl"
                                animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 60, filter: visible ? 'blur(0px)' : 'blur(7px)' }}
                                transition={{ duration: 1.1, delay: 0.17 }}
                        >
				<span class="sm:hidden">Descubrí lo que ganás al ser parte de esta red solidaria.</span>
				<span class="hidden sm:inline"
					>Descubrí lo que ganás al<br />ser parte de esta red solidaria.</span
				>
                        </Motion.h2>
                        <Motion.p
                                class="mx-auto mb-9 max-w-lg text-base font-medium text-blue-100/85 drop-shadow-sm lg:mx-0"
                                animate={{ opacity: visible ? 1 : 0, translateY: visible ? 0 : 60, scale: visible ? 1 : 0.96, filter: visible ? 'blur(0)' : 'blur(8px)' }}
                                transition={{ duration: 0.95, delay: 0.18 }}
                        >
				Cada conexión puede transformar una vida, incluso la tuya.
			</p>
                        <Motion.div
                                animate={{ opacity: visible ? 1 : 0, translateY: visible ? 0 : 60, scale: visible ? 1 : 0.96, filter: visible ? 'blur(0)' : 'blur(8px)' }}
                                transition={{ duration: 0.95, delay: 0.3 }}
                        >
				<!-- !Button solo visible en mobile -->
				<div class="sm:hidden">
					<Button label="Registrate y generá impacto" href="/registro" variant="ghost" size="sm" />
				</div>
				<!-- !Button solo visible en desktop -->
				<div class="hidden sm:block">
					<Button
						label="Registrate y empezá a generar impacto"
						href="/registro"
						variant="ghost"
						size="md"
					/>
                        </Motion.div>
                </Motion.div>
		</div>

		<!-- *Lado derecho: imagen -->
                <Motion.div
                        class="flex flex-1 items-end justify-center"
                        animate={{ opacity: visible ? 1 : 0, translateY: visible ? 0 : 60, scale: visible ? 1 : 0.95, filter: visible ? 'blur(0)' : 'blur(10px)' }}
                        transition={{ duration: 1, delay: 0.23 }}
                >
			<div
				class="cta-img-outer group relative h-64 w-44 overflow-visible rounded-[2rem] shadow-xl shadow-blue-950/20 ring-2 ring-blue-400/10 transition-all duration-500 hover:ring-blue-400/30 sm:h-[460px] sm:w-[320px] md:h-[480px] md:w-[350px]"
			>
				<div
					class="absolute left-0 top-0 h-full w-full overflow-hidden rounded-[2rem]"
					style="will-change: transform; transition: transform 0.85s cubic-bezier(.43,0,.15,1);"
					tabindex="-1"
				>
					<div class="h-full w-full transition-transform duration-700 group-hover:scale-105">
						<Image
							src="/img/cta-1.webp"
							alt="Persona sonriente representando impacto positivo"
							variant="card"
						/>
					</div>
				</div>
			</div>
                </Motion.div>
        </div>
</section>

<style>
        /* Animaciones reemplazadas por MotionOne */
</style>
