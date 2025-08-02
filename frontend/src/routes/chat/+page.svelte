<script lang="ts">
	// * DECISIÓN DE DISEÑO
	// - Composición de Sidebar y Window para mantener modularidad.
	// - Datos de ejemplo hasta integrar API real.
	// -? Altura fija basada en cabecera; ajustar para móviles.
	import type { ChatInfo } from '$lib/types/Chat';
	import type { Message } from '$lib/types/Chat';
	import ChatSidebar from '$lib/components/chat/ChatSidebar.svelte';
	import ChatWindow from '$lib/components/chat/ChatWindow.svelte';

	interface Chat extends ChatInfo {
		messages: Message[];
	}

	let chats: Chat[] = [
		{
			id: '1',
			name: 'Proyecto A',
			owner: 'Institución A',
			messages: [
				{ id: 'm1', user: 'Institución A', text: 'Bienvenidos al proyecto.', time: '10:00' }
			]
		},
		{
			id: '2',
			name: 'Proyecto B',
			owner: 'Institución B',
			messages: [
				{ id: 'm2', user: 'Institución B', text: 'Comencemos la planificación.', time: '11:30' }
			]
		}
	];

	let selectedId = chats[0].id;

	$: currentChat = chats.find((c) => c.id === selectedId);

	function selectChat(id: string) {
		selectedId = id;
	}

	function addMessage(text: string) {
		const chat = chats.find((c) => c.id === selectedId);
		if (!chat) return;
		chat.messages = [
			...chat.messages,
			{
				id: crypto.randomUUID(),
				user: 'yo',
				text,
				time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
			}
		];
		chats = [...chats];
	}
</script>

<div class="flex h-[calc(100vh-4rem)] bg-white">
	<ChatSidebar {chats} selectedChatId={selectedId} on:select={(e) => selectChat(e.detail)} />
	{#if currentChat}
		<ChatWindow messages={currentChat.messages} on:send={(e) => addMessage(e.detail)} />
	{:else}
		<p class="p-4">Selecciona un chat</p>
	{/if}
</div>
