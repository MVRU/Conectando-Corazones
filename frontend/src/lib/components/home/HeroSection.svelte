<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import Image from '$lib/components/ui/elementos/Image.svelte';
	import Ticker from '$lib/components/visual/Ticker.svelte';
	import Badge from '$lib/components/ui/elementos/Badge.svelte';

	const logos = [
		'/instituciones/rotary.png',
		'/instituciones/unicef.png',
		'/instituciones/cruz-roja.png'
	];

	let mostrarHero = false;
	let mostrarImagenes = false;
	let sectionRef: HTMLElement;

	let observer: IntersectionObserver;

	onMount(() => {
		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						mostrarHero = false;
						mostrarImagenes = false;
						setTimeout(() => (mostrarHero = true), 50);
						setTimeout(() => (mostrarImagenes = true), 320);
					} else {
						mostrarHero = false;
						mostrarImagenes = false;
					}
				});
			},
			{ threshold: 0.33 }
		);
		if (sectionRef) observer.observe(sectionRef);

		return () => {
			if (observer && sectionRef) observer.unobserve(sectionRef);
		};
	});
</script>

<section
	bind:this={sectionRef}
	class="pt-30 relative w-full overflow-hidden bg-[rgb(var(--base-color))] px-4 pb-20 text-white md:px-8"
>
	<!-- -*-Fondo radial y líneas decorativas -->
	<span
		class="bg-gradient-radial pointer-events-none absolute left-1/2 top-0 z-0 h-[700px] w-[150vw] -translate-x-1/2 from-sky-500/30 via-transparent to-transparent"
	></span>
	<span
		class="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-transparent via-blue-900/10 to-sky-900/20"
	></span>

	<!-- -*-Luz azul suave detrás de la hero -->
	<span
		class="pointer-events-none absolute left-[60%] top-1/2 z-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/20 blur-3xl"
	></span>

	<div
		class="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-16 lg:flex-row"
	>
		<!-- *Texto principal -->
		<div class="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
			<div
				class="-mb-6 flex w-full justify-center transition-all duration-1000 lg:justify-start"
				class:hero-fade={!mostrarHero}
				style="transition-delay: 100ms"
			>
				<Badge
					text="Cada acción cuenta, empezá la tuya"
					customClass="text-sky-200 shadow-sm backdrop-blur"
					customColor="#dbe6e7"
				/>
			</div>
			<h1
				class="custom-margin mb-4 mt-16 text-4xl font-black leading-tight tracking-tight drop-shadow-[0_6px_32px_rgba(0,137,255,0.11)] transition-all duration-1000 sm:text-5xl"
				class:hero-fade={!mostrarHero}
				style="transition-delay: 180ms"
			>
				<span
					class="block bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-300 bg-clip-text text-transparent drop-shadow-md"
				>
					Cambiá una vida
				</span>
				<span class="mt-1 block text-white/90">con un clic.</span>
			</h1>
			<p
				class="mx-auto mt-4 max-w-xl text-xl font-medium text-sky-100/90 transition-all duration-1000 sm:text-xl lg:mx-0"
				class:hero-fade={!mostrarHero}
				style="transition-delay: 250ms"
			>
				Un puente digital entre quienes tienen algo valioso para dar y quienes luchan por un mundo
				mejor.
			</p>
			<div
				class="mt-10 flex justify-center transition-all duration-1000 lg:justify-start"
				class:hero-fade={!mostrarHero}
				style="transition-delay: 330ms"
			>
				<div
					class="duration-400 drop-shadow-lg transition-transform hover:scale-105 active:scale-95"
				>
					<Button
						label="Dejá tu opinión"
						href="https://docs.google.com/forms/d/e/1FAIpQLSd2ATCFzwuTLpmbNgFssKjGfk0GEpZD6NeygSyhdF10fuk23A/viewform?usp=sharing&ouid=105997224151194228520"
						variant="primary"
						size="md"
						external={true}
						target="_blank"
						customClass="px-8 py-3 text-lg font-bold shadow-lg bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-400 hover:to-blue-400 mt-3"
					/>
				</div>
			</div>
		</div>

		<!-- *Imágenes destacadas -->
		<div
			class="relative grid flex-1 grid-cols-2 gap-5 transition-all duration-1000 ease-out"
			class:hero-images={!mostrarImagenes}
		>
			<div
				class="rounded-4xl aspect-square w-full -translate-y-2 translate-x-3 rotate-6 transform overflow-hidden shadow-xl ring-2 ring-sky-300/30"
			>
				<Image src="/img/hero-1.webp" alt="Manos plantando árbol" animate="zoom" />
			</div>
			<div
				class="rounded-4xl aspect-square w-full -translate-x-4 translate-y-2 -rotate-6 transform overflow-hidden shadow-xl ring-2 ring-sky-300/30"
			>
				<Image src="/img/hero-2.webp" alt="Bomberos solidarios" animate="zoom" />
			</div>
			<div
				class="rounded-4xl aspect-square w-full -translate-y-8 -rotate-6 transform overflow-hidden shadow-lg ring-2 ring-sky-300/30"
			>
				<Image src="/img/hero-3.webp" alt="Profesionales de salud" animate="zoom" />
			</div>
			<div
				class="rotate-4 rounded-4xl aspect-square w-full -translate-x-4 -translate-y-4 transform overflow-hidden shadow-xl ring-2 ring-sky-300/30"
			>
				<Image src="/img/hero-4.webp" alt="Niños corriendo y sonriendo" animate="zoom" />
			</div>
		</div>
	</div>
	<div class="mt-20">
		<Ticker {logos} />
	</div>
</section>

<style>
	.hero-fade {
		opacity: 0;
		transform: translateY(40px) scale(0.97);
		filter: blur(6px);
		transition:
			opacity 1.1s cubic-bezier(0.43, 0, 0.15, 1),
			transform 1s cubic-bezier(0.44, 0, 0.23, 1),
			filter 1s cubic-bezier(0.44, 0, 0.23, 1);
	}
	.hero-images {
		opacity: 0;
		transform: scale(0.95) translateY(34px);
		filter: blur(9px);
		transition:
			opacity 1.1s cubic-bezier(0.44, 0, 0.23, 1),
			transform 1s cubic-bezier(0.43, 0, 0.15, 1),
			filter 1s cubic-bezier(0.44, 0, 0.23, 1);
	}
</style>
