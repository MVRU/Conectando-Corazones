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
			class="flex flex-1 items-end justify-center"
			style="
				opacity: {visible ? 1 : 0};
				filter: blur({visible ? 0 : 10}px) brightness({visible ? 1 : 0.95});
				transform: scale({visible ? 1 : 0.93});
				transition: opacity 0.9s 0.19s, filter 1s 0.19s, transform 1s 0.19s;
			"
		>
			<div
				class="cta-img-outer group relative overflow-visible rounded-[2rem] shadow-xl shadow-blue-950/20 ring-2 ring-blue-400/10 transition-all duration-500 hover:ring-blue-400/30"
			>
				<div
					class=" left-0 top-0 h-full w-full overflow-hidden rounded-[2rem]"
					style="
		will-change: transform;
		transition: transform 0.85s cubic-bezier(.43,0,.15,1);
	"
					tabindex="-1"
				>
					<div class="h-full w-full transition-transform duration-700 group-hover:scale-105">
						<Image src="/img/historia-1.jpg" alt="Monje ofreciendo ayuda a niños" variant="card" />
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
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
