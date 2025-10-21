<script lang="ts">
	import { afterUpdate, createEventDispatcher } from 'svelte';
	import { Info, Send, Users } from 'lucide-svelte';

	import type { ChatItem, ChatMessage, ChatMetadata, ChatThread } from '../types';
	import { BG_CARD, BORDER_SUBTLE, PRIMARY_500, TEXT_100, TEXT_300, TEXT_400 } from '../tokens';

	type ChatViewEvents = {
		toggleDetails: { open: boolean };
	};

	const INSTITUTION_AVATAR = '/users/escuela-esperanza.jpg';
	const GENERIC_AVATAR = '/users/avatar-generico.svg';

	export let chatSummary: ChatItem | null = null;
	export let thread: ChatThread | null = null;
	export let metadata: ChatMetadata | null = null;
	export let detailsOpen = false;

	const dispatch = createEventDispatcher<ChatViewEvents>();

	let messageDraft = '';
	let conversationContainer: HTMLDivElement | null = null;
	let conversationMessages: ChatMessage[] = [];
	let lastThreadId: number | null = null;
	const panelId = 'chat-details-panel';

	const messageFormatter = new Intl.DateTimeFormat('es-CO', {
		dateStyle: 'medium',
		timeStyle: 'short'
	});

	$: {
		const currentId = thread?.chatId ?? chatSummary?.id ?? null;
		if (currentId !== lastThreadId) {
			conversationMessages = thread ? [...thread.messages] : [];
			lastThreadId = currentId;
		}
	}

	$: hasMessages = conversationMessages.length > 0;
	$: participantCount = metadata ? 1 + (metadata.collaborators?.length ?? 0) : 0;

	afterUpdate(() => {
		if (!conversationContainer) return;
		const lastMessage = conversationContainer.lastElementChild as HTMLElement | null;
		if (lastMessage && typeof lastMessage.scrollIntoView === 'function') {
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
			author: 'Patricia González',
			organization: 'Escuela Esperanza',
			role: 'Institución',
			content: trimmed,
			sentAt: new Date().toISOString(),
			direction: 'outgoing',
			avatar: INSTITUTION_AVATAR
		};

		conversationMessages = [...conversationMessages, nextMessage];
		messageDraft = '';
	}

	function resolveAvatar(message: ChatMessage): string {
		if (message.avatar) return message.avatar;
		if (message.role === 'Institución') return INSTITUTION_AVATAR;
		return GENERIC_AVATAR;
	}

	function handleDetailsToggle() {
		if (!metadata) return;
		dispatch('toggleDetails', { open: !detailsOpen });
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
			class="flex flex-wrap items-center justify-between gap-4 border-b px-6 py-5"
			style={`border-color: ${BORDER_SUBTLE};`}
		>
			<div class="flex items-center gap-4">
				<div class="chat-summary-avatar" aria-hidden="true">
					<img
						src={metadata?.institution.avatar ?? INSTITUTION_AVATAR}
						alt={`Avatar de ${metadata?.institution.name ?? chatSummary.name}`}
						loading="lazy"
					/>
				</div>
				<div class="flex flex-col">
					<div class="flex items-center gap-2">
						<h2 class="text-lg font-semibold" style="color: {TEXT_100};">{chatSummary.name}</h2>
						{#if metadata}
							<span class="chat-role-badge">{metadata.institution.role}</span>
						{/if}
					</div>
					<span class="text-sm" style="color: {TEXT_400};">Último mensaje: {chatSummary.time}</span>
				</div>
			</div>
			<div class="flex items-center gap-3">
				{#if metadata}
					<span
						class="hidden text-sm font-medium text-white/70 md:inline-flex md:items-center md:gap-2"
					>
						<Users class="h-4 w-4" aria-hidden="true" />
						{participantCount} integrantes
					</span>
				{/if}
				<button
					class="details-toggle"
					type="button"
					on:click={handleDetailsToggle}
					aria-expanded={metadata ? detailsOpen : false}
					aria-controls={panelId}
					disabled={!metadata}
				>
					<Info class="h-4 w-4" aria-hidden="true" />
					<span>Detalles del chat</span>
				</button>
			</div>
		</header>

		<div class="chat-body">
			<div class="chat-main">
				<div class="conversation" bind:this={conversationContainer} role="list">
					{#if !hasMessages}
						<p class="empty-conversation">No hay mensajes registrados para este chat aún.</p>
					{:else}
						{#each conversationMessages as message (message.id)}
							<div
								class="message-row"
								class:message-row--outgoing={message.direction === 'outgoing'}
								role="listitem"
							>
								<div class="message-avatar" aria-hidden="true">
									<img
										src={resolveAvatar(message)}
										alt={`Avatar de ${message.author}`}
										loading="lazy"
									/>
								</div>
								<article
									class="message-item"
									class:message-item--outgoing={message.direction === 'outgoing'}
									class:message-item--incoming={message.direction === 'incoming'}
									data-role={message.role}
								>
									<header class="message-meta">
										<div class="message-identity">
											<div class="message-identity__header">
												<span class="message-author">{message.author}</span>
												<span class="message-role" data-role={message.role}>{message.role}</span>
											</div>
											{#if message.organization}
												<span class="message-organization">{message.organization}</span>
											{/if}
										</div>
									</header>
									<p class="message-content">{message.content}</p>
									<footer class="message-footer">
										<time class="message-timestamp" datetime={message.sentAt}>
											{formatTimestamp(message.sentAt)}
										</time>
									</footer>
								</article>
							</div>
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
		</div>
	</section>
{/if}

<style>
	.chat-wrapper {
		min-height: clamp(480px, 68vh, 640px);
	}

	.chat-summary-avatar {
		position: relative;
		display: inline-flex;
		height: 3rem;
		width: 3rem;
		overflow: hidden;
		border-radius: 9999px;
		border: 2px solid rgba(255, 255, 255, 0.18);
		box-shadow: 0 8px 18px rgba(0, 0, 0, 0.32);
	}

	.chat-summary-avatar img {
		height: 100%;
		width: 100%;
		object-fit: cover;
	}

	.chat-role-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.1rem 0.45rem;
		border-radius: 9999px;
		background: rgba(15, 154, 255, 0.18);
		border: 1px solid rgba(15, 154, 255, 0.35);
		font-size: 0.62rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--bubble-text);
	}

	.details-toggle {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.55rem 1rem;
		border-radius: 9999px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(13, 20, 48, 0.6);
		color: var(--bubble-text);
		font-size: 0.85rem;
		font-weight: 600;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			border-color 0.2s ease;
	}

	.details-toggle:hover:not(:disabled) {
		transform: translateY(-1px);
		border-color: rgba(255, 255, 255, 0.24);
		box-shadow: 0 10px 24px rgba(11, 152, 250, 0.2);
	}

	.details-toggle:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.chat-body {
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
		padding: 1.5rem;
	}

	.chat-main {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		flex: 1;
		min-height: 0;
	}

	.conversation {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		padding: 0.5rem;
		max-height: clamp(320px, 52vh, 520px);
		overflow-y: auto;
		scrollbar-width: thin;
	}

	.conversation::-webkit-scrollbar {
		width: 6px;
	}

	.conversation::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.18);
		border-radius: 9999px;
	}

	.empty-conversation {
		align-self: center;
		padding: 0.75rem 1rem;
		border-radius: 1rem;
		background: rgba(8, 12, 34, 0.6);
		color: var(--bubble-muted);
		font-size: 0.9rem;
		text-align: center;
	}

	.message-row {
		display: flex;
		align-items: flex-start;
		gap: 0.9rem;
	}

	.message-row--outgoing {
		flex-direction: row-reverse;
	}

	.message-avatar {
		position: relative;
		height: 2.5rem;
		width: 2.5rem;
		border-radius: 9999px;
		overflow: hidden;
		border: 2px solid rgba(255, 255, 255, 0.16);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.28);
	}

	.message-avatar img {
		height: 100%;
		width: 100%;
		object-fit: cover;
	}

	.message-item {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		max-width: min(80%, 520px);
		padding: 0.95rem 1.15rem;
		border-radius: 20px;
		background: linear-gradient(180deg, rgba(18, 26, 63, 0.75), rgba(18, 26, 63, 0.92));
		border: 1px solid rgba(255, 255, 255, 0.08);
		color: var(--bubble-text);
	}

	.message-item--outgoing {
		background: linear-gradient(180deg, rgba(11, 152, 250, 0.85), rgba(11, 152, 250, 0.75));
		border-color: rgba(11, 152, 250, 0.45);
		color: #041021;
	}

	.message-meta {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.message-item--outgoing .message-meta {
		align-items: flex-end;
	}

	.message-identity {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		width: 100%;
	}

	.message-identity__header {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		flex-wrap: wrap;
	}

	.message-item--outgoing .message-identity__header {
		justify-content: flex-end;
	}

	.message-author {
		font-weight: 600;
		font-size: 0.95rem;
	}

	.message-organization {
		font-size: 0.8rem;
		color: var(--bubble-muted);
	}

	.message-item--outgoing .message-organization {
		color: rgba(4, 16, 33, 0.7);
		text-align: right;
	}

	.message-role {
		padding: 0.08rem 0.45rem;
		border-radius: 9999px;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.message-footer {
		display: flex;
		justify-content: flex-end;
	}

	.message-role[data-role='Colaborador'] {
		background: rgba(56, 189, 248, 0.2);
		color: rgba(186, 230, 253, 1);
		border: 1px solid rgba(56, 189, 248, 0.45);
	}

	.message-role[data-role='Institución'] {
		background: rgba(34, 211, 238, 0.25);
		color: rgba(224, 242, 254, 1);
		border: 1px solid rgba(20, 184, 166, 0.4);
	}

	.message-item--outgoing .message-role[data-role='Institución'] {
		color: #041021;
	}

	.message-timestamp {
		font-size: 0.78rem;
		color: var(--bubble-meta);
	}

	.message-item--outgoing .message-timestamp {
		color: rgba(4, 16, 33, 0.65);
	}

	.message-content {
		font-size: 0.98rem;
		line-height: 1.65;
		white-space: pre-wrap;
	}

	.message-form {
		margin-top: auto;
	}

	.message-input {
		display: flex;
		gap: 1rem;
		align-items: flex-end;
		padding: 0.85rem;
		border-radius: 18px;
		background: rgba(12, 19, 47, 0.75);
		border: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
	}

	.message-textarea {
		flex: 1;
		resize: none;
		background: transparent;
		border: none;
		outline: none;
		color: var(--bubble-text);
		font-size: 0.95rem;
		line-height: 1.5;
	}

	.message-textarea::placeholder {
		color: var(--bubble-muted);
	}

	.send-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.75rem;
		height: 2.75rem;
		border-radius: 9999px;
		border: none;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.send-button:hover {
		transform: translateY(-1px);
		box-shadow: 0 12px 28px rgba(11, 152, 250, 0.45);
	}

	.send-button:active {
		transform: scale(0.96);
	}

	@media (max-width: 640px) {
		.chat-body {
			padding: 1.25rem;
			gap: 1.25rem;
		}

		.conversation {
			max-height: none;
		}

		.message-item {
			max-width: 100%;
		}

		.message-meta {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.35rem;
		}

		.message-item--outgoing .message-meta {
			align-items: flex-end;
		}

		.message-footer {
			justify-content: flex-start;
		}
	}
</style>
