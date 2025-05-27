<script lang="ts">
	export let text: string;
	export let shape: 'square' | 'circle' = 'square';
</script>

<div class="flex items-center gap-2">
	<span
		class="h-3 w-3 bg-[rgb(var(--color-primary))]"
		class:rounded-sm={shape === 'square'}
		class:rounded-full={shape === 'circle'}
	></span>
	<p class="text-sm font-semibold text-[rgb(var(--color-primary))]">{text}</p>
</div>
