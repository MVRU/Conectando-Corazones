<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import {
		ArrowLeft,
		ClipboardList,
		MessageSquareText,
		Calendar,
		UserCircle
	} from 'lucide-svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let proyecto = $derived(data.proyecto);
	let solicitudes = $derived(data.solicitudes as Array<{
		id_solicitud: number;
		estado: string | null;
		created_at: string | null;
		evaluaciones?: Array<{
			id_evaluacion: number;
			voto: string | null;
			justificacion: string | null;
			created_at: string | null;
			colaborador: {
				id_usuario: number;
				username: string;
				nombre: string;
				apellido: string;
			} | null;
		}>;
	}>);

	function labelEstadoSolicitud(estado: string | null | undefined): string {
		const e = (estado || '').toLowerCase();
		if (!e) return 'En proceso';
		const map: Record<string, string> = {
			pendiente: 'Pendiente',
			en_revision: 'En revisión',
			aprobada: 'Aprobada',
			rechazada: 'Rechazada'
		};
		return map[e] || estado || '—';
	}

	function clasesEstado(estado: string | null | undefined): string {
		const e = (estado || '').toLowerCase();
		if (e === 'aprobada') return 'bg-emerald-100 text-emerald-800 ring-emerald-200';
		if (e === 'rechazada') return 'bg-red-100 text-red-800 ring-red-200';
		if (e === 'en_revision' || e === 'pendiente') return 'bg-amber-100 text-amber-900 ring-amber-200';
		return 'bg-slate-100 text-slate-700 ring-slate-200';
	}

	function labelVoto(voto: string | null | undefined): string {
		const v = (voto || '').toLowerCase();
		if (v === 'aprobado') return 'Aprobó';
		if (v === 'rechazado') return 'Rechazó';
		return voto || '—';
	}

	function nombreColaborador(ev: {
		colaborador: {
			username: string;
			nombre: string;
			apellido: string;
		} | null;
	}): string {
		const c = ev.colaborador;
		if (!c) return 'Colaborador';
		const full = `${c.nombre || ''} ${c.apellido || ''}`.trim();
		return full || c.username;
	}

	function fmtFecha(iso: string | null | undefined): string {
		if (!iso) return '—';
		const d = new Date(iso);
		if (Number.isNaN(d.getTime())) return '—';
		return d.toLocaleDateString('es-AR', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Solicitudes de cierre — {proyecto?.titulo || 'Proyecto'} | Conectando Corazones</title>
</svelte:head>

<main class="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-4xl space-y-8">
		<div>
			<button
				type="button"
				class="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
				onclick={() => goto(`/proyectos/${proyecto?.id_proyecto}`)}
			>
				<ArrowLeft class="h-4 w-4" />
				Volver al proyecto
			</button>
			<h1 class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
				Solicitudes de finalización
			</h1>
			<p class="mt-2 text-slate-600">
				{proyecto?.titulo} — historial de envíos a revisión y opiniones de colaboradores.
			</p>
			<a
				href={proyecto?.id_proyecto
					? `/institucion/solicitar-cierre?proyecto=${proyecto.id_proyecto}`
					: '/institucion/solicitar-cierre'}
				class="mt-4 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
			>
				<ClipboardList class="h-4 w-4" />
				Solicitar cierre
			</a>
		</div>

		{#if solicitudes.length === 0}
			<div
				class="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-600 shadow-sm"
			>
				<p class="text-lg font-medium text-slate-800">Todavía no hay solicitudes registradas</p>
				<p class="mt-2 text-sm">
					Cuando envíes una solicitud de cierre, vas a ver acá el estado y los comentarios de quienes
					la evalúen.
				</p>
			</div>
		{:else}
			<ul class="space-y-6">
				{#each solicitudes as s (s.id_solicitud)}
					<li class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
						<div
							class="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-4"
						>
							<div>
								<p class="text-xs font-medium tracking-wide text-slate-500 uppercase">
									Solicitud #{s.id_solicitud}
								</p>
								<p class="mt-1 flex items-center gap-2 text-sm text-slate-600">
									<Calendar class="h-4 w-4 shrink-0 text-slate-400" />
									{fmtFecha(s.created_at)}
								</p>
							</div>
							<span
								class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 {clasesEstado(
									s.estado
								)}"
							>
								{labelEstadoSolicitud(s.estado)}
							</span>
						</div>

						<div class="px-5 py-4">
							{#if s.evaluaciones && s.evaluaciones.length > 0}
								<h3 class="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
									<MessageSquareText class="h-4 w-4 text-sky-600" />
									Feedback de colaboradores
								</h3>
								<ul class="space-y-4">
									{#each s.evaluaciones as ev (ev.id_evaluacion)}
										<li class="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
											<div class="flex flex-wrap items-center gap-2 text-sm">
												<UserCircle class="h-4 w-4 text-slate-400" />
												<span class="font-semibold text-slate-800">{nombreColaborador(ev)}</span>
												<span class="text-slate-400">·</span>
												<span class="font-medium text-slate-600">{labelVoto(ev.voto)}</span>
												<span class="ml-auto text-xs text-slate-500">{fmtFecha(ev.created_at)}</span>
											</div>
											{#if ev.justificacion?.trim()}
												<p class="mt-2 text-sm leading-relaxed text-slate-700">
													{ev.justificacion}
												</p>
											{:else}
												<p class="mt-2 text-sm italic text-slate-400">Sin comentario escrito.</p>
											{/if}
										</li>
									{/each}
								</ul>
							{:else}
								<p class="text-sm text-slate-500">
									{#if (s.estado || '').toLowerCase() === 'en_revision' || !(s.estado || '').trim()}
										Aún no hay evaluaciones cargadas para esta solicitud.
									{:else}
										No se registraron evaluaciones para esta solicitud.
									{/if}
								</p>
							{/if}
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</main>
