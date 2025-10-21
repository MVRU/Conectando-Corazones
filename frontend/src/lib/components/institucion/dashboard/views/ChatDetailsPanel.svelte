<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import {
		CalendarDays,
		CheckCircle2,
		Circle,
		FileText,
		Image,
		Loader2,
		MapPin,
		Users,
		X
	} from 'lucide-svelte';

	import type {
		AttachmentFormat,
		ChatAttachment,
		ChatMetadata,
		ChatObjective,
		ChatParticipant,
		ObjectiveStatus
	} from '../types';
	import { TEXT_100, TEXT_300, TEXT_400 } from '../tokens';
	import {
		buildRelationTooltip,
		isAiGeneratedEvidence,
		resolveEvidenceFlowLabel,
		resolveEvidenceFlowVariant,
		resolveRelatedEvidenceNames
	} from '../utils/evidence';

	const PANEL_ID = 'chat-details-panel';
	const GENERIC_AVATAR = '/users/avatar-generico.svg';

	const EVIDENCE_ICON_BY_EXTENSION: Record<AttachmentFormat, string> = {
		pdf: '/img/pdf-portada.svg',
		jpg: '/img/jpg-portada.svg',
		jpeg: '/img/jpg-portada.svg',
		png: '/img/file-evidence-image.svg',
		webp: '/img/file-evidence-image.svg',
		docx: '/img/file-evidence-doc.svg',
		xlsx: '/img/file-evidence-doc.svg',
		zip: '/img/zip-portada.svg'
	};

	const DEFAULT_EVIDENCE_ICON = '/img/file-evidence-doc.svg';

	const attachmentFormatter = new Intl.DateTimeFormat('es-CO', {
		dateStyle: 'medium'
	});

	const dispatch = createEventDispatcher<{ close: void }>();

	type StatusVisual = {
		label: string;
		icon: typeof CheckCircle2;
		iconClass: string;
		badgeClass: string;
	};

	const OBJECTIVE_STATUS_META: Record<ObjectiveStatus, StatusVisual> = {
		completed: {
			label: 'Completado',
			icon: CheckCircle2,
			iconClass: 'objective-icon--completed',
			badgeClass: 'objective-status--completed'
		},
		in_progress: {
			label: 'En progreso',
			icon: Loader2,
			iconClass: 'objective-icon--progress',
			badgeClass: 'objective-status--progress'
		},
		pending: {
			label: 'No iniciado',
			icon: Circle,
			iconClass: 'objective-icon--pending',
			badgeClass: 'objective-status--pending'
		}
	};

	function resolveObjectiveStatusMeta(status: ObjectiveStatus | undefined): StatusVisual {
		return OBJECTIVE_STATUS_META[status ?? 'pending'];
	}

	function formatResourceType(type: string): string {
		const normalized = type.trim().toLowerCase();
		const labels: Record<string, string> = {
			monetaria: 'Donación monetaria',
			'en especie': 'Donación en especie',
			voluntariado: 'Voluntariado'
		};
		return labels[normalized] ?? type;
	}

	function resolveEvidenceUploader(attachment: ChatAttachment): string {
		const uploader = attachment.uploadedBy?.trim();
		return uploader && uploader.length > 0 ? uploader : 'Autor no registrado';
	}

	export let metadata: ChatMetadata | null = null;
	export let open = false;

	let projectInfo: ChatMetadata['project'] | null = null;
	let objectiveItems: ChatObjective[] = [];

	$: galleryAttachments = metadata
		? metadata.attachments.filter((item) => item.category === 'galeria')
		: [];
	$: evidenceAttachments = metadata
		? metadata.attachments.filter((item) => item.category === 'evidencia')
		: [];
	$: participantCount = metadata ? 1 + (metadata.collaborators?.length ?? 0) : 0;
	$: participantEntries = metadata ? [metadata.institution, ...metadata.collaborators] : [];
	$: projectInfo = metadata?.project ?? null;
	$: objectiveItems = projectInfo?.objectives ?? [];
	$: evidenceArchiveUrl = projectInfo?.evidenceArchiveUrl ?? null;
	$: hasEvidenceArchive = Boolean(evidenceArchiveUrl);
	$: hasEvidence = evidenceAttachments.length > 0;
	$: closureSuffix = projectInfo
		? `faltan ${projectInfo.remainingDays} día${projectInfo.remainingDays === 1 ? '' : 's'}`
		: '';

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
		return EVIDENCE_ICON_BY_EXTENSION[attachment.fileExtension] ?? DEFAULT_EVIDENCE_ICON;
	}

	function resolveRelationTooltip(attachment: ChatAttachment): string | null {
		return buildRelationTooltip(attachment, evidenceAttachments);
	}

	function resolveRelationLabel(attachment: ChatAttachment): string | null {
		const names = resolveRelatedEvidenceNames(attachment, evidenceAttachments);
		if (names.length === 0) return null;
		return names.join(' · ');
	}

	function resolveObjectiveSponsors(objective: ChatObjective): string[] {
		return objective.sponsors.map((sponsor) => sponsor.trim()).filter(Boolean);
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

			{#if projectInfo}
				<div class="panel-section panel-section--project">
					<div class="panel-section__header">
						<h3>Proyecto "{projectInfo.name}"</h3>
					</div>
					<div class="project-meta" role="list">
						<div class="project-meta__item" role="listitem">
							<MapPin class="h-5 w-5" aria-hidden="true" />
							<div>
								<p class="project-meta__label">Lugar</p>
								<p class="project-meta__value">{projectInfo.location}</p>
							</div>
						</div>
						<div class="project-meta__item" role="listitem">
							<CalendarDays class="h-5 w-5" aria-hidden="true" />
							<div>
								<p class="project-meta__label">Cierre tentativo</p>
								<p class="project-meta__value">
									{projectInfo.tentativeClosure}
									{#if closureSuffix}
										<span class="project-meta__hint">({closureSuffix})</span>
									{/if}
								</p>
							</div>
						</div>
					</div>
					<div class="project-team">
						<div class="project-team__header">
							<Users class="h-5 w-5" aria-hidden="true" />
							<h4>Integrantes ({participantCount})</h4>
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
					<div class="project-objectives">
						<h4>Objetivos</h4>
						<ul class="objective-list" role="list">
							{#each objectiveItems as objective (objective.id)}
								{@const statusMeta = resolveObjectiveStatusMeta(objective.status)}
								{@const sponsors = resolveObjectiveSponsors(objective)}
								<li class="objective-row" data-status={objective.status}>
									<span class={`objective-icon ${statusMeta.iconClass}`} aria-hidden="true">
										<svelte:component
											this={statusMeta.icon}
											class="objective-icon__svg"
											aria-hidden="true"
										/>
									</span>
									<div class="objective-content">
										<div class="objective-header">
											<p class="objective-label">{objective.progressLabel}</p>
										</div>
										<p class="objective-details">
											<span class="panel-card__meta">
												{formatResourceType(objective.resourceType)}
												{#if sponsors.length > 0}
													· {sponsors.join(', ')}
												{/if}
											</span>
										</p>
									</div>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			{/if}

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
							</div>
						</li>
					{:else}
						<li class="panel-empty">Sin archivos de galería cargados.</li>
					{/each}
				</ul>
			</div>

			<div class="panel-section panel-section--evidence">
				<div class="panel-section__header">
					<FileText class="h-5 w-5" aria-hidden="true" />
					<h3>Evidencias</h3>
				</div>
				{#if hasEvidenceArchive}
					<a
						class="evidence-download-all"
						href={evidenceArchiveUrl ?? '#'}
						rel={evidenceArchiveUrl ? 'noopener noreferrer' : undefined}
						download={evidenceArchiveUrl ? '' : undefined}
						aria-label="Descargar todas las evidencias"
						aria-disabled={!hasEvidence}
					>
						Descargar evidencias
					</a>
				{/if}
				<ul class="evidence-list" role="list">
					{#if hasEvidence}
						{#each evidenceAttachments as file (file.id)}
							{@const evidenceFlowLabel = resolveEvidenceFlowLabel(file.evidenceFlow)}
							{@const evidenceFlowVariant = resolveEvidenceFlowVariant(file.evidenceFlow)}
							{@const relationTooltip = resolveRelationTooltip(file)}
							{@const relationLabel = resolveRelationLabel(file)}
							<li
								class="evidence-item"
								class:evidence-item--ai={isAiGeneratedEvidence(file)}
								data-flow={file.evidenceFlow}
							>
								<div class="evidence-icon" aria-hidden="true">
									<img
										src={resolveAttachmentPreview(file)}
										alt={`Icono de ${file.fileExtension.toUpperCase()}`}
										loading="lazy"
									/>
								</div>
								<div class="evidence-info">
									<div class="evidence-title-row">
										<span class="evidence-name">{file.name}</span>
									</div>
									<div class="evidence-meta" aria-label="Metadatos de la evidencia">
										{#if evidenceFlowLabel}
											{@const flowClass = evidenceFlowVariant
												? `evidence-chip--${evidenceFlowVariant}`
												: 'evidence-chip--neutral'}
											<span class={`evidence-chip ${flowClass}`}>{evidenceFlowLabel}</span>
											<span class="panel-card__meta">{resolveEvidenceUploader(file)}</span>
										{/if}
									</div>
									<!-- <p class="evidence-description">{file.description}</p>
									<span class="evidence-date"
										>Actualizado {formatAttachmentDate(file.uploadedAt)}</span
									> -->
								</div>
							</li>
						{/each}
					{:else}
						<li class="panel-empty">Sin evidencias registradas hasta el momento.</li>
					{/if}
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
		-ms-overflow-style: none;
		scrollbar-width: none;
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

	.chat-panel::-webkit-scrollbar {
		display: none;
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

	.panel-section--project {
		gap: 1.5rem;
	}

	.project-meta {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	.project-meta__item {
		display: flex;
		gap: 0.75rem;
		align-items: flex-start;
		border-radius: 16px;
		padding: 0.75rem 0.95rem;
		background: rgba(14, 20, 48, 0.75);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.project-meta__label {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--panel-muted);
	}

	.project-meta__value {
		font-size: 0.88rem;
		color: var(--panel-text);
		line-height: 1.45;
	}

	.project-meta__hint {
		margin-left: 0.35rem;
		color: var(--panel-muted);
		font-size: 0.75rem;
	}

	.project-objectives {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.project-objectives h4 {
		font-size: 0.95rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--panel-text);
	}

	.objective-list {
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
	}

	.objective-row {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		border-radius: 14px;
		background: rgba(12, 18, 42, 0.6);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-left: 3px solid rgba(148, 163, 184, 0.35);
	}

	.objective-row[data-status='completed'] {
		border-left-color: rgba(34, 197, 94, 0.7);
	}

	.objective-row[data-status='in_progress'] {
		border-left-color: rgba(250, 204, 21, 0.7);
	}

	.objective-row[data-status='pending'] {
		border-left-color: rgba(148, 163, 184, 0.5);
	}

	.objective-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.25rem;
		height: 1.25rem;
		margin-top: 0.1rem;
	}

	.objective-icon__svg {
		width: 100%;
		height: 100%;
	}

	.objective-icon--completed {
		color: rgba(134, 239, 172, 0.95);
	}

	.objective-icon--progress {
		color: rgba(253, 224, 71, 0.9);
	}

	.objective-icon--pending {
		color: rgba(148, 163, 184, 0.85);
	}

	.objective-icon--progress .objective-icon__svg {
		animation: objective-spin 1.6s linear infinite;
	}

	.objective-content {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
	}

	.objective-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.65rem;
	}

	.objective-label {
		font-size: 0.88rem;
		font-weight: 600;
		color: var(--panel-text);
	}

	.objective-status {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.18rem 0.6rem;
		border-radius: 9999px;
		font-size: 0.7rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.objective-status--completed {
		background: rgba(22, 163, 74, 0.18);
		color: rgba(187, 247, 208, 0.95);
	}

	.objective-status--progress {
		background: rgba(250, 204, 21, 0.18);
		color: rgba(254, 249, 195, 0.95);
	}

	.objective-status--pending {
		background: rgba(148, 163, 184, 0.18);
		color: rgba(226, 232, 240, 0.85);
	}

	.objective-details {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.objective-meta {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.72rem;
		color: var(--panel-muted);
		padding: 0.15rem 0.45rem;
		border-radius: 9999px;
		background: rgba(148, 163, 184, 0.12);
	}

	.objective-meta--type {
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: rgba(191, 219, 254, 0.95);
		background: rgba(59, 130, 246, 0.18);
	}

	.objective-meta--sponsor {
		background: rgba(45, 212, 191, 0.14);
		color: rgba(167, 243, 208, 0.95);
	}

	.project-team {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.project-team__header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.project-team__header h4 {
		font-size: 0.92rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--panel-text);
	}

	.panel-section--evidence {
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
	}

	.evidence-download-all {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		width: fit-content;
		padding: 0.4rem 0.85rem;
		border-radius: 9999px;
		border: 1px solid rgba(148, 163, 184, 0.35);
		background: rgba(19, 27, 54, 0.65);
		color: var(--panel-text);
		font-size: 0.78rem;
		font-weight: 600;
		text-decoration: none;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			border-color 0.2s ease;
	}

	.evidence-download-all:hover:not([aria-disabled='true']) {
		transform: translateY(-1px);
		border-color: rgba(96, 165, 250, 0.5);
		box-shadow: 0 12px 26px rgba(96, 165, 250, 0.25);
	}

	.evidence-download-all[aria-disabled='true'] {
		opacity: 0.5;
		pointer-events: none;
	}

	.evidence-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.evidence-item {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: stretch;
		gap: 0.75rem;
		padding: 0.75rem 0.95rem;
		border-radius: 16px;
		background: rgba(9, 13, 38, 0.65);
		border: 1px solid rgba(255, 255, 255, 0.08);
		position: relative;
		overflow: hidden;
	}

	.evidence-item::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.3s ease;
		background: radial-gradient(circle at top left, rgba(59, 130, 246, 0.22), transparent 55%);
	}

	.evidence-item--ai {
		border-color: rgba(168, 85, 247, 0.6);
		background: linear-gradient(140deg, rgba(76, 29, 149, 0.55), rgba(17, 24, 39, 0.8));
		box-shadow: 0 0 22px rgba(168, 85, 247, 0.25);
	}

	.evidence-item--ai::after {
		opacity: 1;
		background: radial-gradient(circle at top right, rgba(244, 114, 182, 0.35), transparent 60%);
		animation: shimmer 3.5s ease-in-out infinite;
		will-change: transform, opacity;
	}

	.evidence-icon {
		width: 52px;
		height: 52px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 14px;
		background: rgba(15, 23, 55, 0.75);
		border: 1px solid rgba(255, 255, 255, 0.12);
	}

	.evidence-icon img {
		width: 30px;
		height: 30px;
		object-fit: contain;
	}

	.evidence-info {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.evidence-title-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.evidence-name {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--panel-text);
		line-height: 1.35;
	}

	.evidence-meta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.evidence-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.18rem 0.55rem;
		border-radius: 9999px;
		font-size: 0.72rem;
		font-weight: 500;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		background: rgba(148, 163, 184, 0.12);
		color: rgba(226, 232, 240, 0.85);
	}

	.evidence-chip--entrada {
		background: rgba(34, 197, 94, 0.18);
		color: rgba(187, 247, 208, 0.95);
	}

	.evidence-chip--salida {
		background: rgba(239, 68, 68, 0.18);
		color: rgba(254, 202, 202, 0.95);
	}

	.evidence-chip--neutral {
		background: rgba(148, 163, 184, 0.14);
		color: rgba(226, 232, 240, 0.8);
	}

	.evidence-chip--uploader {
		background: rgba(59, 130, 246, 0.14);
		color: rgba(191, 219, 254, 0.95);
		text-transform: none;
		letter-spacing: 0;
	}

	.evidence-relations {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin-top: 0.25rem;
		padding: 0.25rem 0.55rem;
		border-radius: 12px;
		font-size: 0.72rem;
		color: rgba(191, 219, 254, 0.85);
		background: rgba(148, 163, 184, 0.1);
	}

	.evidence-relations__icon {
		font-size: 0.85rem;
	}

	.evidence-relations__label {
		line-height: 1.2;
	}

	/* .evidence-description {
		font-size: 0.74rem;
		color: rgba(203, 213, 225, 0.95);
		line-height: 1.45;
	}

	.evidence-date {
		font-size: 0.68rem;
		color: rgba(148, 163, 184, 0.9);
	} */

	.panel-section + .panel-section {
		border-top: 1px solid rgba(255, 255, 255, 0.08);
		padding-top: 1.25rem;
	}

	.panel-section--project {
		gap: 1.5rem;
	}

	.project-meta {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	.project-meta__item {
		display: flex;
		gap: 0.75rem;
		align-items: flex-start;
		border-radius: 16px;
		padding: 0.75rem 0.95rem;
		background: rgba(14, 20, 48, 0.75);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.project-meta__label {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--panel-muted);
	}

	.project-meta__value {
		font-size: 0.88rem;
		color: var(--panel-text);
		line-height: 1.45;
	}

	.project-meta__hint {
		margin-left: 0.35rem;
		color: var(--panel-muted);
		font-size: 0.75rem;
	}

	.project-objectives {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.project-objectives h4 {
		font-size: 0.95rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--panel-text);
	}

	.project-objectives ul {
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
	}

	.panel-section + .panel-section {
		border-top: 1px solid rgba(255, 255, 255, 0.08);
		padding-top: 1.25rem;
	}

	.panel-section--project {
		gap: 1.5rem;
	}

	.project-meta {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	.project-meta__item {
		display: flex;
		gap: 0.75rem;
		align-items: flex-start;
		border-radius: 16px;
		padding: 0.75rem 0.95rem;
		background: rgba(14, 20, 48, 0.75);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.project-meta__label {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--panel-muted);
	}

	.project-meta__value {
		font-size: 0.88rem;
		color: var(--panel-text);
		line-height: 1.45;
	}

	.project-meta__hint {
		margin-left: 0.35rem;
		color: var(--panel-muted);
		font-size: 0.75rem;
	}

	.project-objectives {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.project-objectives h4 {
		font-size: 0.95rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--panel-text);
	}

	.project-objectives ul {
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
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

	@keyframes objective-spin {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
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

	@keyframes shimmer {
		0% {
			opacity: 0.7;
			transform: scale(0.98);
		}

		50% {
			opacity: 1;
			transform: scale(1.02);
		}

		100% {
			opacity: 0.7;
			transform: scale(0.98);
		}
	}

	@media (min-width: 1024px) {
		.panel-layer {
			inset: 40px 40px 40px auto;
			pointer-events: auto;
			grid-template-columns: auto;
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
	}
</style>
