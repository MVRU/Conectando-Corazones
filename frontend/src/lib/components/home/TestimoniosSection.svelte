<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import TestimoniosCard from '$lib/components/ui/cards/TestimoniosCard.svelte';
	import { mockTestimonios } from '$lib/mocks/mock-testimonios';
	import { swipe } from '$lib/actions/swipe';

	let centerIndex = 0;
	let visibleCount = 3;

	function clampCenter() {
		const maxStart = Math.max(0, mockTestimonios.length - visibleCount);
		if (centerIndex < 0) centerIndex = 0;
		if (centerIndex > maxStart) centerIndex = maxStart;
	}

	function updateVisibleCount() {
		visibleCount = window.innerWidth < 768 ? 1 : 3;
		clampCenter();
	}

	const showPrev = () => centerIndex--;
	const showNext = () => centerIndex++;

	$: testimoniosVisibles = Array.from({ length: visibleCount }, (_, i) => {
		const index = (centerIndex + i) % mockTestimonios.length;
		return mockTestimonios[(index + mockTestimonios.length) % mockTestimonios.length];
	});

	let visible = false;
	let sectionRef: HTMLElement;

	onMount(() => {
		updateVisibleCount();
		window.addEventListener('resize', updateVisibleCount);

		const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), {
			threshold: 0.15
		});
		if (sectionRef) io.observe(sectionRef);

		onDestroy(() => {
			window.removeEventListener('resize', updateVisibleCount);
			io.disconnect();
		});
	});
</script>

<section
	bind:this={sectionRef}
	class="w-full bg-gradient-to-b from-white via-blue-50 to-gray-100 px-4 py-20 sm:px-6 lg:px-8"
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
		class="duration-900 mx-auto mb-12 max-w-5xl text-center opacity-0 transition delay-100 data-[visible]:transform-none data-[visible]:opacity-100"
		data-visible={visible}
		style="transform:translateY({visible ? 0 : '24px'}); opacity:{visible ? 1 : 0};"
	>
		<h2 class="mb-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
			Experiencias reales, <span class="text-gray-600">resultados reales.</span>
		</h2>
		<p class="mx-auto max-w-2xl text-lg text-gray-500">
			Lo que dicen quienes confiaron en{' '}
			<span class="font-bold text-blue-500">Conectando Corazones.</span>
		</p>
	</div>

	<!-- Carrusel -->
	<!-- ! Ignorar el error que aparece, está ok -->
	<div
		use:swipe={{}}
		on:swipe-left={showNext}
		on:swipe-right={showPrev}
		class="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-6"
	>
		<!-- Contenedor de tarjetas -->
		<div class="flex w-full flex-row items-center justify-center gap-4 md:gap-6">
			{#each testimoniosVisibles as testimonio, i (testimonio.contenido)}
				<TestimoniosCard
					{...testimonio}
					active={i === Math.floor(visibleCount / 2)}
					locked={i !== Math.floor(visibleCount / 2)}
				/>
			{/each}
		</div>

		<!-- Flechas únicas para todos los dispositivos -->
		<div class="mt-6 flex w-full justify-between px-4">
			<button
				on:click={showPrev}
				class="nav-btn flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white p-2 shadow-md transition-all hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
				aria-label="Anterior testimonio"
			>
				<svg class="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
				class="nav-btn flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white p-2 shadow-md transition-all hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
				aria-label="Siguiente testimonio"
			>
				<svg class="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</button>
		</div>
	</div>
</section>

<style>
	.nav-btn {
		background: #ffffff;
		color: #3b82f6;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
		transition:
			background 0.2s ease,
			box-shadow 0.2s ease;
		border: none;
		outline: none;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.nav-btn:hover:not(:disabled) {
		background: #e0ecff;
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
	}

	.nav-btn:disabled {
		opacity: 0.4;
		pointer-events: none;
	}
</style>
