<!--
* Componente: CallToActionSection
	-*- Descripción: sección de llamada a la acción con animaciones y diseño atractivo.
	-*- Funcionalidad: muestra un mensaje motivacional y un botón con animaciones de entrada y salida.
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import Badge from '$lib/components/ui/elementos/Badge.svelte';
	import Image from '$lib/components/ui/elementos/Image.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';

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
		<div
			class="flex-1 space-y-5 text-center text-white lg:text-left"
			class:fade-in-left={visible}
			class:fade-out-left={!visible}
			style="transition-delay: .05s"
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
			<h2
				class="cta-animate-title text-2xl leading-tight font-extrabold drop-shadow sm:text-3xl md:text-4xl"
			>
				<span class="sm:hidden">Descubrí lo que ganás al ser parte de esta red solidaria.</span>
				<span class="hidden sm:inline"
					>Descubrí lo que ganás al<br />ser parte de esta red solidaria.</span
				>
			</h2>
			<p
				class="mx-auto mb-9 max-w-lg text-base font-medium text-blue-100/85 drop-shadow-sm transition-opacity duration-500 lg:mx-0"
				class:fade-in-left={visible}
				class:fade-out-left={!visible}
				style="transition-delay: .18s"
			>
				Cada conexión puede transformar una vida, incluso la tuya.
			</p>
			<div
				class:fade-in-left={visible}
				class:fade-out-left={!visible}
				style="transition-delay: .3s"
			>
				<!-- !Button solo visible en mobile -->
				<div class="sm:hidden">
					<Button label="Registrate y generá impacto" href="/registro" variant="ghost" size="sm" />
				</div>
				<!-- !Button solo visible en desktop -->
				<div class="hidden sm:block">
					<Button
						label="Registrate y empezá a generar impacto"
						href="/registrarse"
						variant="ghost"
						size="md"
					/>
				</div>
			</div>
		</div>

		<!-- *Lado derecho: imagen -->
		<div
			class="flex flex-1 items-end justify-center"
			class:fade-in-right={visible}
			class:fade-out-right={!visible}
			style="transition-delay: .23s"
		>
			<div
				class="cta-img-outer group relative h-64 w-44 overflow-visible rounded-[2rem] shadow-xl ring-2 shadow-blue-950/20 ring-blue-400/10 transition-all duration-500 hover:ring-blue-400/30 sm:h-[460px] sm:w-[320px] md:h-[480px] md:w-[350px]"
			>
				<div
					class="absolute top-0 left-0 h-full w-full overflow-hidden rounded-[2rem]"
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
		</div>
	</div>
</section>

<style>
	.fade-in-left {
		opacity: 1;
		transform: translateY(0) scale(1);
		filter: blur(0);
		transition:
			opacity 0.95s cubic-bezier(0.43, 0, 0.22, 1),
			transform 1s cubic-bezier(0.43, 0, 0.22, 1),
			filter 0.95s cubic-bezier(0.43, 0, 0.22, 1);
	}
	.fade-out-left {
		opacity: 0;
		transform: translateY(60px) scale(0.96);
		filter: blur(8px);
		transition:
			opacity 0.95s cubic-bezier(0.43, 0, 0.22, 1),
			transform 1s cubic-bezier(0.43, 0, 0.22, 1),
			filter 0.95s cubic-bezier(0.43, 0, 0.22, 1);
	}
	.fade-in-right {
		opacity: 1;
		transform: translateY(0) scale(1);
		filter: blur(0);
		transition:
			opacity 1.1s 0.18s cubic-bezier(0.45, 0, 0.18, 1),
			transform 1s 0.18s cubic-bezier(0.45, 0, 0.18, 1),
			filter 1s 0.18s cubic-bezier(0.45, 0, 0.18, 1);
	}
	.fade-out-right {
		opacity: 0;
		transform: translateY(60px) scale(0.95);
		filter: blur(10px);
		transition:
			opacity 1.1s 0.18s cubic-bezier(0.45, 0, 0.18, 1),
			transform 1s 0.18s cubic-bezier(0.45, 0, 0.18, 1),
			filter 1s 0.18s cubic-bezier(0.45, 0, 0.18, 1);
	}
	.cta-animate-title {
		animation: fadeInUp 1.1s 0.17s cubic-bezier(0.45, 0, 0.18, 1) both;
	}
	@keyframes fadeInUp {
		0% {
			opacity: 0;
			transform: translateY(60px);
			filter: blur(7px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
			filter: blur(0);
		}
	}
</style>

