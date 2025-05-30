<script lang="ts">
	export let stars = 5;
	export let quote = '';
	export let author = '';
	export let role = '';
	export let active = false;
</script>

<div
	class="rounded-2xl bg-gray-50 p-6 text-gray-800 shadow-sm transition-transform duration-300"
	class:scale-105={active}
>
	<div>
		{#each Array(stars) as _}
			<span class="text-lg text-yellow-400">&#9733;</span>
		{/each}
	</div>
	<p class="mt-4 text-base leading-snug">"{quote}"</p>
	<div class="mt-6">
		<p class="font-semibold text-gray-900">{author}</p>
		{#if role}
			<p class="text-sm text-gray-600">{role}</p>
		{/if}
	</div>
</div>
