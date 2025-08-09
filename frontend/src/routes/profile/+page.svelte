<!-- TODOs:
 	- [ ] Rehacer todo para cuando los types y los datos coincidan con DER -->

<script lang="ts">
	import { onMount } from 'svelte';
	import { authActions, user as userStore } from '$lib/stores/auth';
	import type { User, InstitucionUser, ColaboradorUser } from '$lib/types/User.ts';
	import Loader from '$lib/components/feedback/Loader.svelte';

	let user: User | null = null;
	let institucionUser: InstitucionUser | null = null;
	let colaboradorUser: ColaboradorUser | null = null;

	onMount(async () => {
		await authActions.login('escuela@esperanza.edu.ar', '123456');
	});

	$: if ($userStore) {
		user = $userStore;

		if (user?.role === 'institucion') {
			institucionUser = user as InstitucionUser;
		} else if (user?.role === 'colaborador') {
			colaboradorUser = user as ColaboradorUser;
		}
	}
</script>

<div class="mx-auto max-w-6xl px-4 py-10">
	{#if !user}
		<Loader loading />
	{:else}
		<div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl"></div>
	{/if}
</div>
