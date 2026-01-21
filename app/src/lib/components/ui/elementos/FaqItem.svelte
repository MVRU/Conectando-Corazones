<script lang="ts">
	export let question: string;
	export let answer: string;
	export let initiallyOpen = false;
	let open = initiallyOpen;
</script>

<div
	class="faq-item group rounded-2xl border border-[#e9ecf7] bg-white/80 shadow transition-shadow duration-400 hover:shadow-lg"
>
	<button
		type="button"
		class="flex w-full items-center justify-between px-4 py-3 text-left focus:outline-none sm:px-6 sm:py-4"
		aria-expanded={open}
		on:click={() => (open = !open)}
	>
		<span class="text-base font-medium text-[#2e386b] sm:text-lg">{question}</span>
		<span class="transition-transform duration-400" style="will-change: transform;">
			<svg
				class="h-6 w-6 text-blue-400 transition-transform duration-400 group-hover:scale-110"
				style="transform: rotate({open ? 180 : 0}deg);"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				viewBox="0 0 24 24"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M6 9l6 6 6-6" />
			</svg>
		</span>
	</button>
	<div
		class="accordion-answer overflow-hidden transition-all duration-500"
		style="max-height: {open ? '220px' : '0'}; opacity: {open ? 1 : 0}; padding-bottom: {open
			? '1.1rem'
			: '0'};"
	>
		<p class="px-4 py-1 text-sm text-gray-600 sm:px-6 sm:text-base">{answer}</p>
	</div>
</div>
