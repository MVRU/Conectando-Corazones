<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { CheckCircle2, Clock3, FileBadge2, Sparkles } from 'lucide-svelte';
	import type { ClosureEvidence, ProjectClosureSummary } from '../types';
	import {
		BG_CARD,
		BORDER_SUBTLE,
		GRADIENT_CTA,
		INFO_COLOR,
		PRIMARY_500,
		TEXT_100,
		TEXT_300,
		TEXT_400
	} from '../tokens';

	export let summary: ProjectClosureSummary;

	const dispatch = createEventDispatcher<{ finalize: void }>();
	const sectionHeadingId = 'closure-request-heading';
	const progressLabelId = 'closure-progress-label';

	const dateTimeFormatter = new Intl.DateTimeFormat('es-AR', {
		dateStyle: 'long',
		timeStyle: 'short'
	});

	const flowStyles: Record<ClosureEvidence['evidenceFlow'], { label: string; classes: string }> = {
		entrada: {
			label: 'Entrada',
			classes: 'bg-sky-500/15 border-sky-400/40 text-sky-100'
		},
		salida: {
			label: 'Salida',
			classes: 'bg-emerald-500/15 border-emerald-400/40 text-emerald-100'
		}
	};

	const getObjectiveHeadingId = (id: string): string => `${id}-heading`;
	const getObjectiveDescriptionId = (id: string): string => `${id}-approvals`;

	const formatDate = (value: string): string => {
		const parsed = new Date(value);
		if (Number.isNaN(parsed.getTime())) {
			return value;
		}
		return dateTimeFormatter.format(parsed);
	};

	const handleFinalize = () => {
		dispatch('finalize');
	};
</script>

<section class="space-y-8" aria-labelledby={sectionHeadingId}>
	<header
		class="rounded-3xl border p-6 shadow-xl sm:p-8"
		style={`background: linear-gradient(145deg, ${BG_CARD}F2, rgba(25,32,63,0.92)); border-color: ${BORDER_SUBTLE};`}
	>
		<div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
			<div class="space-y-3">
				<p class="text-xs font-semibold uppercase tracking-[0.2em]" style={`color:${TEXT_400};`}>
					Proyecto listo para cerrar
				</p>
				<h2
					id={sectionHeadingId}
					class="text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl lg:text-[42px]"
					style="color: white;"
				>
					Solicitud de cierre del proyecto
				</h2>
				<p class="max-w-xl text-base font-medium leading-relaxed" style={`color:${TEXT_300};`}>
					{summary.readinessLabel}
				</p>
			</div>
			<div
				class="w-full max-w-md rounded-2xl border p-5"
				style={`background: rgba(17,21,46,0.75); border-color: ${BORDER_SUBTLE};`}
			>
				<div class="mb-4 flex items-center gap-3" aria-live="polite">
					<span
						class="inline-flex h-10 w-10 items-center justify-center rounded-2xl"
						style={`background:${PRIMARY_500}1a; color:${PRIMARY_500};`}
					>
						<CheckCircle2 class="h-5 w-5" aria-hidden="true" />
					</span>
					<div>
						<p
							id={progressLabelId}
							class="text-sm font-semibold uppercase tracking-[0.16em] text-white/70"
						>
							Colaboradores aprobaron todo
						</p>
						<p class="text-lg font-bold" style={`color:${TEXT_100};`}>Proyecto listo para cerrar</p>
					</div>
				</div>
				<div
					role="progressbar"
					aria-labelledby={progressLabelId}
					aria-valuenow={summary.progressPercent}
					aria-valuemin="0"
					aria-valuemax="100"
					class="relative h-3 w-full overflow-hidden rounded-full border"
					style={`border-color:${BORDER_SUBTLE}; background: rgba(255,255,255,0.12);`}
				>
					<span
						class="absolute left-0 top-0 h-full rounded-full"
						style={`width:${summary.progressPercent}%; background:${GRADIENT_CTA}; box-shadow:0 0 16px ${PRIMARY_500}70;`}
					></span>
				</div>
				<div
					class="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium"
					style={`color:${TEXT_400};`}
				>
					<Clock3 class="h-4 w-4" aria-hidden="true" />
					<span>Última actualización:</span>
					<time datetime={summary.lastUpdatedAt} class="text-white/80">
						{formatDate(summary.lastUpdatedAt)}
					</time>
				</div>
			</div>
		</div>
	</header>

	<ol class="space-y-6" aria-label="Objetivos alcanzados y sus evidencias">
		{#each summary.objectives as objective, index (objective.id)}
			<li>
				<article
					class="rounded-3xl border p-6 shadow-lg transition-transform duration-200 hover:-translate-y-1"
					style={`background: rgba(20,26,52,0.8); border-color:${BORDER_SUBTLE};`}
					aria-labelledby={getObjectiveHeadingId(objective.id)}
					aria-describedby={getObjectiveDescriptionId(objective.id)}
				>
					<div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
						<div class="space-y-2">
							<p class="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
								Objetivo {index + 1}
							</p>
							<h3
								id={getObjectiveHeadingId(objective.id)}
								class="text-2xl font-semibold leading-tight"
								style={`color:${TEXT_100};`}
							>
								{objective.title}
							</h3>
						</div>
						<div
							id={getObjectiveDescriptionId(objective.id)}
							class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
							style="background: rgba(45, 196, 162, 0.16); color: #a7f3d0;"
						>
							<CheckCircle2 class="h-4 w-4" aria-hidden="true" />
							Aprobados {objective.approvals.approved}/{objective.approvals.required}
						</div>
					</div>

					<ul class="mt-5 space-y-3" aria-label={`Evidencias de ${objective.title}`}>
						{#each objective.evidences as evidence (evidence.id)}
							<li
								class="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20"
							>
								<div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
									<div class="flex items-start gap-3">
										<span
											class="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border text-sm font-semibold"
											style={`background:rgba(12,18,45,0.6); border-color:${BORDER_SUBTLE}; color:${PRIMARY_500};`}
										>
											<FileBadge2 class="h-5 w-5" aria-hidden="true" />
										</span>
										<div class="space-y-1">
											<div class="flex flex-wrap items-center gap-2">
												<span
													class={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${flowStyles[evidence.evidenceFlow].classes}`}
												>
													{flowStyles[evidence.evidenceFlow].label}
												</span>
												<p class="text-sm font-semibold uppercase tracking-[0.12em] text-white/60">
													{formatDate(evidence.uploadedAt)}
												</p>
											</div>
											<p class="text-lg font-semibold" style={`color:${TEXT_100};`}>
												{evidence.title}
											</p>
											<p class="text-sm leading-relaxed" style={`color:${TEXT_300};`}>
												{evidence.description}
											</p>
											<p class="text-sm" style={`color:${TEXT_400};`}>
												Subido por <span class="font-semibold text-white/80"
													>{evidence.uploadedBy}</span
												>
											</p>
										</div>
									</div>
									{#if evidence.fileUrl}
										<div class="flex items-center justify-end">
											<a
												class="rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/80 transition hover:text-white"
												style={`border-color:${PRIMARY_500}66;`}
												href={evidence.fileUrl}
												rel="noreferrer noopener"
												target="_blank"
												aria-label={`Ver archivo ${evidence.title}`}
											>
												Ver archivo
											</a>
										</div>
									{/if}
								</div>
							</li>
						{/each}
					</ul>
				</article>
			</li>
		{/each}
	</ol>

	<footer
		class="rounded-3xl border p-6 sm:p-8"
		style={`background: linear-gradient(160deg, rgba(19,28,58,0.95), rgba(9,15,40,0.92)); border-color:${BORDER_SUBTLE};`}
	>
		<div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
			<div class="space-y-2">
				<h3 class="text-2xl font-semibold" style={`color:${TEXT_100};`}>
					Confirmá el cierre cuando estés lista
				</h3>
				<p class="max-w-xl text-sm leading-relaxed" style={`color:${TEXT_300};`}>
					Al cerrarlo notificaremos a los colaboradores y archivaremos todas las evidencias
					temporalmente para protegerte, cumpliendo con la Ley 25.326 de Protección de Datos
					Personales y normativas asociadas.
				</p>
			</div>
			<button
				type="button"
				class="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-3 text-base font-semibold text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 md:w-auto"
				style={`background:${GRADIENT_CTA}; box-shadow:0 12px 28px ${PRIMARY_500}33;`}
				on:click={handleFinalize}
			>
				<span class="relative z-10">Cerrar proyecto</span>
				<span
					class="absolute inset-0 z-0 scale-105 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-40"
				></span>
			</button>
		</div>

		<div
			class="mt-6 flex flex-col gap-4 rounded-3xl border p-5 text-center sm:text-left md:flex-row md:items-center"
			style={`background: radial-gradient(circle at top, ${INFO_COLOR}0F, transparent 65%), rgba(24,32,68,0.85); border-color:${PRIMARY_500}40;`}
		>
			<div
				class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
				style={`background:${PRIMARY_500}1f; color:${PRIMARY_500};`}
			>
				<Sparkles class="h-7 w-7" aria-hidden="true" />
			</div>
			<div class="space-y-2 text-sm leading-relaxed">
				<p class="text-base font-semibold" style={`color:${TEXT_100};`}>
					{summary.aiNotice.headline}
				</p>
				<p style={`color:${TEXT_300};`}>
					{summary.aiNotice.description}
				</p>
				{#if summary.aiNotice.subcopy}
					<p class="text-xs uppercase tracking-[0.22em]" style={`color:${TEXT_400};`}>
						{summary.aiNotice.subcopy}
					</p>
				{/if}
			</div>
		</div>
	</footer>
</section>
