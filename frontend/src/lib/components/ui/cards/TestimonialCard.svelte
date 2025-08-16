<script lang="ts">
	export let stars: number = 5;
	export let quote: string = '';
	export let author: string = '';
	export let role: string = '';
	export let active: boolean = false;
	export let locked: boolean = false;

	const MAX_LENGTH = 180;

	// Cita truncada
	$: derivedQuote = quote.length > MAX_LENGTH ? quote.slice(0, MAX_LENGTH).trimEnd() + '…' : quote;
</script>

<div
	class="group relative flex h-[320px] min-h-[260px] w-full min-w-[280px] max-w-[380px] select-none flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white/80 bg-gradient-to-b from-white via-white to-gray-50 px-7 py-8 shadow-[0_4px_32px_0_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-500 will-change-transform
    hover:shadow-[0_12px_48px_0_rgba(30,100,200,0.12)]
    {active && !locked ? 'z-10 scale-105 ring-1 ring-blue-100/60' : ''}
    {locked
		? 'pointer-events-none opacity-75 blur-[0.5px]'
		: ' hover:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-50/70'}
  "
>
	<!-- Estrellas con diseño más refinado -->
	<div class="mb-5 flex justify-center gap-1.5">
		{#each Array(5) as _, i}
			<svg
				class="h-5 w-5 transition-all duration-300 ease-out
          {i < stars ? 'text-amber-400 drop-shadow-sm' : 'text-gray-200 group-hover:text-gray-300'}
          group-hover:scale-110"
				fill="currentColor"
				viewBox="0 0 20 20"
				aria-hidden="true"
			>
				<path
					d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.54 1.118l-3.386-2.46a1 1 0 00-1.175 0l-3.386 2.46c-.784.57-1.838-.197-1.54-1.118l1.287-3.955a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.955z"
				/>
			</svg>
		{/each}
	</div>

	<!-- Cita con comillas estilizadas -->
	<blockquote
		class="relative mb-6 flex-grow text-center text-base italic leading-relaxed text-gray-700/90 selection:bg-blue-50 selection:text-blue-800"
	>
		<span class="relative z-10">{derivedQuote}</span>
	</blockquote>

	<!-- Autor y rol -->
	<div class="mt-auto flex flex-col items-center gap-0.5">
		<p class="font-semibold text-gray-800 transition-colors duration-200 group-hover:text-blue-500">
			{author}
		</p>
		{#if role}
			<p class="text-xs font-medium text-gray-500">{role}</p>
		{/if}
	</div>
</div>
