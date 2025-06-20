<!--
* Componente: TestimonialsSection
* Descripción: sección de testimonios con carrusel responsivo y animación de entrada.

TODO:
	- [ ] (Opcional) Agregar indicadores de posición del carrusel.
	- [ ] (Opcional) Agregar swipe para móviles.

-->

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
       import TestimonialCard from '$lib/components/ui/cards/TestimonialCard.svelte';
	import { testimonials } from '$lib/data/testimonials';

	let centerIndex = 1;
	let visibleCount = 3;

	function clampCenter() {
		if (centerIndex < 0) centerIndex = 0;
		if (centerIndex > testimonials.length - visibleCount) {
			centerIndex = testimonials.length - visibleCount;
		}
	}

	function updateVisibleCount() {
		visibleCount = window.innerWidth < 768 ? 1 : 3;
		clampCenter();
	}
	const showPrev = () => centerIndex > 0 && (centerIndex -= 1);
	const showNext = () => centerIndex < testimonials.length - visibleCount && (centerIndex += 1);

	$: visibleTestimonials = testimonials.slice(centerIndex, centerIndex + visibleCount);

	let visible = false;
	let sectionRef: HTMLElement;

	onMount(() => {
		updateVisibleCount();
		window.addEventListener('resize', updateVisibleCount);

		const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), {
			threshold: 0.15
		});
		sectionRef && io.observe(sectionRef);

		onDestroy(() => {
			window.removeEventListener('resize', updateVisibleCount);
			io.disconnect();
		});
	});
</script>

<section
	bind:this={sectionRef}
	class="pt-50 w-full bg-gradient-to-b from-white to-[#f7f8fd] px-4 pb-20 md:px-8"
	style="
		opacity:{visible ? 1 : 0};
		transform:translateY({visible ? '0' : '40px'}) scale({visible ? 1 : 0.96});
		filter:blur({visible ? 0 : 6}px);
		transition:opacity .8s cubic-bezier(.45,0,.2,1),
		          transform .8s cubic-bezier(.45,0,.2,1),
		          filter   .8s cubic-bezier(.45,0,.2,1);
	"
>
	<div
		class="mx-auto mb-10 max-w-6xl text-center"
		style="transition:opacity .9s .1s, transform .9s .1s; opacity:{visible
			? 1
			: 0}; transform:translateY({visible ? 0 : 24}px);"
	>
		<h2 class="mb-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
			Experiencias reales, <span class="text-[#63666d]">resultados reales.</span>
		</h2>
		<p class="mx-auto mb-3 max-w-2xl text-lg text-gray-500">
			Lo que dicen quienes confiaron en
			<span class="font-bold text-[rgb(var(--base-color))]">Conectando Corazones.</span>
		</p>
	</div>

	<!-- *Carrusel para desktop: flechas a los costados y cards en el centro -->
	<div
		class="relative mx-auto hidden w-full max-w-5xl min-[1210px]:flex min-[1210px]:flex-row min-[1210px]:items-center min-[1210px]:justify-between min-[1210px]:gap-4"
	>
		<!-- -*- Flecha izquierda -->
		<button
			on:click={showPrev}
			class="nav-btn cursor-pointer min-[1210px]:-translate-x-6"
			disabled={centerIndex === 0}
			aria-label="Ver testimonios anteriores"
		>
			<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</button>
		<!-- -*- Cards -->
		<div class="flex w-full flex-row items-center justify-center gap-6 md:gap-8">
			{#each visibleTestimonials as testimonial, i (testimonial.quote)}
				<TestimonialCard
					{...testimonial}
					active={i === (visibleCount === 3 ? 1 : 0)}
					locked={visibleCount === 3 ? i !== 1 : false}
				/>
			{/each}
		</div>
		<!-- -*- Flecha derecha -->
		<button
			on:click={showNext}
			class="nav-btn cursor-pointer min-[1210px]:translate-x-6"
			disabled={centerIndex === testimonials.length - visibleCount}
			aria-label="Ver testimonios siguientes"
		>
			<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</button>
	</div>

	<!--* Carrusel para mobile: cards arriba, flechas debajo -->
	<div class="relative mx-auto flex w-full max-w-5xl flex-col items-center min-[1210px]:hidden">
		<!-- -*- Cards -->
		<div class="flex w-full flex-row items-center justify-center gap-6 md:gap-8">
			{#each visibleTestimonials as testimonial, i (testimonial.quote)}
				<TestimonialCard
					{...testimonial}
					active={i === (visibleCount === 3 ? 1 : 0)}
					locked={visibleCount === 3 ? i !== 1 : false}
				/>
			{/each}
		</div>
		<!-- -*- Flechas debajo -->
		<div class="mt-10 flex w-full items-center justify-center gap-6">
			<button
				on:click={showPrev}
				class="nav-btn cursor-pointer"
				disabled={centerIndex === 0}
				aria-label="Ver testimonios anteriores"
			>
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</button>
			<button
				on:click={showNext}
				class="nav-btn cursor-pointer"
				disabled={centerIndex === testimonials.length - visibleCount}
				aria-label="Ver testimonios siguientes"
			>
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</button>
		</div>
	</div>
</section>

<style>
	.nav-btn {
		background: #ffffff;
		padding: 0.6rem;
		border-radius: 9999px;
		color: #3b82f6;
		box-shadow: 0 2px 6px #0001;
		transition:
			background 0.2s,
			box-shadow 0.2s;
		border: none;
		outline: none;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.nav-btn:hover:not(:disabled) {
		background: #e0ecff;
		box-shadow: 0 4px 12px #3b82f622;
	}
	.nav-btn:disabled {
		opacity: 0.4;
		pointer-events: none;
	}

	@media (min-width: 1210px) {
		.min-\[1210px\]\:flex {
			display: flex !important;
		}
		.min-\[1210px\]\:hidden {
			display: none !important;
		}
	}
</style>
