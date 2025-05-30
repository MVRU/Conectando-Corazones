<!--
* Componente: TestimonialsSection
	-*- Descripción: sección de testimonios de usuarios reales que han utilizado la plataforma.

* Props:
	-*- No recibe props por ahora; contenido estático.

TODO:
    - [ ] Corregir lógica de botones de navegación del carrusel.
	- [ ] Armar model y data para los testimonios -> código más limpio y reutilizable.
	- [ ] Agregar animaciones al carrusel.
	- [ ] Mejorar responsividad para móviles.

    -->

<script lang="ts">
	import TestimonialCard from '$lib/components/ui/TestimonialCard.svelte';
	import CarouselNavButton from '$lib/components/ui/CarouselNavButton.svelte';

	const testimonials = [
		{
			stars: 5,
			quote:
				'Nuestro equipo ha podido colaborar en proyectos que antes ni conocíamos. La plataforma nos guía hacia oportunidades que realmente importan.',
			author: 'Rotaract Club Local',
			role: ''
		},
		{
			stars: 5,
			quote:
				'Gracias a Conectando Corazones recibimos los libros que necesitábamos. Ahora nuestros niños pueden aprender con libros y sueños renovados.',
			author: 'María G.',
			role: 'Directora de una escuela rural'
		},
		{
			stars: 5,
			quote:
				'Encontré una causa que realmente me apasiona. Esta plataforma me conectó con personas que, como yo, quieren hacer la diferencia.',
			author: 'Juan P.',
			role: 'Voluntario en un comedor comunitario'
		},
		{
			stars: 5,
			quote: 'Participar fue fácil y el impacto fue real. Lo recomiendo a todas las ONGs.',
			author: 'Ana R.',
			role: 'ONG Pequeños Corazones'
		},
		{
			stars: 5,
			quote: 'El sitio es súper simple y logramos sumar donaciones en poco tiempo.',
			author: 'Carlos F.',
			role: 'Referente barrial'
		},
		{
			stars: 5,
			quote: 'Siento que mis ganas de ayudar encontraron el mejor lugar posible.',
			author: 'Lucía M.',
			role: 'Voluntaria'
		}
	];

	let track!: HTMLDivElement;
	let cards: HTMLDivElement[] = [];
	let active = 0;

	// Desplaza el carrusel y actualiza el testimonio activo
	function go(dir: 'prev' | 'next') {
		const max = testimonials.length - 1;
		const step = dir === 'next' ? 1 : -1;
		const next = Math.max(0, Math.min(active + step, max));
		console.log('Prev/Next:', dir, 'active:', active, 'next:', next, 'cards:', cards.length);
		active = next;
		cards[active]?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
	}

	// Ajusta el activo cuando el usuario scrollea manualmente
	function onScroll() {
		if (!cards.length) return;
		const middle = track.scrollLeft + track.clientWidth / 2;
		let minDiff = Number.MAX_VALUE;
		let idx = 0;
		cards.forEach((c, i) => {
			const center = c.offsetLeft + c.offsetWidth / 2;
			const diff = Math.abs(center - middle);
			if (diff < minDiff) {
				minDiff = diff;
				idx = i;
			}
		});
		if (active !== idx) {
			console.log('Scroll manual. Old active:', active, 'New active:', idx);
			active = idx;
		}
	}
</script>

<section class="w-full bg-white px-4 py-20 md:px-8">
	<div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
		<h2 class="text-center text-3xl font-extrabold leading-snug md:text-left">
			Experiencias reales, <span class="text-gray-500">resultados reales.</span>
		</h2>
		<div class="flex flex-col items-center space-y-1">
			<img src="/img/trustpilot.png" alt="Trustpilot logo" class="h-16 w-auto" />
			<span class="text-sm text-gray-600">Calificada con 4,9 de 5 estrellas.</span>
		</div>
	</div>

	<div class="relative mt-12">
		<div
			bind:this={track}
			on:scroll={onScroll}
			class="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-2 pb-4 sm:px-0"
		>
			{#each testimonials as t, i (i)}
				<div bind:this={cards[i]} class="w-80 shrink-0 snap-start md:w-96">
					<TestimonialCard {...t} active={i === active} />
				</div>
			{/each}
		</div>
		<CarouselNavButton direction="prev" on:click={() => go('prev')} />
		<CarouselNavButton direction="next" on:click={() => go('next')} />
	</div>
</section>

<style>
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
