<script lang="ts">
	import { clsx } from 'clsx';
	export let label: string;
	export let variant: 'primary' | 'secondary' = 'primary';
	export let disabled = false;
</script>

<button
	class={clsx(
		'rounded px-4 py-2 font-semibold transition',
		variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
		variant === 'secondary' && 'bg-gray-200 text-black hover:bg-gray-300',
		disabled && 'cursor-not-allowed opacity-50'
	)}
	{disabled}
>
	{label}
</button>
