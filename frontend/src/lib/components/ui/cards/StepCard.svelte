<script lang="ts">
	import { inView } from '$lib/actions/inView';

	export let stepNumber: number;
	export let title: string;
	export let summary: string;
	export let details: string;
	export let image: string;
	export let delay = 0;
	export let animate = false;
</script>

<!-- *Contenedor -->
<div
	role="region"
	aria-label={`Paso ${stepNumber}: ${title}`}
	class="group relative h-96 transform-gpu overflow-hidden rounded-3xl bg-white
               shadow-md transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.015]"
	style={`transition-delay:${delay}ms`}
	class:opacity-0={!animate}
	class:translate-y-8={!animate}
	use:inView={{ onChange: (v) => (animate = v), once: true, threshold: 0.2 }}
>
	<!-- *Imagen -->
	<img
		src={image}
		alt={title}
		loading="lazy"
		class="absolute inset-0 h-full w-full object-cover
                       transition-transform duration-700 group-hover:scale-105"
	/>

	<!-- *Overlay -->
	<div
		class="relative z-10 flex h-full flex-col justify-end bg-gradient-to-t
                       from-[#0f1029]/60 via-[#0f1029]/35 to-transparent p-5
                       transition-colors duration-500
                       group-hover:from-[#0f1029]/75 group-hover:via-[#0f1029]/50"
	>
		<!-- *Círculo con número (step) -->
		<div
			class="flex h-16 w-16 items-center justify-center self-start
                               rounded-full border-2 border-[#007fff] bg-white
                               text-3xl font-bold text-[#0f1029] shadow-md"
		>
			{stepNumber}
		</div>

		<!-- *Textos -->
		<h3
			class="mt-4 text-lg font-semibold text-white drop-shadow
                               transition-transform duration-300 group-hover:translate-y-6"
		>
			{title}
		</h3>
		<p
			class="text-sm text-white/90 transition-all duration-300
                               group-hover:translate-y-2 group-hover:opacity-0"
		>
			{summary}
		</p>

		<!-- *Detalles (fade on hover) -->
		<p
			class="translate-y-4 text-xs text-white/80 opacity-0
                               transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
		>
			{details}
		</p>
	</div>
</div>

<style>
	@keyframes heartbeat {
		0% {
			transform: scale(1);
		}
		14% {
			transform: scale(1.16);
		}
		28% {
			transform: scale(1);
		}
		42% {
			transform: scale(1.16);
		}
		70% {
			transform: scale(1);
		}
	}
	.group:hover {
		box-shadow:
			0 10px 32px 0 #19318a1a,
			0 1.5px 10px 0 #e6466611;
		transform: translateY(-3px) scale(1.02);
	}
</style>
