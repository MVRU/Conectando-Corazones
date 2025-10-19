<script lang="ts">
	import {
		adminObservations,
		institutionIdentity,
		profileHighlights,
		reportingStatus,
		verificationDocuments,
		verificationSummary
	} from '../data';
	import {
		BG_900,
		BG_CARD,
		BORDER_SUBTLE,
		GRADIENT_CTA,
		PRIMARY_300,
		PRIMARY_500,
		TEXT_100,
		TEXT_300,
		TEXT_400
	} from '../tokens';
	import type { DocumentStatus } from '../types';

	const hasObservations = adminObservations.length > 0;
	const observationBadgeStyles = hasObservations
		? 'bg-sky-500/20 text-sky-100 border border-sky-400/40'
		: 'bg-slate-500/20 text-slate-200 border border-slate-400/40';
	const reportBadgeStyles = reportingStatus.hasReports
		? 'bg-amber-500/20 text-amber-100 border border-amber-400/40'
		: 'bg-emerald-500/15 text-emerald-100 border border-emerald-500/30';
	const documentStatusVariants: Record<DocumentStatus, string> = {
		Aprobado: 'bg-emerald-500/15 text-emerald-100 border border-emerald-500/30',
		Pendiente: 'bg-amber-500/15 text-amber-100 border border-amber-500/30',
		Rechazado: 'bg-rose-500/15 text-rose-100 border border-rose-500/30'
	};
	const riskLevelLabels = {
		none: 'Sin riesgo',
		low: 'Riesgo bajo',
		medium: 'Riesgo medio',
		high: 'Riesgo alto'
	} as const;

	const reportIcon = reportingStatus.hasReports ? '⚠️' : '🛡️';
	const observationIcon = hasObservations ? '📝' : '✅';
	const riskLevelLabel = riskLevelLabels[reportingStatus.riskLevel];

	const legalRepresentative = institutionIdentity.legalRepresentative;

	const getDocumentStatusStyle = (status: DocumentStatus) => documentStatusVariants[status];
</script>

<section
	class="flex h-full min-h-[60vh] flex-col gap-10 rounded-[28px] p-10"
	style="background: {BG_CARD}; border: 1px solid {BORDER_SUBTLE}; box-shadow: 0 8px 28px rgba(0,0,0,0.22);"
>
	<h2
		class="border-b pb-4 text-4xl font-extrabold"
		style="color: {TEXT_100}; border-color: {BORDER_SUBTLE};"
	>
		Estado de verificación de la cuenta
	</h2>

	<div class="grid gap-8 lg:grid-cols-5">
		<article
			class="space-y-6 rounded-[22px] p-6 lg:col-span-3"
			style="background: {BG_900}; border: 2px solid {PRIMARY_500}; box-shadow: 0 0 20px {PRIMARY_500}30;"
			aria-labelledby="verification-summary-heading"
		>
			<header class="space-y-3" id="verification-summary-heading">
				<div class="flex flex-wrap items-center gap-4">
					<div
						class="flex h-14 w-14 items-center justify-center rounded-full"
						style="background: rgba(11, 152, 250, 0.18); color: {PRIMARY_300};"
						aria-hidden="true"
					>
						<svelte:component this={profileHighlights.verification.icon} class="h-7 w-7" />
					</div>
					<div class="space-y-1">
						<span
							class="inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-semibold uppercase tracking-wide"
							style="background: rgba(52, 211, 153, 0.18); color: #A7F3D0;"
						>
							✅ {verificationSummary.status}
						</span>
						<p class="text-lg font-semibold" style="color: {TEXT_100};">
							{verificationSummary.reliabilityLevel} confiabilidad institucional
						</p>
					</div>
				</div>
				<p class="text-base leading-relaxed" style="color: {TEXT_300};">
					{verificationSummary.description}
				</p>
			</header>

			<dl class="grid gap-4 sm:grid-cols-2" aria-label="Detalles de verificación">
				<div class="space-y-1">
					<dt class="text-xs font-semibold uppercase tracking-wide" style="color: {TEXT_400};">
						Método aplicado
					</dt>
					<dd class="text-base font-medium" style="color: {TEXT_100};">
						{verificationSummary.method}
					</dd>
				</div>
				<div class="space-y-1">
					<dt class="text-xs font-semibold uppercase tracking-wide" style="color: {TEXT_400};">
						Documentos revisados
					</dt>
					<dd class="text-base font-medium" style="color: {TEXT_100};">
						{verificationSummary.documentsReviewed}
					</dd>
				</div>
				<div class="space-y-1">
					<dt class="text-xs font-semibold uppercase tracking-wide" style="color: {TEXT_400};">
						Última revisión manual
					</dt>
					<dd class="text-base font-medium" style="color: {TEXT_100};">
						{verificationSummary.lastReview}
					</dd>
				</div>
				<div class="space-y-1">
					<dt class="text-xs font-semibold uppercase tracking-wide" style="color: {TEXT_400};">
						Próxima revisión estimada
					</dt>
					<dd class="text-base font-medium" style="color: {TEXT_100};">
						{verificationSummary.nextReview}
					</dd>
				</div>
				<div class="space-y-1 sm:col-span-2">
					<dt class="text-xs font-semibold uppercase tracking-wide" style="color: {TEXT_400};">
						Responsable de aprobación
					</dt>
					<dd class="text-base font-medium" style="color: {TEXT_100};">
						{verificationSummary.reviewer}
					</dd>
				</div>
			</dl>
		</article>

		<article
			class="space-y-5 rounded-[22px] p-6 lg:col-span-2"
			style="background: {BG_900}; border: 1px solid {BORDER_SUBTLE}; box-shadow: 0 4px 18px rgba(0,0,32,0.18);"
			aria-labelledby="identity-heading"
		>
			<h3 class="text-2xl font-bold" style="color: {PRIMARY_500};" id="identity-heading">
				Identidad legal y contacto
			</h3>
			<dl class="grid gap-4" aria-label="Datos de identidad">
				<div class="space-y-1">
					<dt class="text-sm font-semibold" style="color: {TEXT_400};">Institución</dt>
					<dd class="text-lg font-medium" style="color: {TEXT_100};">
						{institutionIdentity.name}
					</dd>
				</div>
				<div class="space-y-1">
					<dt class="text-sm font-semibold" style="color: {TEXT_400};">CUIT / Registro</dt>
					<dd class="text-lg font-medium" style="color: {TEXT_100};">
						{institutionIdentity.registrationId}
					</dd>
				</div>
				<div class="space-y-1">
					<dt class="text-sm font-semibold" style="color: {TEXT_400};">Sector</dt>
					<dd class="text-lg font-medium" style="color: {TEXT_100};">
						{institutionIdentity.sector}
					</dd>
				</div>
				<div class="space-y-1">
					<dt class="text-sm font-semibold" style="color: {TEXT_400};">Ubicación</dt>
					<dd class="text-lg font-medium" style="color: {TEXT_100};">
						{institutionIdentity.location}
					</dd>
				</div>
				<div class="space-y-1">
					<dt class="text-sm font-semibold" style="color: {TEXT_400};">Representante legal</dt>
					<dd class="text-lg font-medium" style="color: {TEXT_100};">
						{legalRepresentative.name} · {legalRepresentative.idType}
						{legalRepresentative.idNumber}
					</dd>
					<dd class="text-sm" style="color: {TEXT_300};">
						{legalRepresentative.email}
					</dd>
				</div>
				<div class="space-y-1">
					<dt class="text-sm font-semibold" style="color: {TEXT_400};">Teléfono de contacto</dt>
					<dd class="text-lg font-medium" style="color: {TEXT_100};">
						{institutionIdentity.contactPhone}
					</dd>
				</div>
				<div class="space-y-1">
					<dt class="text-sm font-semibold" style="color: {TEXT_400};">Sitio web</dt>
					<dd>
						<a
							class="text-lg font-medium underline decoration-dotted underline-offset-4 transition-colors hover:text-white"
							style="color: {TEXT_100};"
							href={institutionIdentity.website}
							rel="noopener noreferrer"
							target="_blank"
						>
							{institutionIdentity.website}
						</a>
					</dd>
				</div>
			</dl>
		</article>
	</div>

	<div class="grid gap-8 lg:grid-cols-5">
		<article
			class="space-y-5 rounded-[22px] p-6 lg:col-span-3"
			style="background: {BG_900}; border: 1px solid {BORDER_SUBTLE}; box-shadow: 0 4px 18px rgba(0,0,32,0.18);"
			aria-labelledby="observations-heading"
		>
			<header class="flex flex-wrap items-center justify-between gap-3" id="observations-heading">
				<h3 class="text-2xl font-bold" style="color: {TEXT_100};">
					Observaciones del equipo administrador
				</h3>
				<span
					class={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${observationBadgeStyles}`}
				>
					{observationIcon}
					{hasObservations ? 'Observaciones registradas' : 'Sin observaciones'}
				</span>
			</header>
			{#if hasObservations}
				<ul class="space-y-4" aria-label="Listado de observaciones">
					{#each adminObservations as observation}
						<li class="rounded-2xl border border-white/5 bg-white/5 p-4">
							<p class="text-base font-medium" style="color: {TEXT_100};">
								{observation.message}
							</p>
							<p class="text-sm" style="color: {TEXT_300};">
								Registrado el {observation.recordedAt}
							</p>
						</li>
					{/each}
				</ul>
			{:else}
				<p
					class="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-base font-medium"
					style="color: {TEXT_300};"
				>
					No se han registrado observaciones por parte del equipo administrador.
				</p>
			{/if}
		</article>

		<article
			class="space-y-5 rounded-[22px] p-6 lg:col-span-2"
			style="background: {BG_900}; border: 1px solid {BORDER_SUBTLE}; box-shadow: 0 4px 18px rgba(0,0,32,0.18);"
			aria-labelledby="reporting-heading"
		>
			<header class="flex flex-wrap items-center justify-between gap-3" id="reporting-heading">
				<h3 class="text-2xl font-bold" style="color: {TEXT_100};">Reportes de la comunidad</h3>
				<span
					class={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${reportBadgeStyles}`}
				>
					{reportIcon}
					{reportingStatus.hasReports ? 'Seguimiento activo' : 'Institución confiable'}
				</span>
			</header>
			<p class="text-base leading-relaxed" style="color: {TEXT_300};">
				{reportingStatus.message}
			</p>
			<dl class="space-y-3" aria-label="Detalle de reportes">
				<div class="space-y-1">
					<dt class="text-xs font-semibold uppercase tracking-wide" style="color: {TEXT_400};">
						Última revisión comunitaria
					</dt>
					<dd class="text-base font-medium" style="color: {TEXT_100};">
						{reportingStatus.lastUpdate}
					</dd>
				</div>
				<div class="space-y-1">
					<dt class="text-xs font-semibold uppercase tracking-wide" style="color: {TEXT_400};">
						Nivel de riesgo actual
					</dt>
					<dd class="text-base font-medium" style="color: {TEXT_100};">
						{riskLevelLabel}
					</dd>
				</div>
			</dl>
		</article>
	</div>

	<article
		class="space-y-6 rounded-[22px] p-6"
		style="background: {BG_900}; border: 1px solid {BORDER_SUBTLE}; box-shadow: 0 4px 18px rgba(0,0,32,0.18);"
		aria-labelledby="documents-heading"
	>
		<header class="flex flex-wrap items-center justify-between gap-3" id="documents-heading">
			<div>
				<h3 class="text-2xl font-bold" style="color: {TEXT_100};">Documentación validada</h3>
				<p class="text-sm" style="color: {TEXT_300};">
					Se revisaron {verificationSummary.documentsReviewed} archivos y todos se encuentran aprobados.
				</p>
			</div>
			<span
				class="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-4 py-1 text-sm font-semibold text-emerald-100"
			>
				🗂️ Control documental actualizado
			</span>
		</header>
		<ul class="grid gap-4 md:grid-cols-2" aria-label="Listado de documentación verificada">
			{#each verificationDocuments as document}
				<li class="h-full rounded-2xl border border-white/5 bg-white/5 p-4">
					<div class="flex flex-wrap items-center justify-between gap-2">
						<p class="text-base font-semibold" style="color: {TEXT_100};">
							{document.label}
						</p>
						<span
							class={`rounded-full px-3 py-1 text-xs font-semibold ${getDocumentStatusStyle(document.status)}`}
						>
							{document.status}
						</span>
					</div>
					<p class="mt-2 text-sm" style="color: {TEXT_300};">
						{document.detail}
					</p>
				</li>
			{/each}
		</ul>
	</article>

	<div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
		<p class="text-sm" style="color: {TEXT_300};">
			La constancia de verificación puede compartirse con posibles aliados para reforzar la
			confianza en la institución.
		</p>
		<div class="flex flex-col gap-3 sm:flex-row">
			<button
				class="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-base font-bold text-white transition-all duration-200 hover:scale-[1.01] focus:outline-none focus:ring-4 active:scale-[0.98]"
				style={`background: ${GRADIENT_CTA}; box-shadow: 0 5px 20px ${PRIMARY_500}40;`}
				type="button"
			>
				Descargar constancia de verificación
			</button>
			<button
				class="inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3 text-base font-bold transition-all duration-200 hover:scale-[1.01] focus:outline-none focus:ring-4 active:scale-[0.98]"
				style="border-color: {BORDER_SUBTLE}; color: {TEXT_100};"
				type="button"
			>
				Actualizar documentación
			</button>
		</div>
	</div>
</section>
