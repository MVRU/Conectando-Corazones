<!--
* Componente: CallToActionSection
	-*- Descripción: sección de llamada a la acción con animaciones y diseño atractivo.
	-*- Funcionalidad: muestra un mensaje motivacional y un botón con animaciones de entrada y salida.

TODO:
	- [ ] Agregar validación para `href` en el botón.

-->

<script lang="ts">
	import { onMount } from 'svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import Button from '../ui/Button.svelte';

	let visible = false;
	let sectionRef: HTMLDivElement;

	onMount(() => {
		const reveal = () => {
			const rect = sectionRef.getBoundingClientRect();
			if (rect.top < window.innerHeight - 50) {
				visible = true;
				window.removeEventListener('scroll', reveal);
			}
		};
		window.addEventListener('scroll', reveal);
		reveal();
		return () => window.removeEventListener('scroll', reveal);
	});
</script>

<section class="w-full bg-gradient-to-br from-[#0f1029] to-[#1e2052] px-4 py-16 md:px-8">
	<div
		bind:this={sectionRef}
		class="mx-auto flex max-w-7xl flex-col-reverse items-center justify-between gap-10 lg:flex-row"
		style="
			opacity: {visible ? 1 : 0};
			transform: translateY({visible ? '0' : '40px'}) scale({visible ? 1 : 0.97});
			filter: blur({visible ? 0 : 8}px);
			transition: opacity 0.8s cubic-bezier(.42,0,.2,1), transform 1s cubic-bezier(.42,0,.2,1), filter 1s cubic-bezier(.42,0,.2,1);
		"
	>
		<!-- Lado izquierdo: texto -->
		<div
			class="flex-1 space-y-5 text-center text-white lg:text-left"
			style="
				opacity: {visible ? 1 : 0};
				transform: translateY({visible ? '0' : '24px'}) scale({visible ? 1 : 0.96});
				transition: opacity 0.7s 0.09s cubic-bezier(.45,0,.18,1), transform 0.85s 0.09s cubic-bezier(.45,0,.18,1);
			"
		>
			<div class="flex justify-center backdrop-blur lg:justify-start">
				<Badge text="Beneficios que van más allá de la conexión" />
			</div>
			<h2 class="cta-animate-title text-3xl font-extrabold leading-tight drop-shadow sm:text-4xl">
				Descubrí lo que ganás al<br />ser parte de esta red solidaria.
			</h2>
			<p
				class="mb-12 max-w-lg text-base font-medium text-blue-100/85 drop-shadow-sm transition-opacity duration-500 {visible
					? 'opacity-100'
					: 'opacity-0'}"
			>
				Cada conexión puede transformar una vida, incluso la tuya.
			</p>
			<Button label="Registrate y empezá a generar impacto" href="/registro" variant="ghost" />
		</div>

		<!-- Lado derecho: imagen destacada con animación -->
		<div
			class="flex flex-1 items-end justify-center"
			style="
				opacity: {visible ? 1 : 0};
				filter: blur({visible ? 0 : 10}px) brightness({visible ? 1 : 0.95});
				transform: scale({visible ? 1 : 0.93});
				transition: opacity 0.9s 0.19s, filter 1s 0.19s, transform 1s 0.19s;
			"
		>
			<div
				class="cta-img-outer group relative h-[430px] w-[290px] overflow-visible rounded-[2rem] shadow-xl shadow-blue-950/20 ring-2 ring-blue-400/10 transition-all duration-500 hover:ring-blue-400/30 sm:h-[460px] sm:w-[320px]"
			>
				<div
					class="absolute left-0 top-0 h-full w-full overflow-hidden rounded-[2rem]"
					style="
		will-change: transform;
		transition: transform 0.85s cubic-bezier(.43,0,.15,1);
	"
					tabindex="-1"
				>
					<div class="h-full w-full transition-transform duration-700 group-hover:scale-105">
						<Image
							src="/img/cta-1.jpg"
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
	.cta-animate-title {
		animation: fadeInUp 1s 0.18s cubic-bezier(0.45, 0, 0.18, 1) both;
	}
	.cta-img-outer {
		animation: fadeInScale 1.2s 0.26s cubic-bezier(0.45, 0, 0.18, 1) both;
	}
	@keyframes fadeInUp {
		0% {
			opacity: 0;
			transform: translateY(60px);
			filter: blur(6px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
			filter: blur(0);
		}
	}
	@keyframes fadeInScale {
		0% {
			opacity: 0;
			transform: scale(0.93) translateY(60px);
			filter: blur(8px);
		}
		100% {
			opacity: 1;
			transform: scale(1) translateY(0);
			filter: blur(0);
		}
	}
</style>
