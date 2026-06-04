<script lang="ts">
	import { escapeRegExp } from '$lib/utils/sanitize';

	let { text, query } = $props<{
		text: string;
		query: string;
	}>();

	let parts = $derived.by(() => {
		if (!query.trim()) {
			return [{ text, highlighted: false }];
		}
		const regex = new RegExp(`(${escapeRegExp(query.trim())})`, 'gi');
		return text.split(regex).map((part: string, i: number): { text: string; highlighted: boolean } => ({
			text: part,
			highlighted: i % 2 === 1
		}));
	});
</script>

<span class="inline-block w-full wrap-break-word">
	{#each parts as part, i (i)}
		{#if part.highlighted}
			<mark class="rounded bg-blue-200 px-1 wrap-break-word">{part.text}</mark>
		{:else}
			{part.text}
		{/if}
	{/each}
</span>
