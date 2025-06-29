<script lang="ts">
	export let id = '';
	export let name = '';
	export let value = '';
	export let error = '';
</script>

<div>
	<label for={id} class="block font-medium text-gray-700">{name}</label>
	<input
		type="date"
		{id}
		{name}
		bind:value
		class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
	/>
	{#if error}
		<p class="mt-1 text-sm text-red-600" role="alert">{error}</p>
	{/if}
</div>
