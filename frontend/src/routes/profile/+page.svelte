<!-- TODOs:
 	- [ ] Rehacer todo para cuando los types y los datos coincidan con DER -->

<script lang="ts">
	import { onMount } from 'svelte';
	import { authActions, user as userStore } from '$lib/stores/auth';
	import type { Usuario, Institucion, Colaborador, Organizacion, Unipersonal } from '$lib/types/Usuario';
	import Loader from '$lib/components/feedback/Loader.svelte';

	let usuario: Usuario | null = null;
	let institucionUsuario: Institucion | null = null;
	let colaboradorUsuario: Colaborador | null = null;
	let organizacionUsuario: Organizacion | null = null;
	let unipersonalUsuario: Unipersonal | null = null;

	onMount(async () => {
		await authActions.login('admin_conectando', '123456');
	});

	$: if ($userStore) {
		usuario = $userStore;

		if (usuario?.rol === 'institucion') {
			institucionUsuario = usuario as Institucion;
		} else if (usuario?.rol === 'colaborador') {
			colaboradorUsuario = usuario as Colaborador;
			
			// Determinar si es organización o unipersonal
			if ('razon_social' in colaboradorUsuario) {
				organizacionUsuario = colaboradorUsuario as Organizacion;
			} else {
				unipersonalUsuario = colaboradorUsuario as Unipersonal;
			}
		}
	}
</script>

<div class="mx-auto max-w-6xl px-4 py-10">
	{#if !usuario}
		<Loader loading />
	{:else}
	<div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl"></div>
	{/if}
</div>
