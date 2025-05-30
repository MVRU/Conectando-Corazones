<script lang="ts">
	export let question: string;
	export let answer: string;
	export let initiallyOpen = false;
	let open = initiallyOpen;
</script>

<div
	class="faq-item duration-400 group rounded-2xl border border-[#e9ecf7] bg-white/80 shadow transition-shadow hover:shadow-lg"
>
	<button
		type="button"
		class="flex w-full items-center justify-between px-6 py-4 text-left focus:outline-none"
		aria-expanded={open}
		on:click={() => (open = !open)}
	>
		<span class="text-lg font-medium text-[#2e386b]">{question}</span>
		<span class="duration-400 transition-transform" style="will-change: transform;">
			<svg
				class="duration-400 h-6 w-6 text-blue-400 transition-transform group-hover:scale-110"
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
		style="max-height: {open ? '180px' : '0'}; opacity: {open ? 1 : 0}; padding-bottom: {open
			? '1.1rem'
			: '0'};"
	>
		<p class="px-6 text-base text-gray-600">{answer}</p>
	</div>
</div>
