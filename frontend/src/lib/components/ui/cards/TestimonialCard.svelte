<!--
* Componente: TestimonialCard
  -*- Descripción: tarjeta de testimonio con diseño claro, sombra, hover elegante solo si no está locked.
  -*- Props:
      -*- stars: number (calificación)
      -*- quote: string (frase del testimonio)
      -*- author: string
      -*- role?: string
      -*- active?: boolean -> si es la card destacada
      -*- locked?: boolean -> si está "bloqueada" (sin hover)
-->

<script lang="ts">
	export let stars: number;
	export let quote: string;
	export let author: string;
	export let role: string = '';
	export let active: boolean = false;
	export let locked: boolean = false;
</script>

<div
	class={`testimonial-card flex min-h-[260px] min-w-[260px] max-w-[350px] flex-col rounded-3xl border border-blue-200/30 bg-white px-7 py-8 shadow-[0_4px_28px_0_#bbeafe20] transition-all duration-500
		${active && !locked ? 'z-10 scale-105 shadow-[0_8px_40px_0_#38bdf833] ring-2 ring-blue-200/30' : ''}
		${!locked ? 'cursor-pointer focus-within:ring-2 focus-within:ring-blue-200/40 hover:-translate-y-2 hover:shadow-[0_8px_40px_0_#38bdf833] hover:ring-2 hover:ring-blue-200/40' : 'pointer-events-none scale-95 opacity-70 blur-[0.5px]'}
	`}
>
	<div class="mb-3 flex gap-0.5">
		{#each Array(stars) as _, i}
			<svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
				<path
					d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.54 1.118l-3.386-2.46a1 1 0 00-1.175 0l-3.386 2.46c-.784.57-1.838-.197-1.54-1.118l1.287-3.955a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.955z"
				/>
			</svg>
		{/each}
	</div>
	<blockquote class="relative mb-5 text-base italic leading-relaxed text-gray-700">
		<span class="absolute -left-4 -top-2 text-2xl text-blue-200/60">"</span>
		{quote}
		<span class="text-2xl text-blue-200/60">"</span>
	</blockquote>
	<div class="mt-auto flex flex-col items-start gap-0.5">
		<p class="font-semibold text-[rgb(var(--color-primary))]">{author}</p>
		{#if role}
			<p class="text-xs text-gray-400">{role}</p>
		{/if}
	</div>
</div>

<style>
	.testimonial-card {
		background: linear-gradient(180deg, #fff 75%, #f0f6ff 100%);
	}
</style>
