<script lang="ts">
	import type { Proyecto } from '$lib/types/Proyecto';
	import type { EstadoDescripcion } from '$lib/types/Estado';
	import type { Colaboracion } from '$lib/types/Colaboracion';
	import type { ParticipacionPermitida } from '$lib/types/ParticipacionPermitida';
	import { PRIORIDAD_TIPO, type ProyectoUbicacion } from '$lib/types/ProyectoUbicacion';
	import { setBreadcrumbs, BREADCRUMB_ROUTES } from '$lib/stores/breadcrumbs';
	import { mockProyectos } from '$lib/mocks/mock-proyectos';
	import { page } from '$app/stores';
	import {
		esUbicacionPresencial,
		esUbicacionVirtual,
		construirDireccionCompleta,
		generarUrlGoogleMaps
	} from '$lib/utils/util-ubicaciones';
	import { error } from '@sveltejs/kit';
	import { goto } from '$app/navigation';

	import ProyectoHeader from '$lib/components/proyectos/ProyectoHeader.svelte';
	import DetallesProyecto from '$lib/components/proyectos/DetallesProyecto.svelte';
	import ProyectoProgreso from '$lib/components/proyectos/ProyectoProgreso.svelte';
	import ModalColaboracion from '$lib/components/proyectos/ModalColaboracion.svelte';
	import { getEstadoCodigo, estadoLabel } from '$lib/utils/util-estados';
	import { colaboracionesVisibles, obtenerNombreColaborador } from '$lib/utils/util-colaboraciones';
	import { ordenarPorProgreso } from '$lib/utils/util-progreso';
	import { layoutStore } from '$lib/stores/layout';
	import { usuario } from '$lib/stores/auth';
	import { mockColaboraciones } from '$lib/mocks/mock-colaboraciones';
	import { onDestroy, onMount } from 'svelte';

	import {
		CheckCircle,
		Clock,
		ArchiveBox,
		EllipsisHorizontalCircle,
		MapPin,
		GlobeAlt,
		Link,
		Heart,
		Share,
		XCircle,
		Pencil,
		ShieldCheck,
		Trash,
		ChevronDown
	} from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';

	let proyecto: Proyecto;
	let colaboracionesActivas: Colaboracion[] = [];
	let participacionesOrdenadas: ParticipacionPermitida[] = [];
	let ubicacionesOrdenadas: ProyectoUbicacion[] = [];

	$: colaboracionesActivas = colaboracionesVisibles(proyecto?.colaboraciones ?? []);
	$: participacionesOrdenadas = ordenarPorProgreso(proyecto?.participacion_permitida ?? []);

	$: esCreador = $usuario?.id_usuario === proyecto?.institucion?.id_usuario;
	$: colaboracionUsuario =
		$usuario &&
		mockColaboraciones.find(
			(c) => c.proyecto_id === proyecto?.id_proyecto && c.colaborador_id === $usuario?.id_usuario
		);

	$: esColaboradorAprobado = colaboracionUsuario?.estado === 'aprobada';
	$: esSolicitudRechazada = colaboracionUsuario?.estado === 'rechazada';
	$: tieneSolicitudPendiente = colaboracionUsuario?.estado === 'pendiente';
	$: esAdministrador = $usuario?.rol === 'administrador';

	$: {
		const id = $page.params.id;
		const encontrado = mockProyectos.find((p) => p.id_proyecto?.toString() === id);
		if (encontrado) {
			proyecto = encontrado;
			setBreadcrumbs([
				BREADCRUMB_ROUTES.home,
				BREADCRUMB_ROUTES.proyectos,
				{ label: proyecto.titulo }
			]);
		} else {
			throw error(404, 'Proyecto no encontrado');
		}
	}

	function aFecha(fecha: string | Date | undefined | null): Date | null {
		if (!fecha) return null;
		const d = fecha instanceof Date ? fecha : new Date(fecha);
		return isNaN(d.getTime()) ? null : d;
	}

	function diasRestantes(fechaFin: string | Date | undefined | null): number {
		const fin = aFecha(fechaFin);
		if (!fin) return 0;
		const hoy = new Date();
		return Math.max(Math.ceil((fin.getTime() - hoy.getTime()) / 86_400_000), 0);
	}

	function formatearFechaLocal(fecha: string | Date | undefined | null): string {
		const d = aFecha(fecha);
		return d
			? d.toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })
			: 'Fecha no disponible';
	}

	function clasesEstado(estado: EstadoDescripcion) {
		return (
			{
				en_curso: 'text-green-600 bg-green-100',
				pendiente_solicitud_cierre: 'text-orange-600 bg-orange-100',
				en_revision: 'text-gray-600 bg-gray-100',
				en_auditoria: 'text-gray-600 bg-gray-100',
				completado: 'text-blue-600 bg-blue-100',
				cancelado: 'text-gray-600 bg-gray-100'
			}[estado] || 'text-gray-600 bg-gray-100'
		);
	}

	$: estadoCodigo = proyecto ? getEstadoCodigo(proyecto.estado, proyecto.estado_id) : 'en_curso';
	$: clasesChipEstado = clasesEstado(estadoCodigo);

	function estadoObjetivo(actual: number, objetivo: number): 'completo' | 'parcial' | 'pendiente' {
		if (actual >= objetivo) return 'completo';
		if (actual > 0) return 'parcial';
		return 'pendiente';
	}

	function capitalizar(s?: string) {
		return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
	}

	function ordenarUbicaciones(ubs?: ProyectoUbicacion[]): ProyectoUbicacion[] {
		if (!ubs?.length) return [];
		const prioridad = new Map(PRIORIDAD_TIPO.map((t, i) => [t, i]));
		return [...ubs].sort((a, b) => {
			const ta = a.ubicacion?.tipo_ubicacion ?? '';
			const tb = b.ubicacion?.tipo_ubicacion ?? '';
			const pa = prioridad.get(ta as any) ?? Number.MAX_SAFE_INTEGER;
			const pb = prioridad.get(tb as any) ?? Number.MAX_SAFE_INTEGER;
			if (pa !== pb) return pa - pb;
			const ma = a.ubicacion?.modalidad === 'presencial' ? 0 : 1;
			const mb = b.ubicacion?.modalidad === 'presencial' ? 0 : 1;
			return ma - mb;
		});
	}

	$: ubicacionesOrdenadas = ordenarUbicaciones(proyecto?.ubicaciones);

	$: colaboradoresAprobados = (colaboracionesActivas ?? []).filter((c) => c.estado === 'aprobada');

	function clasesChipColaborador(tipo?: string) {
		const t = (tipo || '').toLowerCase();
		return t.includes('org') ? 'bg-indigo-50 text-indigo-700' : 'bg-sky-50 text-sky-700';
	}

	function etiquetaTipoColaborador(tipo?: string) {
		const t = (tipo || '').toLowerCase();
		if (t.includes('org')) return 'Organización';
		if (t.includes('uni') || t.includes('persona')) return 'Voluntario/a';
		return 'Voluntario/a';
	}

	function esParticipacionMonetaria(p: ParticipacionPermitida): boolean {
		return p.tipo_participacion?.descripcion === 'Monetaria';
	}

	function formatoNumero(valor: number): string {
		return new Intl.NumberFormat('es-AR', {
			style: 'decimal',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(valor);
	}

	function irAColaborar() {
		if (!$usuario) {
			goto('/iniciar-sesion');
			return;
		}
		mostrarModalColaborar = true;
	}

	async function compartirProyecto() {
		const url = window.location.href;
		const titulo = proyecto?.titulo || 'Conectando Corazones';
		const texto = 'Sumate a este proyecto solidario';
		try {
			if (navigator.share) await navigator.share({ title: titulo, text: texto, url });
			else if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(url);
		} catch {
			/* cancelado por la persona usuaria */
		}
	}

	function iniciales(nombre?: string): string {
		if (!nombre) return 'CC';
		return nombre
			.split(' ')
			.filter(Boolean)
			.slice(0, 2)
			.map((p) => p[0]?.toUpperCase())
			.join('');
	}

	let mostrarModalColaborar = false;
	let mostrarModalExito = false;
	let mostrarModalJustificacion = false;
	let mostrarModalPendiente = false;
	let mostrarDropdownAdmin = false;
	let solicitudRecienEnviada = false;

	function manejarClickSolicitud() {
		if (tieneSolicitudPendiente) {
			mostrarModalPendiente = true;
		} else {
			irAColaborar();
		}
	}

	onMount(() => {
		layoutStore.showStickyBottomBar();
	});

	onDestroy(() => {
		layoutStore.hideStickyBottomBar();
	});
</script>

<svelte:head>
	<title>{proyecto?.titulo || 'Proyecto'} - Conectando Corazones</title>
	<meta name="description" content={proyecto?.descripcion || 'Detalle del proyecto'} />
</svelte:head>

{#if proyecto}
	<main
		class="min-h-screen pb-24 pt-6 text-gray-800 sm:pt-10 {esAdministrador
			? 'bg-slate-50'
			: 'bg-gray-50'}"
		aria-label="Detalle del proyecto"
	>
		{#if esAdministrador}
			<div
				class="sticky z-40 -mt-6 mb-6 flex w-full items-center justify-center bg-blue-800 px-4 py-2 text-center text-sm font-medium text-white shadow-md transition-all duration-500 sm:-mt-10 sm:mb-10 {$layoutStore.headerVisible
					? 'top-[4.5rem]'
					: 'top-0'}"
				role="alert"
			>
				<p>
					Estás visualizando este proyecto como Administrador.
					<a href="/mi-panel" class="ml-1 underline hover:text-blue-200">
						Ir al panel de administración
					</a>
				</p>
			</div>
		{/if}

		<div
			class="animate-fade-up mx-auto w-full max-w-7xl space-y-6 px-4 sm:space-y-12 sm:px-6 lg:px-8"
		>
			<ProyectoHeader {proyecto} {esAdministrador} />

			<div class="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-10">
				<!-- Columna principal -->
				<div class="animate-fade-up order-2 space-y-6 sm:space-y-10 lg:order-1 lg:col-span-2">
					<section
						class="rounded-xl border border-gray-200 bg-white p-4 shadow transition-shadow hover:shadow-lg sm:p-6"
						aria-labelledby="titulo-progreso"
					>
						<h2 id="titulo-progreso" class="mb-4 text-xl font-semibold sm:text-2xl">
							Progreso del proyecto
						</h2>

						<ProyectoProgreso {proyecto} variant="extended" />

						<div class="mt-6 sm:mt-8">
							<h3
								class="mb-4 flex flex-wrap items-center justify-between text-lg font-medium text-gray-900"
								id="titulo-objetivos"
							>
								<span
									>{(proyecto.participacion_permitida?.length || 0) === 1
										? 'Objetivo'
										: 'Objetivos'}</span
								>
								{#if proyecto.fecha_fin_tentativa}
									<div class="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600 md:mt-0">
										<div class="rounded-full bg-blue-50 px-3 py-1.5" aria-label="Días restantes">
											<span class="text-xs font-semibold text-blue-700">
												{diasRestantes(proyecto.fecha_fin_tentativa)} días restantes
											</span>
										</div>
									</div>
								{/if}
							</h3>

							{#if proyecto.participacion_permitida?.length}
								<ul class="space-y-4" aria-labelledby="titulo-objetivos">
									{#each participacionesOrdenadas as p (p.id_participacion_permitida)}
										{@const porcentaje = Math.round(((p.actual || 0) / p.objetivo) * 100)}
										<li
											class="flex items-start gap-4 rounded-xl border border-gray-100 p-4 shadow-sm transition hover:border-gray-200 sm:p-5"
											role="group"
											aria-label={`Progreso de ${p.unidad_medida}`}
										>
											<div class="flex-shrink-0" aria-hidden="true">
												{#if estadoObjetivo(p.actual || 0, p.objetivo) === 'completo'}
													<span
														class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100"
													>
														<Icon src={CheckCircle} class="h-4 w-4 text-emerald-700" />
													</span>
												{:else if estadoObjetivo(p.actual || 0, p.objetivo) === 'parcial'}
													<span
														class="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100"
													>
														<Icon src={Clock} class="h-4 w-4 text-amber-700" />
													</span>
												{:else}
													<span
														class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200"
													>
														<Icon src={ArchiveBox} class="h-4 w-4 text-gray-600" />
													</span>
												{/if}
											</div>

											<div class="flex w-full flex-col">
												<p class="font-medium text-gray-800">
													{esParticipacionMonetaria(p)
														? `$ ${formatoNumero(p.actual || 0)} / $ ${formatoNumero(p.objetivo)} ${p.unidad_medida?.toUpperCase() || ''}`
														: `${p.actual || 0} / ${p.objetivo} ${p.unidad_medida === 'personas' ? 'voluntarios' : p.unidad_medida}`}
												</p>
												<div
													class="mt-1 flex justify-between text-xs text-gray-500"
													aria-label="Porcentaje alcanzado"
												>
													<span>{porcentaje}% alcanzado</span>
												</div>
											</div>
										</li>
									{/each}
								</ul>
							{:else}
								<p class="text-sm text-gray-500">
									No hay participaciones definidas para este proyecto.
								</p>
							{/if}
						</div>
					</section>

					<section
						class="rounded-xl border border-gray-200 bg-white p-4 shadow transition-shadow hover:shadow-lg sm:p-6"
						aria-label="Detalles del proyecto"
					>
						<DetallesProyecto {proyecto} formatearFecha={formatearFechaLocal} />
					</section>
				</div>

				<!-- Columna lateral -->
				<div class="animate-fade-up order-1 space-y-6 lg:order-2" style="animation-delay: 100ms">
					<div
						class="hidden lg:sticky lg:top-6 lg:z-[1] lg:block lg:rounded-2xl lg:bg-white/60 lg:p-1 lg:backdrop-blur lg:supports-[backdrop-filter]:bg-white/40"
						role="group"
						aria-label="Acciones principales del proyecto"
					>
						<div class="flex gap-3">
							{#if esAdministrador}
								<div class="relative flex-1">
									<button
										type="button"
										on:click={() => (mostrarDropdownAdmin = !mostrarDropdownAdmin)}
										class="inline-flex h-11 w-full cursor-pointer items-center justify-between gap-2 whitespace-nowrap rounded-xl bg-slate-900 px-4 font-semibold text-white shadow-[0_8px_24px_rgba(15,23,42,.35)] transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2 active:translate-y-[1px]"
										aria-expanded={mostrarDropdownAdmin}
										aria-haspopup="true"
									>
										Gestionar proyecto
										<Icon
											src={ChevronDown}
											class="h-4 w-4 shrink-0 transition-transform duration-200 {mostrarDropdownAdmin
												? 'rotate-180'
												: ''}"
										/>
									</button>

									{#if mostrarDropdownAdmin}
										<!-- Dropdown menu -->
										<div
											class="animate-in fade-in zoom-in-95 absolute left-0 right-0 top-full mt-2 flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl ring-1 ring-black/5 duration-100"
											role="menu"
											tabindex="-1"
										>
											<button
												class="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100"
												role="menuitem"
											>
												<Icon src={Pencil} class="h-4 w-4 text-gray-500" />
												Editar proyecto
											</button>
											<button
												class="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100"
												role="menuitem"
											>
												<Icon src={ShieldCheck} class="h-4 w-4 text-gray-500" />
												Auditar proyecto
											</button>
											<div class="my-1 border-t border-gray-100"></div>
											<button
												class="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 active:bg-red-100"
												role="menuitem"
											>
												<Icon src={Trash} class="h-4 w-4 text-red-500" />
												Eliminar proyecto
											</button>
										</div>

										<div
											class="fixed inset-0 z-[-1]"
											on:click={() => (mostrarDropdownAdmin = false)}
											aria-hidden="true"
										></div>
									{/if}
								</div>
							{:else if esCreador && estadoCodigo === 'pendiente_solicitud_cierre'}
								<a
									href="/institucion/solicitar-cierre?proyecto={proyecto.id_proyecto}"
									class="inline-flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-orange-600 to-orange-400 font-semibold text-white shadow-[0_8px_24px_rgba(249,115,22,.35)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 active:translate-y-[1px]"
									aria-label="Solicitar cierre del proyecto"
								>
									<Icon src={CheckCircle} class="h-4 w-4" aria-hidden="true" />
									Solicitar cierre
								</a>
							{:else if esCreador || esColaboradorAprobado}
								<a
									href="/proyectos/{proyecto.id_proyecto}/panel"
									class="inline-flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 font-semibold text-white shadow-[0_8px_24px_rgba(2,132,199,.35)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 active:translate-y-[1px]"
									aria-label="Ver panel del proyecto"
								>
									<Icon src={Heart} class="h-4 w-4" aria-hidden="true" />
									Ver panel
								</a>
							{:else}
								<!-- Botón de acción principal -->
								{#if esSolicitudRechazada}
									<button
										type="button"
										on:click={() => (mostrarModalJustificacion = true)}
										class="inline-flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-100 font-semibold text-red-700 shadow-sm transition hover:bg-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 active:translate-y-[1px]"
										aria-label="Ver motivo del rechazo"
									>
										Solicitud rechazada
									</button>
								{:else}
									<button
										type="button"
										on:click={manejarClickSolicitud}
										disabled={estadoCodigo !== 'en_curso' || solicitudRecienEnviada}
										class={tieneSolicitudPendiente
											? 'inline-flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-100 font-semibold text-amber-700 shadow-sm transition hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 active:translate-y-[1px]'
											: 'inline-flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 font-semibold text-white shadow-[0_8px_24px_rgba(2,132,199,.35)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:grayscale'}
										aria-label={tieneSolicitudPendiente || solicitudRecienEnviada
											? 'Ver estado de solicitud'
											: 'Colaborar ahora en este proyecto'}
									>
										{#if tieneSolicitudPendiente || solicitudRecienEnviada}
											<Icon src={Clock} class="h-4 w-4" aria-hidden="true" />
											Solicitud enviada
										{:else}
											<Icon src={Heart} class="h-4 w-4" aria-hidden="true" />
											Colaborar ahora
										{/if}
									</button>
								{/if}
							{/if}

							<button
								type="button"
								on:click={compartirProyecto}
								class="inline-flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 active:translate-y-[1px]"
								aria-label="Compartir este proyecto"
							>
								<Icon src={Share} class="h-4 w-4" aria-hidden="true" />
								Compartir
							</button>
						</div>

						<p class="px-1 pt-2 text-center text-xs text-gray-500">
							Tu ayuda se refleja en tiempo real en el progreso del proyecto.
						</p>
					</div>

					<section
						class="rounded-xl border border-gray-200 bg-white p-4 shadow sm:p-6"
						aria-label="Información del proyecto"
					>
						<h3 class="mb-5 text-lg font-semibold text-gray-900">Información básica</h3>

						<div class="space-y-4">
							<div class="flex items-center justify-between border-b border-gray-100 pb-3">
								<span class="text-sm text-gray-600">Estado actual del proyecto</span>
								<span
									class={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${clasesChipEstado}`}
									aria-label={`Estado: ${estadoLabel(estadoCodigo)}`}
								>
									<Icon src={EllipsisHorizontalCircle} class="h-3.5 w-3.5" />
									{estadoLabel(estadoCodigo)}
								</span>
							</div>

							<div class="flex items-center justify-between">
								<div class="flex min-w-0 items-center gap-3">
									<div
										class="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gray-100 ring-1 ring-gray-200"
										aria-label="Identidad visual de la institución"
									>
										{#if proyecto.institucion?.url_foto}
											<img
												src={proyecto.institucion.url_foto}
												alt="Logo o foto de la institución"
												class="h-full w-full object-cover"
												loading="lazy"
											/>
										{:else}
											<span class="text-[11px] font-semibold text-gray-600"
												>{iniciales(proyecto.institucion?.nombre_legal)}</span
											>
										{/if}
									</div>

									<div class="min-w-0 flex-1">
										<span
											class="block truncate text-sm font-medium text-gray-900"
											title={proyecto.institucion?.nombre_legal || 'Institución organizadora'}
											aria-label="Institución organizadora"
										>
											{(proyecto.institucion?.nombre_legal || 'Institución organizadora') +
												(esCreador ? ' (vos)' : '')}
										</span>
										<div class="mt-1">
											<span
												class="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-100"
											>
												{proyecto.institucion?.tipo_institucion || 'Institución'}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>

					<section
						class="rounded-xl border border-gray-200 bg-white p-4 shadow sm:p-6"
						aria-label="Ubicaciones del proyecto"
					>
						<h3 class="mb-5 text-lg font-semibold text-gray-900">Ubicaciones</h3>

						{#if ubicacionesOrdenadas.length}
							<ul class="rounded-lg">
								{#each ubicacionesOrdenadas as pu (pu.id_proyecto_ubicacion)}
									<li class="border-b border-gray-100 py-3 first:pt-0 last:border-b-0 last:pb-0">
										<div class="flex items-start gap-3">
											{#if esUbicacionPresencial(pu.ubicacion)}
												<span
													class="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 ring-1 ring-sky-100"
												>
													<Icon src={MapPin} class="h-4 w-4 text-sky-700" aria-hidden="true" />
												</span>
											{:else if esUbicacionVirtual(pu.ubicacion)}
												<span
													class="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-violet-50 ring-1 ring-violet-100"
												>
													<Icon src={GlobeAlt} class="h-4 w-4 text-violet-700" aria-hidden="true" />
												</span>
											{/if}

											<div class="min-w-0 flex-1">
												<div class="flex flex-wrap items-center gap-2">
													<span
														class="truncate text-sm font-semibold text-gray-900"
														title={capitalizar(pu.ubicacion?.tipo_ubicacion || 'Ubicación')}
													>
														{capitalizar(pu.ubicacion?.tipo_ubicacion || 'Ubicación')}
													</span>

													{#if esUbicacionPresencial(pu.ubicacion)}
														<span
															class="inline-flex shrink-0 items-center rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700 ring-1 ring-sky-100"
														>
															Presencial
														</span>
													{:else if esUbicacionVirtual(pu.ubicacion)}
														<span
															class="inline-flex shrink-0 items-center rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700 ring-1 ring-violet-100"
														>
															Virtual
														</span>
													{/if}
												</div>

												{#if esUbicacionPresencial(pu.ubicacion)}
													{@const dir = construirDireccionCompleta(pu.ubicacion)}
													<p class="mt-1 text-sm text-gray-700">
														{dir || 'Dirección no disponible'}
													</p>

													{#if generarUrlGoogleMaps(pu.ubicacion)}
														<a
															class="mt-1 inline-flex items-center gap-1 text-sm font-medium text-sky-700 hover:underline"
															href={generarUrlGoogleMaps(pu.ubicacion)!}
															target="_blank"
															rel="noopener noreferrer"
															aria-label="Ver en Google Maps"
														>
															<Icon src={Link} class="h-4 w-4" />
															Ver en Google Maps
														</a>
													{/if}
												{:else if esUbicacionVirtual(pu.ubicacion)}
													{#if pu.ubicacion.url_virtual}
														<a
															class="mt-1 inline-flex items-center gap-1 text-sm font-medium text-violet-700 hover:underline"
															href={pu.ubicacion.url_virtual}
															target="_blank"
															rel="noopener noreferrer"
															aria-label="Abrir enlace virtual"
														>
															<Icon src={Link} class="h-4 w-4" />
															Abrir enlace
														</a>
													{:else}
														<p class="mt-1 text-sm text-gray-500">Enlace virtual no especificado</p>
													{/if}
												{:else}
													<p class="mt-1 text-sm text-gray-500">
														Información de la ubicación no disponible
													</p>
												{/if}
											</div>
										</div>
									</li>
								{/each}
							</ul>
						{:else}
							<p class="text-sm text-gray-500">Este proyecto aún no tiene ubicaciones cargadas.</p>
						{/if}
					</section>

					<section
						class="rounded-2xl bg-white p-4 shadow-lg ring-1 ring-gray-100 sm:p-6"
						aria-label="Colaboradores aprobados"
					>
						<h3 class="mb-5 text-lg font-semibold text-gray-900">Colaboradores aprobados</h3>

						{#if colaboradoresAprobados.length}
							<ul class="space-y-3">
								{#each colaboradoresAprobados as colab (colab.id_colaboracion)}
									<li
										class="flex items-center justify-between gap-3 border-b border-gray-100 pb-2 last:border-b-0"
									>
										<span
											class="block flex-1 truncate text-sm text-gray-700"
											title={obtenerNombreColaborador(colab.colaborador)}
											>{obtenerNombreColaborador(colab.colaborador) +
												($usuario?.id_usuario === colab.colaborador?.id_usuario
													? ' (vos)'
													: '')}</span
										>
										<span
											class={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${clasesChipColaborador(colab.colaborador?.tipo_colaborador)}`}
											aria-label={`Tipo de colaborador: ${etiquetaTipoColaborador(colab.colaborador?.tipo_colaborador)}`}
										>
											{etiquetaTipoColaborador(colab.colaborador?.tipo_colaborador)}
										</span>
									</li>
								{/each}
							</ul>
						{:else}
							<p class="text-sm text-gray-500">No hay colaboradores aprobados.</p>
						{/if}
					</section>
				</div>
			</div>
		</div>

		<div
			class="fixed bottom-0 left-0 z-30 w-full border-t border-gray-200 bg-white p-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] supports-[padding-bottom:env(safe-area-inset-bottom)]:pb-[calc(env(safe-area-inset-bottom)+0.75rem)] lg:hidden"
		>
			<div class="flex gap-3">
				{#if esAdministrador}
					<!-- Dropdown móvil -->
					<div class="relative flex-1">
						<button
							type="button"
							on:click={() => (mostrarDropdownAdmin = !mostrarDropdownAdmin)}
							class="flex w-full items-center justify-between gap-2 whitespace-nowrap rounded-xl bg-slate-900 px-4 py-3 font-bold text-white shadow-lg transition active:scale-[0.98]"
						>
							Gestionar proyecto
							<Icon
								src={ChevronDown}
								class="h-5 w-5 shrink-0 transition-transform duration-200 {mostrarDropdownAdmin
									? 'rotate-180'
									: ''}"
							/>
						</button>

						{#if mostrarDropdownAdmin}
							<!-- Dropdown menu popup -->
							<div
								class="animate-in slide-in-from-bottom-5 absolute bottom-full left-0 right-0 mb-3 flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl ring-1 ring-black/5 duration-200"
							>
								<button
									class="flex w-full items-center gap-3 px-5 py-3.5 text-base font-medium text-gray-700 active:bg-gray-100"
								>
									<Icon src={Pencil} class="h-5 w-5 text-gray-500" />
									Editar proyecto
								</button>
								<button
									class="flex w-full items-center gap-3 px-5 py-3.5 text-base font-medium text-gray-700 active:bg-gray-100"
								>
									<Icon src={ShieldCheck} class="h-5 w-5 text-gray-500" />
									Auditar proyecto
								</button>
								<div class="my-1 border-t border-gray-100"></div>
								<button
									class="flex w-full items-center gap-3 px-5 py-3.5 text-base font-medium text-red-600 active:bg-red-50"
								>
									<Icon src={Trash} class="h-5 w-5 text-red-500" />
									Eliminar proyecto
								</button>
							</div>

							<!-- Backdrop -->
							<div
								class="fixed inset-0 z-[-1] bg-black/50"
								on:click={() => (mostrarDropdownAdmin = false)}
								aria-hidden="true"
							></div>
						{/if}
					</div>
				{:else if esCreador || esColaboradorAprobado}
					<a
						href={esCreador ? '/institucion' : '/colaborador'}
						class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-transparent bg-sky-100 px-4 py-3 font-bold text-sky-700 transition active:scale-[0.98]"
					>
						Ver panel
					</a>
				{:else if esSolicitudRechazada}
					<button
						type="button"
						on:click={() => (mostrarModalJustificacion = true)}
						class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-100 px-4 py-3 font-bold text-red-700 shadow-sm transition active:scale-[0.98]"
					>
						<Icon src={XCircle} class="h-5 w-5" />
						Solicitud rechazada
					</button>
				{:else}
					<button
						type="button"
						on:click={manejarClickSolicitud}
						disabled={estadoCodigo !== 'en_curso' || solicitudRecienEnviada}
						class={tieneSolicitudPendiente
							? 'flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-100 px-4 py-3 font-bold text-amber-700 shadow-sm transition active:scale-[0.98]'
							: 'flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 px-4 py-3 font-bold text-white shadow-lg transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:grayscale'}
					>
						{#if tieneSolicitudPendiente || solicitudRecienEnviada}
							<Icon src={Clock} class="h-5 w-5" />
							Solicitud enviada
						{:else}
							<Icon src={Heart} class="h-5 w-5" />
							Colaborar ahora
						{/if}
					</button>
				{/if}
				<button
					type="button"
					on:click={compartirProyecto}
					class="flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 hover:bg-gray-100 active:scale-[0.98]"
					aria-label="Compartir"
				>
					<Icon src={Share} class="h-5 w-5" />
				</button>
			</div>
		</div>
	</main>
{:else}
	<main class="min-h-screen bg-gray-50 pb-24 pt-10 text-gray-800">
		<div class="mx-auto w-full max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
			<p>Cargando proyecto...</p>
		</div>
	</main>
{/if}

<ModalColaboracion
	bind:open={mostrarModalColaborar}
	on:submit={() => {
		mostrarModalColaborar = false;
		mostrarModalExito = true;
		solicitudRecienEnviada = true;
	}}
/>

{#if mostrarModalExito}
	<!-- Overlay -->
	<div
		class="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-300"
		on:click={() => (mostrarModalExito = false)}
		aria-hidden="true"
	></div>

	<!-- Modal de solicitud enviada correctamente -->
	<div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
		<div
			class="pointer-events-auto relative mx-auto w-full max-w-sm scale-100 rounded-2xl bg-white opacity-100 shadow-2xl ring-1 ring-gray-200/60 backdrop-blur-xl transition-all duration-300"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-exito-titulo"
			tabindex="-1"
			on:click|stopPropagation
			on:keydown={(e) => {
				if (e.key === 'Escape') mostrarModalExito = false;
			}}
		>
			<div class="flex flex-col items-center gap-3 px-6 pb-4 pt-6 text-center">
				<span
					class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-100"
				>
					<Icon src={CheckCircle} class="h-6 w-6 text-emerald-600" aria-hidden="true" />
				</span>
				<h3 id="modal-exito-titulo" class="text-base font-semibold text-gray-900 sm:text-lg">
					¡Tu solicitud fue enviada correctamente!
				</h3>
			</div>

			<div class="flex items-center justify-center border-t border-gray-100 px-6 py-4">
				<button
					type="button"
					class="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
					on:click={() => (mostrarModalExito = false)}
				>
					Cerrar
				</button>
			</div>
		</div>
	</div>
{/if}

{#if mostrarModalJustificacion}
	<!-- Overlay -->
	<div
		class="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-300"
		on:click={() => (mostrarModalJustificacion = false)}
		aria-hidden="true"
	></div>

	<!-- Modal de justificación de rechazo -->
	<div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
		<div
			class="pointer-events-auto relative mx-auto w-full max-w-sm scale-100 rounded-2xl bg-white opacity-100 shadow-2xl ring-1 ring-gray-200/60 backdrop-blur-xl transition-all duration-300"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-justificacion-titulo"
			tabindex="-1"
			on:click|stopPropagation
			on:keydown={(e) => {
				if (e.key === 'Escape') mostrarModalJustificacion = false;
			}}
		>
			<div class="flex flex-col items-center gap-3 px-6 pb-4 pt-6 text-center">
				<span
					class="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 ring-1 ring-red-100"
				>
					<Icon src={XCircle} class="h-6 w-6 text-red-600" aria-hidden="true" />
				</span>
				<h3
					id="modal-justificacion-titulo"
					class="text-base font-semibold text-gray-900 sm:text-lg"
				>
					Solicitud rechazada
				</h3>
				<p class="text-sm text-gray-500">
					{colaboracionUsuario?.justificacion || 'No se proporcionó una justificación.'}
				</p>
			</div>

			<div class="flex items-center justify-center border-t border-gray-100 px-6 py-4">
				<button
					type="button"
					class="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
					on:click={() => (mostrarModalJustificacion = false)}
				>
					Cerrar
				</button>
			</div>
		</div>
	</div>
{/if}

{#if mostrarModalPendiente}
	<!-- Overlay -->
	<div
		class="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-300"
		on:click={() => (mostrarModalPendiente = false)}
		aria-hidden="true"
	></div>

	<!-- Modal de Solicitud Pendiente -->
	<div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
		<div
			class="pointer-events-auto relative mx-auto w-full max-w-sm scale-100 rounded-2xl bg-white opacity-100 shadow-2xl ring-1 ring-gray-200/60 backdrop-blur-xl transition-all duration-300"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-pendiente-titulo"
			tabindex="-1"
			on:click|stopPropagation
			on:keydown={(e) => {
				if (e.key === 'Escape') mostrarModalPendiente = false;
			}}
		>
			<div class="flex flex-col items-center gap-3 px-6 pb-4 pt-6 text-center">
				<span
					class="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 ring-1 ring-amber-100"
				>
					<Icon src={Clock} class="h-6 w-6 text-amber-600" aria-hidden="true" />
				</span>
				<h3 id="modal-pendiente-titulo" class="text-base font-semibold text-gray-900 sm:text-lg">
					Solicitud pendiente
				</h3>
				<div class="mt-2 w-full space-y-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
					<p class="font-medium text-gray-800">Mensaje enviado:</p>
					<p class="italic">
						"{colaboracionUsuario?.mensaje || 'Sin mensaje'}"
					</p>
				</div>
				<p class="text-xs text-gray-400">Tu solicitud está siendo revisada por la institución.</p>
			</div>

			<div class="flex items-center justify-center border-t border-gray-100 px-6 py-4">
				<button
					type="button"
					class="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
					on:click={() => (mostrarModalPendiente = false)}
				>
					Cerrar
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes fade-up {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fade-up {
		animation: fade-up 0.5s ease-out both;
	}
</style>
