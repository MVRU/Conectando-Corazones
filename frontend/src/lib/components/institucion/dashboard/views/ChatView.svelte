<script lang="ts">
	import { afterUpdate } from 'svelte';
	import { Send } from 'lucide-svelte';

	import type { ChatItem, ChatMessage, ChatThread } from '../types';
	import { BG_CARD, BORDER_SUBTLE, PRIMARY_500, TEXT_100, TEXT_300, TEXT_400 } from '../tokens';

	export let chatSummary: ChatItem | null = null;
	export let thread: ChatThread | null = null;

	let messageDraft = '';
	let conversationContainer: HTMLDivElement | null = null;
	let conversationMessages: ChatMessage[] = [];
	let lastThreadId: number | null = null;

	const messageFormatter = new Intl.DateTimeFormat('es-CO', {
		dateStyle: 'medium',
		timeStyle: 'short'
	});

	// -*- Alineamos el estado local con la conversación activa solo cuando cambia el hilo seleccionado.
	$: {
		const currentId = thread?.chatId ?? null;
		if (currentId !== lastThreadId) {
			conversationMessages = thread ? [...thread.messages] : [];
			lastThreadId = currentId;
		}
	}

	$: hasMessages = conversationMessages.length > 0;

	afterUpdate(() => {
		if (!conversationContainer) return;
		const lastMessage = conversationContainer.lastElementChild as HTMLElement | null;
		if (lastMessage) {
			lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
		}
	});

	function formatTimestamp(isoDate: string): string {
		try {
			return messageFormatter.format(new Date(isoDate));
		} catch (error) {
			return isoDate;
		}
	}

	function handleSend() {
		const trimmed = messageDraft.trim();
		if (!trimmed) return;

		const nextMessage: ChatMessage = {
			id: Date.now(),
			author: 'Institución',
			content: trimmed,
			sentAt: new Date().toISOString(),
			direction: 'outgoing'
		};

		conversationMessages = [...conversationMessages, nextMessage];
		messageDraft = '';
	}
</script>

{#if !chatSummary}
	<section
		class="flex min-h-[60vh] flex-col items-center justify-center gap-4 rounded-[28px] p-10 text-center"
		style={`background: ${BG_CARD}; border: 1px solid ${BORDER_SUBTLE}; box-shadow: 0 8px 28px rgba(0,0,0,0.22);`}
	>
		<h2 class="text-2xl font-semibold" style="color: {TEXT_100};">Selecciona una conversación</h2>
		<p class="max-w-lg text-base" style="color: {TEXT_300};">
			Elige un chat desde la barra lateral para visualizar el historial de mensajes y responder a
			tus contactos.
		</p>
	</section>
{:else}
	<section
		class="chat-wrapper flex min-h-[60vh] flex-col rounded-[28px]"
		style={`background: ${BG_CARD}; border: 1px solid ${BORDER_SUBTLE}; box-shadow: 0 18px 40px rgba(5,10,45,0.35); color: ${TEXT_100}; --bubble-text:${TEXT_100}; --bubble-meta:${TEXT_300}; --bubble-muted:${TEXT_400}; --divider:${BORDER_SUBTLE};`}
		aria-live="polite"
	>
		<header
			class="flex items-center justify-between gap-4 border-b px-6 py-5"
			style={`border-color: ${BORDER_SUBTLE};`}
		>
			<div class="flex items-center gap-4">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold uppercase"
					style={`background:${PRIMARY_500}1a; color:${PRIMARY_500}; border:1px solid ${PRIMARY_500}55;`}
					aria-hidden="true"
				>
					{chatSummary.name.slice(0, 2)}
				</div>
				<div class="flex flex-col">
					<h2 class="text-lg font-semibold" style="color: {TEXT_100};">{chatSummary.name}</h2>
					<span class="text-sm" style="color: {TEXT_400};">Último mensaje: {chatSummary.time}</span>
				</div>
			</div>
			<span class="hidden text-sm font-medium md:inline" style={`color: ${TEXT_300};`}>
				Conversación segura y encriptada
			</span>
		</header>

		<div class="flex h-full flex-1 flex-col gap-4 px-4 py-6 md:px-6">
			<div
				class="conversation space-y-4 overflow-y-auto pr-2"
				bind:this={conversationContainer}
				role="list"
			>
				{#if !hasMessages}
					<p
						class="rounded-2xl bg-black/20 px-4 py-3 text-center text-sm"
						style={`color: ${TEXT_300};`}
					>
						No hay mensajes registrados para este chat aún.
					</p>
				{:else}
					{#each conversationMessages as message (message.id)}
						<article
							class="message-item"
							class:message-item--outgoing={message.direction === 'outgoing'}
							class:message-item--incoming={message.direction === 'incoming'}
							role="listitem"
						>
							<div class="message-meta">
								<span class="message-author">{message.author}</span>
								<time class="message-timestamp" datetime={message.sentAt}>
									{formatTimestamp(message.sentAt)}
								</time>
							</div>
							<p class="message-content">{message.content}</p>
						</article>
					{/each}
				{/if}
			</div>

			<form class="message-form" on:submit|preventDefault={handleSend}>
				<label class="sr-only" for="chat-message-input">Escribe un mensaje</label>
				<div class="message-input">
					<textarea
						id="chat-message-input"
						bind:value={messageDraft}
						class="message-textarea"
						placeholder="Escribe un mensaje"
						rows="1"
						on:keydown={(event) => {
							if (event.key === 'Enter' && !event.shiftKey) {
								event.preventDefault();
								handleSend();
							}
						}}
					></textarea>
					<button
						class="send-button"
						style={`background: ${PRIMARY_500}; color: ${TEXT_100}; box-shadow: 0 10px 24px rgba(11, 152, 250, 0.35);`}
						type="submit"
						aria-label="Enviar mensaje"
					>
						<Send class="h-5 w-5" aria-hidden="true" />
					</button>
				</div>
			</form>
		</div>
	</section>
{/if}

<style>
	.chat-wrapper {
		min-height: clamp(480px, 68vh, 640px);
	}

	.conversation {
		scrollbar-width: thin;
	}

	.conversation::-webkit-scrollbar {
		width: 6px;
	}

	.conversation::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.18);
		border-radius: 9999px;
	}

	.message-item {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		max-width: min(80%, 520px);
		padding: 0.75rem 1rem;
		border-radius: 20px;
		background: linear-gradient(180deg, rgba(18, 26, 63, 0.75), rgba(18, 26, 63, 0.92));
		border: 1px solid rgba(255, 255, 255, 0.08);
		color: var(--bubble-text);
	}

	.message-item--outgoing {
		margin-left: auto;
		background: linear-gradient(180deg, rgba(11, 152, 250, 0.28), rgba(11, 152, 250, 0.55));
		border-color: rgba(11, 152, 250, 0.65);
	}

	.message-item--incoming {
		margin-right: auto;
	}

	.message-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.5rem;
		font-size: 0.75rem;
		color: var(--bubble-meta);
	}

	.message-author {
		font-weight: 600;
		color: var(--bubble-text);
	}

	.message-timestamp {
		color: var(--bubble-muted);
	}

	.message-content {
		font-size: 0.95rem;
		line-height: 1.5;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.message-form {
		border-top: 1px solid var(--divider);
		padding-top: 1rem;
	}

	.message-input {
		display: flex;
		align-items: flex-end;
		gap: 0.75rem;
		background: rgba(8, 12, 34, 0.65);
		border-radius: 24px;
		padding: 0.75rem 1rem;
		border: 1px solid rgba(255, 255, 255, 0.05);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
	}

	.message-textarea {
		flex: 1;
		resize: none;
		border: none;
		background: transparent;
		color: var(--bubble-text);
		font-size: 1rem;
		line-height: 1.5;
		min-height: 24px;
		max-height: 120px;
		outline: none;
	}

	.message-textarea::placeholder {
		color: var(--bubble-muted);
	}

	.send-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		border: none;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.send-button:hover {
		transform: scale(1.05);
		box-shadow: 0 12px 28px rgba(11, 152, 250, 0.45);
	}

	.send-button:active {
		transform: scale(0.96);
	}

	@media (max-width: 640px) {
		.chat-wrapper {
			border-radius: 20px;
		}

		.message-item {
			max-width: 100%;
		}
	}
</style>
