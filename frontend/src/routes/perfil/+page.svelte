<!-- TODOs:
 	- [ ] Rehacer todo para cuando los types y los datos coincidan con DER -->

<script lang="ts">
	import { authActions, usuario as usuarioStore } from '$lib/stores/auth';
	import Loader from '$lib/components/feedback/Loader.svelte';
	import { onMount } from 'svelte';
	import type { Usuario } from '$lib/types/Usuario';
	import { onDestroy } from 'svelte';

	let usuario: Usuario | null = null;

	const unsubscribe = usuarioStore.subscribe((value) => {
		usuario = value;
	});

	onMount(async () => {
		await authActions.login('escuela_esperanza', '123456');
	});

	onDestroy(() => unsubscribe());
</script>

<div class="mx-auto max-w-6xl px-4 py-10">
	{#if !usuario}
		<Loader loading />
	{:else}
		<div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl"></div>
	{/if}
</div>
