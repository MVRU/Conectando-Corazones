<script lang="ts">
	import { escapeRegExp } from '$lib/utils/sanitize';

	export let text: string;
	export let query: string;

	$: parts = (() => {
		if (!query.trim()) {
			return [{ text, highlighted: false }];
		}
		const regex = new RegExp(`(${escapeRegExp(query.trim())})`, 'gi');
		return text.split(regex).map((part, i) => ({
			text: part,
			highlighted: i % 2 === 1
		}));
	})();
</script>

<span class="inline-block w-full break-words">
	{#each parts as part, i (i)}
		{#if part.highlighted}
			<mark class="rounded bg-blue-200 px-1 break-words">{part.text}</mark>
		{:else}
			{part.text}
		{/if}
	{/each}
</span>
