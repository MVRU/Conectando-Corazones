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
			if (rect.top < window.innerHeight - 70 && rect.bottom > 60) {
				visible = true;
			} else {
				visible = false;
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
		class="rounded-4xl relative mx-auto max-w-5xl overflow-hidden bg-gradient-to-b from-[rgb(var(--base-color))] to-[#27273e] px-6 pt-12 text-white shadow-2xl sm:px-10 sm:pt-16"
		style="
			opacity: {visible ? 1 : 0};
			filter: blur({visible ? 0 : 5}px);
			transform: translateY({visible ? '0' : '56px'}) scale({visible ? 1 : 0.97});
			transition: opacity 1.1s cubic-bezier(.4,0,.2,1), filter 1.1s cubic-bezier(.4,0,.2,1), transform 1.1s cubic-bezier(.4,0,.2,1);
			box-shadow: 0 10px 48px 0 #1e223f55;
		"
	>
		<!-- Badge y título -->
		<div
			class="relative z-10 text-center transition-all duration-1000"
			style="
				opacity: {visible ? 1 : 0};
				transform: translateY({visible ? '0' : '48px'}) scale({visible ? 1 : 0.96});
				filter: blur({visible ? 0 : 6}px);
				transition: opacity 0.9s .16s cubic-bezier(.47,0,.18,1), transform 0.9s .16s cubic-bezier(.47,0,.18,1), filter 0.8s .16s cubic-bezier(.47,0,.18,1);
			"
		>
			<div class="flex justify-center">
				<!-- Badge largo SOLO visible en sm (desktop) en adelante -->
				<Badge
					text="De un sueño a una realidad: nuestra historia"
					customClass="hidden sm:inline-flex"
				/>
				<!-- Badge corto SOLO visible en mobile -->
				<Badge text="Nuestra historia" customClass="inline-flex sm:hidden" />
			</div>

			<h2
				class="mx-auto mt-4 max-w-xl text-2xl font-bold leading-tight drop-shadow-lg sm:text-3xl md:text-4xl"
			>
				¿Y si pudiéramos conectar a quienes necesitan ayuda con quienes desean brindarla?
			</h2>
		</div>
		<!-- Imagen destacada -->
		<div class="flex flex-1 items-end justify-center pt-10">
			<div
				class="history-img-outer duration-600 group relative overflow-visible rounded-[2rem] shadow-xl shadow-blue-950/20 ring-2 ring-blue-400/10 transition-all hover:ring-blue-400/30"
				style="
					opacity: {visible ? 1 : 0};
					filter: blur({visible ? 0 : 13}px) brightness({visible ? 1 : 0.94});
					transform: scale({visible ? 1 : 0.92}) rotate({visible ? '0deg' : '8deg'});
					transition: opacity 1.12s .39s cubic-bezier(.44,0,.2,1), filter 1.1s .39s, transform 1.18s .39s cubic-bezier(.44,0,.2,1);
					box-shadow: 0 12px 48px 0 #373b686a, 0 0 0 4px #7dd3fc33;
				"
			>
				<div
					class="left-0 top-0 h-full w-full overflow-hidden rounded-[2rem]"
					style="will-change: transform; transition: transform 0.85s cubic-bezier(.43,0,.15,1);"
					tabindex="-1"
				>
					<div class="h-full w-full transition-transform duration-700 group-hover:scale-105">
						<Image src="/img/historia-1.webp" alt="Monje ofreciendo ayuda a niños" variant="card" />
					</div>
					<div
						style="
							opacity:{visible ? 0.22 : 0};
							transition: opacity 1.4s .68s cubic-bezier(.43,0,.2,1);
						"
						class="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#7dd3fc] via-transparent to-[#818cf833] blur-[18px]"
					></div>
				</div>
			</div>
		</div>
	</div>
</section>
