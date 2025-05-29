<!--
* Componente: HeroSection
	-*- Descripción: sección principal de bienvenida (hero) de la landing page.
	-*- Funcionalidad: muestra mensaje central, llamado a la acción (CTA), imágenes representativas e integra componentes ya creados como `Button`, `Image` y `Ticker`.

* Props:
	-*- Ninguna explícita por ahora (contenidos estáticos).

! WARNING:
	-!- Las imágenes deben tener buena calidad y proporción cuadrada para evitar distorsiones.

? CUESTIONES ABIERTAS:
	-?- ¿Parametrizar texto e imágenes para hacerlo reutilizable?
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import Ticker from '$lib/components/visual/Ticker.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	const logos = [
		'/instituciones/rotary.png',
		'/instituciones/unicef.png',
		'/instituciones/cruz-roja.png'
	];

	let showHero = false;
	let showImages = false;

	onMount(() => {
		setTimeout(() => (showHero = true), 100);
		setTimeout(() => (showImages = true), 300);
	});
</script>

<section class="w-full bg-[rgb(var(--base-color))] px-4 py-20 text-white md:px-8">
	<div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 lg:flex-row">
		<!-- Texto principal -->
		<div class="flex-1 text-center lg:text-left">
			<div
				class="-mb-6 flex justify-center transition-all duration-1000 lg:justify-start"
				class:opacity-0={!showHero}
				class:translate-y-6={!showHero}
				style="transition-delay: 100ms"
			>
				<Badge text="Cada acción cuenta, empezá la tuya" />
			</div>
			<h1
				class="text-4xl font-extrabold leading-tight transition-all duration-1000 sm:text-5xl"
				class:opacity-0={!showHero}
				class:translate-y-6={!showHero}
				style="transition-delay: 200ms"
			>
				Cambiá una vida<br />
				<span class="text-white">con un clic.</span>
			</h1>
			<p
				class="mx-auto max-w-xl text-xl font-semibold text-gray-200 transition-all duration-1000 sm:text-2xl lg:mx-0"
				class:opacity-0={!showHero}
				class:translate-y-6={!showHero}
				style="transition-delay: 300ms"
			>
				Creamos puentes entre quienes tienen algo valioso para dar y quienes luchan por un mundo
				mejor.
			</p>
			<div
				class="mt-8 flex justify-center transition-all duration-1000 lg:justify-start"
				class:opacity-0={!showHero}
				class:translate-y-6={!showHero}
				style="transition-delay: 400ms"
			>
				<div class="mt-6 transition-transform duration-300 hover:scale-105 active:scale-95">
					<Button label="Registrarse" />
				</div>
			</div>
		</div>

		<!-- Imágenes destacadas -->
		<div
			class="relative grid flex-1 grid-cols-2 gap-4 rounded-3xl transition-all duration-1000 ease-out"
			class:opacity-0={!showImages}
			class:scale-90={!showImages}
			class:blur-sm={!showImages}
		>
			<div
				class="rounded-4xl aspect-square w-full -translate-y-2 translate-x-3 rotate-6 transform overflow-hidden"
			>
				<Image src="/img/plantando-arbol.jpg" alt="Manos plantando árbol" animate="zoom" />
			</div>
			<div
				class="rounded-4xl aspect-square w-full -translate-x-4 translate-y-2 -rotate-6 transform overflow-hidden"
			>
				<Image src="/img/bomberos-solidarios.jpg" alt="Bomberos solidarios" animate="zoom" />
			</div>
			<div
				class="rounded-4xl aspect-square w-full -translate-y-8 -rotate-6 transform overflow-hidden"
			>
				<Image src="/img/profesional-salud.jpg" alt="Profesionales de salud" animate="zoom" />
			</div>
			<div
				class="rotate-4 rounded-4xl aspect-square w-full -translate-x-4 -translate-y-4 transform overflow-hidden"
			>
				<Image src="/img/ninos-sonriendo.jpg" alt="Niños corriendo y sonriendo" animate="zoom" />
			</div>
		</div>
	</div>
</section>

<!-- Ticker con imágenes de instituciones -->
<div class="bg-[rgb(var(--base-color))] py-4">
	<Ticker {logos} />
</div>
