<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { FileText, Image, Users, X } from 'lucide-svelte';

	import type { AttachmentFormat, ChatAttachment, ChatMetadata, ChatParticipant } from '../types';
	import { TEXT_100, TEXT_300, TEXT_400 } from '../tokens';

	const PANEL_ID = 'chat-details-panel';
	const GENERIC_AVATAR = '/users/avatar-generico.svg';

	const EVIDENCE_ICON_BY_EXTENSION: Record<AttachmentFormat, string> = {
		pdf: '/img/pdf-portada.svg',
		jpg: '/img/jpg-portada.svg',
		jpeg: '/img/jpg-portada.svg',
		png: '/img/file-evidence-image.svg',
		webp: '/img/file-evidence-image.svg',
		docx: '/img/file-evidence-doc.svg',
		xlsx: '/img/file-evidence-doc.svg'
	};

	const attachmentFormatter = new Intl.DateTimeFormat('es-CO', {
		dateStyle: 'medium'
	});

	const dispatch = createEventDispatcher<{ close: void }>();

	export let metadata: ChatMetadata | null = null;
	export let open = false;

	$: galleryAttachments = metadata
		? metadata.attachments.filter((item) => item.category === 'galeria')
		: [];
	$: evidenceAttachments = metadata
		? metadata.attachments.filter((item) => item.category === 'evidencia')
		: [];
	$: participantCount = metadata ? 1 + (metadata.collaborators?.length ?? 0) : 0;
	$: participantEntries = metadata ? [metadata.institution, ...metadata.collaborators] : [];

	function formatAttachmentDate(isoDate: string): string {
		try {
			return attachmentFormatter.format(new Date(isoDate));
		} catch (error) {
			return isoDate;
		}
	}

	function resolveParticipantAvatar(participant: ChatParticipant): string {
		return participant.avatar ?? GENERIC_AVATAR;
	}

	function resolveAttachmentPreview(attachment: ChatAttachment): string {
		if (attachment.previewImage) return attachment.previewImage;
		if (attachment.category === 'galeria') return '/img/prueba.png';
		return EVIDENCE_ICON_BY_EXTENSION[attachment.fileExtension];
	}

	function resolveEvidenceBadge(attachment: ChatAttachment): string {
		const formatLabel = attachment.fileExtension.toUpperCase();
		if (attachment.evidenceFlow === 'entrada') return `${formatLabel} · Entrada`;
		if (attachment.evidenceFlow === 'salida') return `${formatLabel} · Salida`;
		return formatLabel;
	}

	function handleClose() {
		dispatch('close');
	}
</script>

{#if metadata && open}
	<div class="panel-layer">
		<button
			type="button"
			class="panel-overlay"
			on:click={handleClose}
			aria-hidden="true"
			tabindex="-1"
			title="Cerrar detalles del chat"
		></button>
		<aside
			id={PANEL_ID}
			class="chat-panel"
			aria-label="Información del chat"
			aria-hidden="false"
			style={`color: ${TEXT_100}; --panel-text:${TEXT_100}; --panel-muted:${TEXT_300}; --panel-soft:${TEXT_400};`}
		>
			<header class="panel-header">
				<div class="panel-title">
					<span>Detalles del chat</span>
					<span class="panel-subtitle">{participantCount} participantes</span>
				</div>
				<button
					type="button"
					class="close-button"
					on:click={handleClose}
					aria-label="Cerrar panel de detalles"
				>
					<X class="h-4 w-4" aria-hidden="true" />
				</button>
			</header>

			<div class="panel-section">
				<div class="panel-section__header">
					<Users class="h-5 w-5" aria-hidden="true" />
					<h3>Integrantes</h3>
				</div>
				<ul class="panel-members" role="list">
					{#each participantEntries as participant (participant.id)}
						<li class="panel-member">
							<img
								class="panel-member__avatar"
								src={resolveParticipantAvatar(participant)}
								alt={`Avatar de ${participant.name}`}
								loading="lazy"
							/>
							<div class="panel-member__identity">
								<span class="panel-member__name">{participant.name}</span>
								<span class="panel-member__badge" data-role={participant.role}
									>{participant.role}</span
								>
							</div>
						</li>
					{/each}
				</ul>
			</div>

			<div class="panel-section">
				<div class="panel-section__header">
					<Image class="h-5 w-5" aria-hidden="true" />
					<h3>Galería</h3>
				</div>
				<ul class="panel-list" role="list">
					{#each galleryAttachments as file (file.id)}
						<li class="panel-card panel-card--gallery">
							<figure class="panel-media" aria-hidden="true">
								<img
									src={resolveAttachmentPreview(file)}
									alt={`Vista previa de ${file.name}`}
									loading="lazy"
								/>
							</figure>
							<div class="panel-card__body">
								<p class="panel-card__title">{file.name}</p>
								<p class="panel-card__meta">{file.description}</p>
								<p class="panel-card__date">Actualizado {formatAttachmentDate(file.uploadedAt)}</p>
							</div>
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
						<li class="panel-card panel-card--evidence">
							<div class="panel-evidence" aria-hidden="true">
								<img
									src={resolveAttachmentPreview(file)}
									alt={`Portada de ${file.name}`}
									loading="lazy"
								/>
							</div>
							<div class="panel-card__body">
								<div class="panel-card__headline">
									<p class="panel-card__title">{file.name}</p>
									<span
										class="panel-evidence__badge"
										data-flow={file.evidenceFlow}
										data-format={file.fileExtension}
									>
										{resolveEvidenceBadge(file)}
									</span>
								</div>
								<p class="panel-card__meta">{file.description}</p>
								<p class="panel-card__date">Actualizado {formatAttachmentDate(file.uploadedAt)}</p>
							</div>
						</li>
					{:else}
						<li class="panel-empty">Sin evidencias registradas hasta el momento.</li>
					{/each}
				</ul>
			</div>
		</aside>
	</div>
{/if}

<style>
	.panel-layer {
		position: fixed;
		inset: 0;
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: stretch;
		z-index: 60;
		pointer-events: auto;
	}

	.panel-overlay {
		width: 100%;
		height: 100%;
		border: none;
		background: rgba(5, 10, 35, 0.55);
		opacity: 1;
	}

	.chat-panel {
		width: min(420px, 92vw);
		height: 100%;
		max-height: 100vh;
		overflow-y: auto;
		border-radius: 0;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background: linear-gradient(160deg, rgba(15, 23, 55, 0.92), rgba(9, 13, 38, 0.97));
		box-shadow: -12px 0 40px rgba(0, 0, 0, 0.45);
		padding: 1.35rem;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		animation: slide-in 0.25s ease forwards;
	}

	.panel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.panel-title {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.panel-title span:first-child {
		font-size: 1.05rem;
		font-weight: 700;
	}

	.panel-subtitle {
		font-size: 0.8rem;
		color: var(--panel-muted);
	}

	.close-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border-radius: 9999px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(7, 12, 32, 0.75);
		color: var(--panel-text);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.close-button:hover {
		transform: translateY(-1px);
		box-shadow: 0 12px 24px rgba(11, 152, 250, 0.35);
	}

	.panel-section {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.panel-section + .panel-section {
		border-top: 1px solid rgba(255, 255, 255, 0.08);
		padding-top: 1.25rem;
	}

	.panel-section__header {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		font-size: 0.95rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--panel-text);
	}

	.panel-members {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.panel-member {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		padding: 0.55rem 0.75rem;
		border-radius: 16px;
		background: rgba(12, 18, 45, 0.7);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.panel-member__avatar {
		height: 2.35rem;
		width: 2.35rem;
		border-radius: 9999px;
		object-fit: cover;
		border: 2px solid rgba(255, 255, 255, 0.16);
	}

	.panel-member__identity {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		flex-wrap: wrap;
	}

	.panel-member__name {
		font-weight: 600;
		color: var(--panel-text);
	}

	.panel-member__badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.1rem 0.4rem;
		border-radius: 9999px;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.panel-member__badge[data-role='Institución'] {
		background: rgba(16, 185, 129, 0.2);
		border: 1px solid rgba(16, 185, 129, 0.35);
		color: rgba(236, 253, 245, 0.9);
	}

	.panel-member__badge[data-role='Colaborador'] {
		background: rgba(59, 130, 246, 0.18);
		border: 1px solid rgba(59, 130, 246, 0.4);
		color: rgba(219, 234, 254, 0.95);
	}

	.panel-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.panel-card {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 0.75rem 0.95rem;
		border-radius: 16px;
		background: rgba(12, 18, 45, 0.7);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.panel-media {
		width: 72px;
		height: 72px;
		border-radius: 12px;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(7, 12, 32, 0.65);
		flex-shrink: 0;
	}

	.panel-media img {
		height: 100%;
		width: 100%;
		object-fit: cover;
	}

	.panel-card__body {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		flex: 1;
		min-width: 0;
	}

	.panel-card__headline {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.panel-card__title {
		font-weight: 600;
		color: var(--panel-text);
		flex: 1;
	}

	.panel-card__meta {
		color: var(--panel-soft);
		font-size: 0.85rem;
		line-height: 1.4;
	}

	.panel-card__date {
		color: var(--panel-muted);
		font-size: 0.78rem;
	}

	.panel-empty {
		padding: 0.75rem 1rem;
		border-radius: 16px;
		background: rgba(12, 18, 45, 0.5);
		color: var(--panel-muted);
		text-align: center;
		font-size: 0.9rem;
	}

	.panel-card--evidence {
		align-items: center;
	}

	.panel-card--evidence .panel-evidence {
		width: 54px;
		height: 60px;
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(7, 12, 32, 0.65);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.panel-card--evidence .panel-evidence img {
		width: 70%;
		height: auto;
	}

	.panel-evidence__badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.15rem 0.45rem;
		border-radius: 9999px;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: rgba(15, 23, 42, 0.95);
		background: rgba(241, 245, 249, 0.82);
		border: 1px solid rgba(148, 163, 184, 0.35);
		white-space: nowrap;
	}

	.panel-evidence__badge[data-flow='entrada'] {
		background: rgba(219, 234, 254, 0.88);
		color: #1d4ed8;
	}

	.panel-evidence__badge[data-flow='salida'] {
		background: rgba(222, 247, 236, 0.88);
		color: #0f766e;
	}

	@keyframes slide-in {
		from {
			transform: translateX(28px);
			opacity: 0;
		}

		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	@media (min-width: 1024px) {
		.panel-layer {
			inset: 40px 40px 40px auto;
			pointer-events: auto;
			grid-template-columns: auto;
		}

		.chat-panel {
			border-radius: 20px;
			height: auto;
			max-height: calc(100vh - 80px);
			margin-left: 1.25rem;
			box-shadow: -12px 24px 60px rgba(4, 10, 30, 0.55);
		}

		.panel-overlay {
			display: none;
		}
	}
</style>
