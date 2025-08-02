<script lang="ts">
	// * DECISIÓN DE DISEÑO
	// - Listado independiente para mantener SRP.
	// - Emite 'select' para que el contenedor decida el manejo del estado.
	// ? Estilos mínimos a la espera de integración con diseño final.
	import { createEventDispatcher } from 'svelte';
	import type { ChatInfo } from '$lib/types/Chat';

	export let chats: ChatInfo[] = [];
	export let selectedChatId: string;

	const dispatch = createEventDispatcher<{ select: string }>();
	function selectChat(id: string) {
		dispatch('select', id);
	}
</script>

<aside class="w-64 overflow-y-auto border-r bg-white" aria-label="Lista de chats">
	<ul>
		{#each chats as chat (chat.id)}
			<li>
				<button
					type="button"
					class="block w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none {selectedChatId ===
					chat.id
						? 'bg-gray-200 font-semibold'
						: ''}"
					on:click={() => selectChat(chat.id)}
				>
					{chat.name}
				</button>
			</li>
		{/each}
	</ul>
</aside>
