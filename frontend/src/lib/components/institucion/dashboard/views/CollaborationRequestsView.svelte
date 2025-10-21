<!--
*- DECISIÓN DE DISEÑO: vista dedicada a gestionar las solicitudes entrantes y mostrar colaboradores aprobados.
-->

<script lang="ts">
	import type {
		ActiveCollaborator,
		CollaborationRequest,
		CollaborationKind,
		ProjectItem
	} from '../types';
	import {
		BG_CARD,
		BORDER_SUBTLE,
		ERROR_COLOR,
		GREEN,
		PRIMARY_300,
		PRIMARY_500,
		TEXT_100,
		TEXT_300,
		TEXT_400
	} from '../tokens';

	export let project: ProjectItem;
	export let requests: CollaborationRequest[] = [];
	export let activeCollaborators: ActiveCollaborator[] = [];

	const kindTokens: Record<
		CollaborationKind,
		{ label: string; color: string; background: string }
	> = {
		empresa: {
			label: 'Empresa eléctrica',
			color: PRIMARY_300,
			background: 'rgba(94, 212, 251, 0.12)'
		},
		ong: {
			label: 'Organización social',
			color: '#6ee7b7',
			background: 'rgba(110, 231, 183, 0.12)'
		},
		voluntariado: {
			label: 'Voluntariado especializado',
			color: '#c4b5fd',
			background: 'rgba(196, 181, 253, 0.16)'
		}
	};

	const hasActiveCollaborators = activeCollaborators.length > 0;
</script>

<section class="space-y-8">
	<header class="space-y-2">
		<p class="text-xs font-semibold uppercase tracking-[0.18em]" style="color: {TEXT_400};">
			Gestión de colaboradores
		</p>
		<h2 class="text-3xl font-extrabold tracking-tight sm:text-[40px]" style="color: {TEXT_100};">
			Solicitudes de colaboración recibidas
		</h2>
		<p class="max-w-2xl text-base leading-relaxed" style="color: {TEXT_300};">
			Revisá los apoyos propuestos para el proyecto <strong>{project.name}</strong> y decidí cómo avanzar.
		</p>
	</header>

	<article
		class="flex flex-col gap-4 rounded-3xl border p-6 sm:flex-row sm:items-center sm:justify-between"
		style="border: 1px solid {BORDER_SUBTLE}; background: {BG_CARD};"
		aria-label="Proyecto seleccionado"
	>
		<div class="space-y-2">
			<p class="text-xs font-semibold uppercase tracking-[0.18em]" style="color: {TEXT_400};">
				Proyecto en curso
			</p>
			<h3 class="text-2xl font-bold" style="color: {TEXT_100};">{project.name}</h3>
			<p class="text-sm" style="color: {TEXT_300};">
				Estado: <span class="font-semibold" style="color: {GREEN};">{project.status}</span>
				· Cierre estimado {project.date}
			</p>
		</div>
		<div
			class="inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-sm font-semibold"
			style="background: rgba(11, 152, 250, 0.14); color: {PRIMARY_500};"
		>
			<span class="inline-flex h-2 w-2 rounded-full" style="background: {PRIMARY_500};"></span>
			{requests.length} solicitudes pendientes
		</div>
	</article>

	<div class="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
		<section
			class="space-y-5 rounded-3xl border p-6"
			style="border: 1px solid {BORDER_SUBTLE}; background: rgba(17, 23, 54, 0.65);"
			aria-labelledby="collaboration-requests-heading"
		>
			<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h3
						id="collaboration-requests-heading"
						class="text-xl font-semibold"
						style="color: {TEXT_100};"
					>
						Solicitudes pendientes
					</h3>
					<p class="text-sm" style="color: {TEXT_300};">
						Validá la información del colaborador antes de aprobar o rechazar.
					</p>
				</div>
				<span
					class="inline-flex h-9 items-center justify-center rounded-full px-4 text-sm font-semibold"
					style="background: rgba(255, 92, 119, 0.12); color: {ERROR_COLOR};"
				>
					{requests.length} en revisión
				</span>
			</div>

			<ul class="space-y-4">
				{#each requests as request (request.id)}
					{#key request.id}
						<li>
							<article
								class="flex flex-col gap-5 rounded-2xl border p-5 transition-transform duration-200 hover:-translate-y-[2px] hover:ring-2"
								style="border: 1px solid {BORDER_SUBTLE}; background: {BG_CARD}; --tw-ring-color: {PRIMARY_500};"
								aria-label={`Solicitud de ${request.collaboratorName}`}
							>
								<header class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
									<div class="space-y-1">
										<h4 class="text-lg font-semibold" style="color: {TEXT_100};">
											{request.collaboratorName}
										</h4>
										<p class="text-sm" style="color: {TEXT_300};">
											{request.organizationName}
											· Recibida el {request.submittedAt}
										</p>
										<a
											class="text-sm font-semibold underline-offset-4 hover:underline"
											style="color: {PRIMARY_300};"
											href={`mailto:${request.email}`}>{request.email}</a
										>
									</div>
									{#if kindTokens[request.kind]}
										<span
											class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
											style={`background:${kindTokens[request.kind].background}; color:${kindTokens[request.kind].color};`}
										>
											<span
												class="h-2 w-2 rounded-full"
												style={`background:${kindTokens[request.kind].color};`}
											></span>
											{kindTokens[request.kind].label}
										</span>
									{/if}
								</header>

								<div class="space-y-3 text-sm" style="color: {TEXT_300};">
									<p>{request.message}</p>
									<p
										class="rounded-xl border px-4 py-3"
										style="border-color: rgba(99, 102, 241, 0.22); background: rgba(99, 102, 241, 0.12); color: {TEXT_100};"
									>
										<strong class="font-semibold">Experiencia relevante:</strong>
										<span class="block text-sm font-medium" style="color: {TEXT_300};">
											{request.experienceSummary}
										</span>
									</p>
								</div>

								<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
									<button
										type="button"
										class="w-full rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 sm:w-auto"
										style="background: {PRIMARY_500}; color: white; --tw-ring-color: {PRIMARY_300};"
										aria-label={`Aceptar la solicitud de ${request.collaboratorName}`}
									>
										Aceptar
									</button>
									<button
										type="button"
										class="w-full rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 sm:w-auto"
										style="border-color: {ERROR_COLOR}; color: {ERROR_COLOR}; --tw-ring-color: rgba(255,92,119,0.35);"
										aria-label={`Rechazar la solicitud de ${request.collaboratorName}`}
									>
										Rechazar
									</button>
								</div>
							</article>
						</li>
					{/key}
				{/each}
			</ul>
		</section>

		<aside
			class="flex h-full flex-col gap-4 rounded-3xl border p-6"
			style="border: 1px solid {BORDER_SUBTLE}; background: rgba(17, 23, 54, 0.55);"
			aria-labelledby="active-collaborators-heading"
		>
			<div class="space-y-2">
				<h3
					id="active-collaborators-heading"
					class="text-xl font-semibold"
					style="color: {TEXT_100};"
				>
					Colaboradores activos
				</h3>
				<p class="text-sm" style="color: {TEXT_300};">
					Visualizá quiénes ya fueron aprobados para trabajar en el proyecto.
				</p>
			</div>

			{#if hasActiveCollaborators}
				<ul class="space-y-3">
					{#each activeCollaborators as collaborator (collaborator.id)}
						<li>
							<article
								class="space-y-2 rounded-2xl border p-4"
								style="border: 1px solid {BORDER_SUBTLE}; background: {BG_CARD};"
								aria-label={`Colaborador activo ${collaborator.name}`}
							>
								<h4 class="text-base font-semibold" style="color: {TEXT_100};">
									{collaborator.name}
								</h4>
								<p class="text-sm" style="color: {TEXT_300};">{collaborator.role}</p>
								<a
									class="text-sm font-semibold underline-offset-4 hover:underline"
									style="color: {PRIMARY_300};"
									href={`mailto:${collaborator.email}`}>{collaborator.email}</a
								>
								<p class="text-xs" style="color: {TEXT_400};">
									Integrado el {collaborator.joinedAt}
								</p>
								<p class="text-sm" style="color: {TEXT_300};">{collaborator.contribution}</p>
							</article>
						</li>
					{/each}
				</ul>
			{:else}
				<div
					class="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed p-6 text-center"
					style="border-color: rgba(148, 163, 184, 0.28); color: {TEXT_300}; background: rgba(15, 17, 45, 0.35);"
				>
					<div
						class="flex h-12 w-12 items-center justify-center rounded-full text-2xl"
						style="background: rgba(94, 212, 251, 0.18); color: {PRIMARY_300};"
						aria-hidden="true"
					>
						🤝
					</div>
					<p class="text-base font-semibold" style="color: {TEXT_100};">
						Aún no hay colaboradores aprobados
					</p>
					<p class="text-sm" style="color: {TEXT_300};">
						Una vez que aceptes una solicitud, aparecerá aquí para facilitar el seguimiento.
					</p>
				</div>
			{/if}
		</aside>
	</div>
</section>
