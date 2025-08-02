<script lang="ts">
	// * DECISIÓN DE DISEÑO
	// - Presenta mensajes y delega envío a MessageInput para modularidad.
	// - Emite evento 'send' para que el contenedor gestione persistencia.
	// -!- No implementa scroll automático por simplicidad actual.
	import { createEventDispatcher } from 'svelte';
	import MessageInput from './MessageInput.svelte';
	import type { Message } from '$lib/types/Chat';

	export let messages: Message[] = [];

	const dispatch = createEventDispatcher<{ send: string }>();
	function handleSend(event: CustomEvent<string>) {
		dispatch('send', event.detail);
	}
</script>

<section class="flex flex-1 flex-col" aria-label="Conversación">
	<div class="flex-1 space-y-2 overflow-y-auto p-4">
		{#each messages as msg (msg.id)}
			<div
				class="max-w-[75%] rounded px-3 py-2 text-sm {msg.user === 'yo'
					? 'ml-auto bg-blue-500 text-white'
					: 'bg-gray-200'}"
			>
				<p>{msg.text}</p>
				<span class="text-xs text-gray-600">{msg.time}</span>
			</div>
		{/each}
	</div>
	<MessageInput on:send={handleSend} />
</section>
