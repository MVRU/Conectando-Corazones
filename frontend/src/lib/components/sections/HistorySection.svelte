<!--
* Componente: HistorySection
	-*- Descripción: sección narrativa que presenta la historia e inspiración del proyecto.
	-*- Funcionalidad: muestra un título llamativo con fondo en degradado oscuro, badge y una imagen significativa.

* Props:
	-*- No recibe props por ahora (contenido estático).

TODO:
	- [ ] Añadir animaciones de entrada suave.
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Image from '$lib/components/ui/Image.svelte';

	let visible = false;
	let sectionRef: HTMLDivElement;

	onMount(() => {
		const reveal = () => {
			const rect = sectionRef.getBoundingClientRect();
			if (rect.top < window.innerHeight - 40) {
				visible = true;
				window.removeEventListener('scroll', reveal);
			}
		};
		window.addEventListener('scroll', reveal);
		reveal();
		return () => window.removeEventListener('scroll', reveal);
	});
</script>

<section class="w-full bg-white px-4 py-20 md:px-8">
	<div
		bind:this={sectionRef}
		class="rounded-4xl duration-800 mx-auto max-w-5xl bg-gradient-to-b from-[rgb(var(--base-color))] to-[#27273e] px-6 pt-12 text-white transition-all sm:px-10 sm:pt-16"
		style="opacity: {visible ? 1 : 0}; filter: blur({visible
			? 0
			: 6}px); transform: translateY({visible ? '0px' : '55px'}) scale({visible
			? 1
			: 0.965}); transition: opacity 1.1s cubic-bezier(.4,0,.2,1), filter 1.05s cubic-bezier(.4,0,.2,1), transform 1.1s cubic-bezier(.4,0,.2,1);"
	>
		<div class="text-center">
			<div class="flex justify-center">
				<Badge text="De un sueño a una realidad: nuestra historia" />
			</div>
			<h2 class="mx-auto mt-4 max-w-xl text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
				¿Y si pudiéramos conectar a quienes necesitan ayuda con quienes desean brindarla?
			</h2>
		</div>

		<!-- Imagen destacada -->
		<div
			class="history-img-animated group relative mx-auto mt-10 flex w-full max-w-3xl justify-center overflow-hidden rounded-[2.5rem]"
			style="
                opacity: {visible ? 1 : 0};
                transform: scale({visible ? 1 : 0.92});
                transition: opacity 0.85s 0.12s cubic-bezier(0.4,0,0.2,1), transform 0.85s 0.12s cubic-bezier(0.4,0,0.2,1);
            "
		>
			<Image src="/img/historia-1.jpg" alt="Monje ofreciendo ayuda a niños" variant="card" />
		</div>
	</div>
</section>

<style>
	/* Animación de la sección al aparecer */
	.history-img-animated {
		backface-visibility: hidden;
		will-change: opacity, transform, filter;
	}
</style>
