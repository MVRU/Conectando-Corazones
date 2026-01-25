<script lang="ts">
	import { page } from '$app/stores';
	import { mockChats } from '$lib/infrastructure/mocks/mock-chats';
	import { mockProyectos } from '$lib/infrastructure/mocks/mock-proyectos';
	import MessageBubble from '$lib/components/feature/chat/MessageBubble.svelte';
	import MessageInput from '$lib/components/feature/chat/MessageInput.svelte';
	import { afterUpdate } from 'svelte';

	import { usuario } from '$lib/stores/auth';

	// Obtener ID del proyecto desde la URL
	$: proyectoId = Number($page.params.proyecto_id);

	// Cargar chat y proyecto
	$: chat = mockChats.find((c) => c.proyecto_id === proyectoId);
	$: proyecto = mockProyectos.find((p) => p.id_proyecto === proyectoId);

	// Validar acceso
	$: hasAccess =
		$usuario?.id_usuario && chat?.participantes_ids.includes($usuario.id_usuario) ? true : false;

	// Validar estado del proyecto para escritura
	$: canWrite =
		proyecto?.estado &&
		!['auditoria', 'cancelado', 'completado'].includes(proyecto.estado) &&
		hasAccess;

	// Scroll al fondo
	let chatContainer: HTMLElement;

	const scrollToBottom = () => {
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	};

	afterUpdate(() => {
		scrollToBottom();
	});

	// Manejar envío de mensaje (simulado localmente)
	function handleSend(event: CustomEvent) {
		if (!chat || !$usuario?.id_usuario) return;

		const nuevoMensaje = {
			id_mensaje: Date.now(),
			chat_id: chat.id_chat,
			remitente_id: $usuario.id_usuario,
			contenido: event.detail.contenido,
			created_at: new Date()
		};

		// Actualizar array de mensajes (reactividad Svelte)
		chat.mensajes = [...chat.mensajes, nuevoMensaje];
		chat.updated_at = new Date();
	}
</script>

{#if !chat}
	<div class="flex h-full items-center justify-center">
		<p class="text-gray-500">Chat no encontrado.</p>
	</div>
{:else if !hasAccess}
	<div class="flex h-full items-center justify-center">
		<p class="text-red-500">No tienes permiso para ver este chat.</p>
	</div>
{:else}
	<div class="flex h-full flex-col">
		<!-- Header -->
		<header class="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
			<div>
				<h1 class="text-xl font-bold text-gray-900">{chat.titulo}</h1>
				<p class="text-sm text-gray-500">
					{proyecto?.estado
						? proyecto.estado.replace('_', ' ').toUpperCase()
						: 'Estado desconocido'}
				</p>
			</div>
			<div class="flex gap-2">
				<a
					href="/proyectos/{proyectoId}"
					class="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
				>
					Ver proyecto
				</a>
				<a
					href="/institucion/proyectos/{proyectoId}/aportes"
					class="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
				>
					Evidencias
				</a>
			</div>
		</header>

		<!-- Messages Area -->
		<div class="flex-1 overflow-y-auto bg-gray-50 p-6" bind:this={chatContainer}>
			{#each chat.mensajes as mensaje (mensaje.id_mensaje)}
				<MessageBubble {mensaje} isOwn={mensaje.remitente_id === $usuario?.id_usuario} />
			{/each}
		</div>

		<!-- Input Area -->
		<MessageInput disabled={!canWrite} on:send={handleSend} />
	</div>
{/if}
