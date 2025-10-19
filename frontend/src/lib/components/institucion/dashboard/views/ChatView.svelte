<script lang="ts">
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import { FileText, Image, Info, Send, Users } from 'lucide-svelte';

	import { chatMetadata } from '../data';
	import type { ChatItem, ChatMessage, ChatMetadata, ChatThread } from '../types';
	import { BG_CARD, BORDER_SUBTLE, PRIMARY_500, TEXT_100, TEXT_300, TEXT_400 } from '../tokens';

	export let chatSummary: ChatItem | null = null;
	export let thread: ChatThread | null = null;

	let messageDraft = '';
	let conversationContainer: HTMLDivElement | null = null;
	let conversationMessages: ChatMessage[] = [];
	let lastThreadId: number | null = null;
	let metadata: ChatMetadata | null = null;
	let galleryAttachments: ChatMetadata['attachments'] = [];
	let evidenceAttachments: ChatMetadata['attachments'] = [];
	let isPanelOpen = false;

	const panelId = 'chat-details-panel';
	const desktopMediaQuery = '(min-width: 1024px)';
	let mediaList: MediaQueryList | null = null;
	let mediaListener: ((event: MediaQueryListEvent) => void) | null = null;
	let removeMediaListener: (() => void) | null = null;

	const messageFormatter = new Intl.DateTimeFormat('es-CO', {
		dateStyle: 'medium',
		timeStyle: 'short'
	});
	const attachmentFormatter = new Intl.DateTimeFormat('es-CO', {
		dateStyle: 'medium'
	});

	$: {
		const currentId = thread?.chatId ?? chatSummary?.id ?? null;
		if (currentId !== lastThreadId) {
			conversationMessages = thread ? [...thread.messages] : [];
			lastThreadId = currentId;
			metadata = currentId ? (chatMetadata[currentId] ?? null) : null;
			galleryAttachments = metadata
				? metadata.attachments.filter((item) => item.category === 'galeria')
				: [];
			evidenceAttachments = metadata
				? metadata.attachments.filter((item) => item.category === 'evidencia')
				: [];
		}
	}

	$: hasMessages = conversationMessages.length > 0;
	$: participantCount = metadata ? 1 /* institución */ + (metadata.collaborators?.length ?? 0) : 0;

	afterUpdate(() => {
		if (!conversationContainer) return;
		const lastMessage = conversationContainer.lastElementChild as HTMLElement | null;
		if (lastMessage) {
			lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
		}
	});

	onMount(() => {
		if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
		mediaList = window.matchMedia(desktopMediaQuery);
		isPanelOpen = mediaList.matches;

		mediaListener = (event: MediaQueryListEvent) => {
			isPanelOpen = event.matches;
		};

		if (!mediaList) return;

		if (typeof mediaList.addEventListener === 'function') {
			mediaList.addEventListener('change', mediaListener);
			removeMediaListener = () => mediaList?.removeEventListener('change', mediaListener!);
		} else if (typeof mediaList.addListener === 'function') {
			mediaList.addListener(mediaListener);
			removeMediaListener = () => mediaList?.removeListener(mediaListener!);
		}
	});

	onDestroy(() => {
		if (removeMediaListener) {
			removeMediaListener();
		}
	});

	function formatTimestamp(isoDate: string): string {
		try {
			return messageFormatter.format(new Date(isoDate));
		} catch (error) {
			return isoDate;
		}
	}

	function formatAttachmentDate(isoDate: string): string {
		try {
			return attachmentFormatter.format(new Date(isoDate));
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

	function getParticipantLabel(kind: ChatMetadata['institution']['kind']): string {
		switch (kind) {
			case 'empresa':
				return 'Empresa';
			case 'ong':
				return 'ONG';
			case 'voluntario':
				return 'Voluntariado';
			default:
				return 'Institución';
		}
	}

	function togglePanel() {
		if (!metadata) return;
		isPanelOpen = !isPanelOpen;
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
					on:click={togglePanel}
					aria-expanded={metadata ? isPanelOpen : false}
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

			{#if metadata}
				<aside
					id={panelId}
					class="chat-panel"
					hidden={!isPanelOpen}
					aria-hidden={!isPanelOpen}
					aria-label="Información del chat"
				>
					<div class="panel-section">
						<div class="panel-section__header">
							<Users class="h-5 w-5" aria-hidden="true" />
							<h3>Integrantes</h3>
						</div>
						<dl class="panel-list">
							<div class="panel-card">
								<dt>
									<span class="panel-chip">{getParticipantLabel(metadata.institution.kind)}</span>
									{metadata.institution.name}
								</dt>
								<dd>{metadata.institution.description}</dd>
								<dd class="panel-contact">{metadata.institution.contact}</dd>
							</div>
							{#each metadata.collaborators as participant (participant.id)}
								<div class="panel-card">
									<dt>
										<span class="panel-chip">{getParticipantLabel(participant.kind)}</span>
										{participant.name}
									</dt>
									<dd>{participant.description}</dd>
									<dd class="panel-contact">{participant.contact}</dd>
								</div>
							{/each}
						</dl>
					</div>

					<div class="panel-section">
						<div class="panel-section__header">
							<Image class="h-5 w-5" aria-hidden="true" />
							<h3>Galería</h3>
						</div>
						<ul class="panel-list" role="list">
							{#each galleryAttachments as file (file.id)}
								<li class="panel-card">
									<p class="panel-card__title">{file.name}</p>
									<p class="panel-card__meta">{file.description}</p>
									<p class="panel-card__date">
										Actualizado {formatAttachmentDate(file.uploadedAt)}
									</p>
								</li>
							{:else}
								<li class="panel-empty">Sin archivos de galería cargados.</li>
							{/each}
						</ul>
					</div>

					<div class="panel-section">
						<div class="panel-section__header">
							<FileText class="h-5 w-5" aria-hidden="true" />
							<h3>Evidencias</h3>
						</div>
						<ul class="panel-list" role="list">
							{#each evidenceAttachments as file (file.id)}
								<li class="panel-card">
									<p class="panel-card__title">{file.name}</p>
									<p class="panel-card__meta">{file.description}</p>
									<p class="panel-card__date">
										Actualizado {formatAttachmentDate(file.uploadedAt)}
									</p>
								</li>
							{:else}
								<li class="panel-empty">Sin evidencias registradas hasta el momento.</li>
							{/each}
						</ul>
					</div>
				</aside>
			{/if}
		</div>
	</section>
{/if}

<style>
	.chat-wrapper {
		min-height: clamp(480px, 68vh, 640px);
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
		gap: 1rem;
		padding-right: 0.75rem;
		max-height: clamp(280px, 48vh, 420px);
		overflow-y: auto;
		scrollbar-width: thin;
		flex: 1;
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

	.chat-panel {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		padding: 1.25rem;
		border-radius: 20px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background: linear-gradient(160deg, rgba(15, 23, 55, 0.85), rgba(9, 13, 38, 0.95));
		box-shadow: 0 16px 38px rgba(0, 0, 0, 0.32);
		max-height: clamp(280px, 48vh, 420px);
		overflow-y: auto;
		scrollbar-width: thin;
		min-height: 0;
	}

	.chat-panel::-webkit-scrollbar {
		width: 6px;
	}

	.chat-panel::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.18);
		border-radius: 9999px;
	}

	.panel-section {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.panel-section + .panel-section {
		border-top: 1px solid rgba(255, 255, 255, 0.06);
		padding-top: 1.25rem;
	}

	.panel-section__header {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--bubble-text);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.panel-section__header h3 {
		font-size: inherit;
		font-weight: inherit;
	}

	.panel-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.panel-card {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
		padding: 0.85rem 1rem;
		border-radius: 16px;
		background: rgba(12, 18, 45, 0.7);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.panel-card__title {
		font-weight: 600;
		color: var(--bubble-text);
	}

	.panel-card__meta,
	.panel-contact {
		color: var(--bubble-muted);
		font-size: 0.85rem;
		line-height: 1.4;
	}

	.panel-card__date {
		color: var(--bubble-meta);
		font-size: 0.78rem;
	}

	.panel-contact {
		font-weight: 600;
	}

	.panel-chip {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.15rem 0.55rem;
		margin-right: 0.5rem;
		border-radius: 9999px;
		background: rgba(11, 152, 250, 0.16);
		border: 1px solid rgba(11, 152, 250, 0.35);
		color: var(--bubble-text);
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.panel-empty {
		padding: 0.75rem 1rem;
		border-radius: 12px;
		background: rgba(8, 12, 34, 0.55);
		color: var(--bubble-muted);
		font-size: 0.85rem;
		text-align: center;
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

	@media (min-width: 768px) {
		.chat-body {
			padding: 1.75rem 2rem;
		}

		.conversation,
		.chat-panel {
			max-height: clamp(360px, 52vh, 520px);
		}
	}

	@media (min-width: 1024px) {
		.chat-body {
			flex-direction: row;
			align-items: stretch;
		}

		.conversation,
		.chat-panel {
			max-height: none;
		}

		.chat-panel {
			flex: 0 0 320px;
		}
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
