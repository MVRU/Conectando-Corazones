<script lang="ts">
	import type { Proyecto } from '$lib/domain/types/Proyecto';
	import type { EstadoDescripcion } from '$lib/domain/types/Estado';
	import type { Colaboracion } from '$lib/domain/types/Colaboracion';
	import type { ParticipacionPermitida } from '$lib/domain/types/ParticipacionPermitida';
	// import type { Resena } from '$lib/domain/types/Resena';
	import { PRIORIDAD_TIPO, type ProyectoUbicacion } from '$lib/domain/types/ProyectoUbicacion';
	import { setBreadcrumbs, BREADCRUMB_ROUTES } from '$lib/stores/breadcrumbs';
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	export let data: PageData;
	import {
		esUbicacionPresencial,
		esUbicacionVirtual,
		construirDireccionCompleta,
		generarUrlGoogleMaps
	} from '$lib/utils/util-proyectos';
	import { goto, pushState } from '$app/navigation';

	import ProyectoHeader from '$lib/components/feature/proyectos/ProyectoHeader.svelte';
	import DetallesProyecto from '$lib/components/feature/proyectos/DetallesProyecto.svelte';
	import ProyectoProgreso from '$lib/components/feature/proyectos/ProyectoProgreso.svelte';
	import ModalColaboracion from '$lib/components/feature/proyectos/ModalColaboracion.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	// import ResenaProyectoModal from '$lib/components/feature/proyectos/ResenaProyectoModal.svelte';
	// import ResenaCard from '$lib/components/ui/cards/ResenaCard.svelte';
	import { getEstadoCodigo, estadoLabel } from '$lib/utils/util-estados';
	import { colaboracionesVisibles, obtenerNombreColaborador } from '$lib/utils/util-colaboraciones';
	import { obtenerUrlPerfil } from '$lib/utils/util-perfil';
	import { ordenarPorProgreso } from '$lib/utils/util-progreso';
	import { layoutStore } from '$lib/stores/layout';
	import { usuario } from '$lib/stores/auth';
	// import { mockColaboraciones } from '$lib/infrastructure/mocks/mock-colaboraciones';
	// import { mockColaboracionTipoParticipacion } from '$lib/infrastructure/mocks/mock-colaboracion-tipo-participacion';
	// import { mockResenas } from '$lib/infrastructure/mocks/mock-resenas';
	import type { ColaboracionTipoParticipacion } from '$lib/domain/types/ColaboracionTipoParticipacion';
	import { onDestroy, onMount } from 'svelte';
	import ModalReportarIrregularidad from '$lib/components/ui/ModalReportarIrregularidad.svelte';
	import { toastStore } from '$lib/stores/toast';
	import { haReportado, guardarReporteLog } from '$lib/utils/util-reportes';
	import { ChevronDown as ChevronDownIcon, FileText, Lightbulb } from 'lucide-svelte';

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
		ChevronDown,
		ChatBubbleLeftRight,
		ClipboardDocumentList,
		Photo,
		LockClosed,
		Star,
		Flag,
		Plus,
		ClipboardDocumentCheck
	} from '@steeze-ui/heroicons';

	let proyecto: Proyecto;
	let colaboracionesActivas: Colaboracion[] = [];
	let participacionesOrdenadas: ParticipacionPermitida[] = [];
	let ubicacionesOrdenadas: ProyectoUbicacion[] = [];
	let misAportes: ColaboracionTipoParticipacion[] = [];
	// TODO: Falta implementar endpoint para obtener reseñas desde la DB
	// let resenasLocal: Resena[] = [...mockResenas];
	// let resenaEnEdicion: Resena | null = null;
	// let resenaAEliminar: Resena | null = null;
	// let mostrarModalResena = false;
	// let mostrarConfirmarEliminar = false;
	// let modoResena: 'crear' | 'editar' = 'crear';
	// const maxCaracteresResena = 500;

	$: colaboracionesActivas = colaboracionesVisibles(proyecto?.colaboraciones ?? []);
	$: participacionesOrdenadas = ordenarPorProgreso(proyecto?.participacion_permitida ?? []);

	$: esCreador = $usuario?.id_usuario === proyecto?.institucion?.id_usuario;
	$: colaboracionUsuario =
		$usuario && proyecto?.colaboraciones
			? proyecto.colaboraciones.find((c) => c.colaborador_id === $usuario?.id_usuario)
			: undefined;

	$: misAportes = [];
	// TODO: Implementar lógica para obtener aportes del colaborador desde la base de datos

	$: esColaboradorAprobado = colaboracionUsuario?.estado === 'aprobada';
	$: esSolicitudRechazada = colaboracionUsuario?.estado === 'rechazada';
	$: tieneSolicitudPendiente = colaboracionUsuario?.estado === 'pendiente';
	$: esAdministrador = $usuario?.rol === 'administrador';
	$: esInstitucion = $usuario?.rol === 'institucion';
	// $: puedeVerResenas = true;

	$: proyecto = data.proyecto;
	// $: resenasProyecto = resenasLocal.filter(
	// 	(r) => r.tipo_objeto === 'proyecto' && r.id_objeto === proyecto?.id_proyecto
	// );
	// $: resenaUsuarioActual = resenasProyecto.find((r) => r.username === $usuario?.username);
	// $: tieneResenaUsuario = Boolean(resenaUsuarioActual);

	$: if (proyecto) {
		setBreadcrumbs([
			BREADCRUMB_ROUTES.home,
			BREADCRUMB_ROUTES.proyectos,
			{ label: proyecto.titulo }
		]);
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
	// $: puedeRedactarResena = (esCreador || esColaboradorAprobado) && estadoCodigo === 'en_revision';
	// $: puedeCrearResena = puedeRedactarResena && !tieneResenaUsuario;
	// $: mensajeResenaBloqueada =
	// 	'La reseña solo puede redactarse cuando el proyecto está en revisión.';
	$: resumenTexto = (proyecto?.resumen || '').trim();
	$: aprendizajesTexto = (proyecto?.aprendizajes || '').trim();
	$: tieneResumenIA = Boolean(resumenTexto);
	$: tieneAprendizajesIA = Boolean(aprendizajesTexto);
	$: mostrarSeccionResumenIA =
		estadoCodigo === 'completado' && (tieneResumenIA || tieneAprendizajesIA);
	$: puedeVerAprendizajesIA = esCreador || esColaboradorAprobado;

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

	function esParticipacionEspecie(p: ParticipacionPermitida): boolean {
		return p.tipo_participacion?.descripcion === 'Especie';
	}

	function formatoUnidad(p: ParticipacionPermitida): string {
		if (p.unidad_medida === 'personas') return 'voluntarios';

		if (esParticipacionEspecie(p)) {
			const especie = p.especie || '';
			const unidad = p.unidad_medida || '';

			if (unidad.toLowerCase().includes('unidad')) {
				return especie;
			}
			return `${unidad} ${especie}`.trim();
		}

		return p.unidad_medida || '';
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
	let mostrarResumenIA = false;
	let mostrarAprendizajesIA = false;
	let mostrarMenuGestion = false;
	let solicitudRecienEnviada = false;

	$: accionesMenu = (() => {
		const acc: {
			label: string;
			icon: any;
			onclick: () => void;
			variant?: 'danger' | 'default';
			disabled?: boolean;
			divider?: boolean;
		}[] = [];
		if (!proyecto || !$usuario) return acc;

		if (esAdministrador) {
			acc.push({
				label: 'Editar proyecto',
				icon: Pencil,
				onclick: () => goto(`/proyectos/${proyecto.id_proyecto}/editar`)
			});
			acc.push({
				label: 'Auditar proyecto',
				icon: ShieldCheck,
				onclick: () => {}
			});
			acc.push({ divider: true } as any);
			acc.push({
				label: 'Eliminar proyecto',
				icon: Trash,
				onclick: () => {},
				variant: 'danger'
			});
			return acc;
		}

		if (esCreador || esColaboradorAprobado) {
			acc.push({
				label: 'Ir al chat',
				icon: ChatBubbleLeftRight,
				onclick: () => goto(`/chat?proyecto=${proyecto.id_proyecto}`)
			});

			if (esCreador) {
				acc.push({
					label: 'Ver solicitudes',
					icon: ClipboardDocumentList,
					onclick: () =>
						goto(`/institucion/solicitudes-colaboracion?proyecto=${proyecto.id_proyecto}`)
				});
			} else {
				acc.push({
					label: 'Ver solicitud',
					icon: ClipboardDocumentList,
					onclick: () =>
						goto(`/colaborador/solicitudes-colaboracion?proyecto=${proyecto.id_proyecto}`)
				});
			}

			if (esColaboradorAprobado) {
				if (estadoCodigo === 'en_curso' || estadoCodigo === 'pendiente_solicitud_cierre') {
					acc.push({
						label: 'Agregar aporte',
						icon: Plus,
						onclick: () => goto(`/colaborador/proyectos/${proyecto.id_proyecto}/mis-aportes/nuevo`)
					});
				}
				if (estadoCodigo === 'en_revision') {
					acc.push({
						label: 'Evaluar finalización',
						icon: ClipboardDocumentCheck,
						onclick: () => goto(`/colaborador/proyectos/${proyecto.id_proyecto}/evaluar-cierre`)
					});
				}
			}

			acc.push({
				label: 'Ver aportes y evidencias',
				icon: Photo,
				onclick: irAAportes
			});

			acc.push({ divider: true } as any);

			if (esCreador) {
				if (estadoCodigo === 'en_curso') {
					acc.push({
						label: 'Editar proyecto',
						icon: Pencil,
						onclick: () => goto(`/proyectos/${proyecto.id_proyecto}/editar`)
					});
				}
				acc.push({
					label: 'Cerrar proyecto',
					icon: LockClosed,
					onclick: () => goto(`/institucion/solicitar-cierre?proyecto=${proyecto.id_proyecto}`),
					variant: 'danger',
					disabled: estadoCodigo !== 'pendiente_solicitud_cierre'
				});
			} else if (esColaboradorAprobado) {
				acc.push({
					label: 'Reportar irregularidad',
					icon: Flag,
					onclick: () => pushState('', { showReportModal: true }),
					variant: 'danger'
				});
			}
		}

		return acc;
	})();

	function manejarClickSolicitud() {
		if (tieneSolicitudPendiente) {
			mostrarModalPendiente = true;
		} else {
			irAColaborar();
		}
	}

	let yaReporto = false;

	$: if ($usuario && proyecto?.id_proyecto) {
		yaReporto = haReportado($usuario.id_usuario, proyecto.id_proyecto);
	}

	function handleReportSuccess() {
		if ($usuario?.id_usuario && proyecto?.id_proyecto) {
			guardarReporteLog($usuario.id_usuario, proyecto.id_proyecto);
			yaReporto = true;
			toastStore.show({
				variant: 'success',
				message:
					'Gracias por ayudarnos a mantener la comunidad segura. Un administrador revisará tu reporte.'
			});
			history.back();
		}
	}

	function irAAportes() {
		if (esInstitucion && proyecto?.id_proyecto) {
			goto(`/institucion/proyectos/${proyecto.id_proyecto}/aportes`);
		} else if (esColaboradorAprobado && proyecto?.id_proyecto) {
			goto(`/colaborador/proyectos/${proyecto.id_proyecto}/mis-aportes`);
		}
	}

	// function abrirModalResena() {
	// 	if (!puedeRedactarResena) {
	// 		toastStore.show({
	// 			variant: 'warning',
	// 			message: mensajeResenaBloqueada
	// 		});
	// 		return;
	// 	}
	// 	if (resenaUsuarioActual) {
	// 		editarResena(resenaUsuarioActual);
	// 		return;
	// 	}
	// 	modoResena = 'crear';
	// 	resenaEnEdicion = null;
	// 	mostrarModalResena = true;
	// }

	// function editarResena(resena: Resena) {
	// 	if (!puedeRedactarResena) {
	// 		toastStore.show({
	// 			variant: 'warning',
	// 			message: mensajeResenaBloqueada
	// 		});
	// 		return;
	// 	}
	// 	modoResena = 'editar';
	// 	resenaEnEdicion = resena;
	// 	mostrarModalResena = true;
	// }

	// function solicitarEliminarResena(resena: Resena) {
	// 	resenaAEliminar = resena;
	// 	mostrarConfirmarEliminar = true;
	// }

	// function confirmarEliminarResena() {
	// 	if (resenaAEliminar?.id_resena) {
	// 		resenasLocal = resenasLocal.filter((r) => r.id_resena !== resenaAEliminar?.id_resena);
	// 		toastStore.show({
	// 			variant: 'success',
	// 			message: 'La reseña fue eliminada.'
	// 		});
	// 	}
	// 	resenaAEliminar = null;
	// 	mostrarConfirmarEliminar = false;
	// }

	// function cancelarEliminarResena() {
	// 	resenaAEliminar = null;
	// 	mostrarConfirmarEliminar = false;
	// }

	// function guardarResena(event: CustomEvent<{ contenido: string; puntaje: number }>) {
	// 	if (!proyecto?.id_proyecto || !$usuario) return;

	// 	if (modoResena === 'crear' && tieneResenaUsuario) {
	// 		toastStore.show({
	// 			variant: 'warning',
	// 			message: 'Ya dejaste una reseña. Podés editarla si necesitás cambiar algo.'
	// 		});
	// 		return;
	// 	}

	// 	if (modoResena === 'editar' && resenaEnEdicion?.id_resena) {
	// 		resenasLocal = resenasLocal.map((r) =>
	// 			r.id_resena === resenaEnEdicion?.id_resena
	// 				? { ...r, contenido: event.detail.contenido, puntaje: event.detail.puntaje }
	// 				: r
	// 		);
	// 		toastStore.show({
	// 			variant: 'success',
	// 			message: 'Reseña actualizada correctamente.'
	// 		});
	// 		return;
	// 	}

	// 	const nuevaResena: Resena = {
	// 		id_resena: Date.now(),
	// 		tipo_objeto: 'proyecto',
	// 		id_objeto: proyecto.id_proyecto,
	// 		contenido: event.detail.contenido,
	// 		puntaje: event.detail.puntaje,
	// 		username: $usuario.username,
	// 		rol: $usuario.rol,
	// 		aprobado: true
	// 	};
	// 	resenasLocal = [nuevaResena, ...resenasLocal];
	// 	toastStore.show({
	// 		variant: 'success',
	// 		message: 'Reseña publicada correctamente.'
	// 	});
	// }

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

{#if data.error || !proyecto}
	<div
		class="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:py-32"
	>
		<div class="mb-6 rounded-full bg-red-50 p-6 ring-1 ring-red-100">
			<Icon src={XCircle} class="h-16 w-16 text-red-600" />
		</div>
		<h1 class="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
			Algo salió mal
		</h1>
		<p class="mx-auto mb-10 max-w-xl text-lg text-gray-600">
			{data.error ||
				'No pudimos encontrar la información de este proyecto. Puede que el enlace sea incorrecto o el proyecto ya no esté disponible.'}
		</p>
		<div class="flex flex-wrap items-center justify-center gap-4">
			<Button label="Explorar proyectos" href="/proyectos" variant="secondary" size="md" />
			<Button label="Reintentar ahora" onclick={() => window.location.reload()} size="md" />
		</div>
	</div>
{:else}
	{#if proyecto}
		{#snippet MenuGestion(isMobile = false)}
			{#if accionesMenu.length > 0}
				<div class="relative flex-1">
					<button
						type="button"
						onclick={() => (mostrarMenuGestion = !mostrarMenuGestion)}
						class={esAdministrador
							? isMobile
								? 'flex w-full items-center justify-between gap-2 rounded-xl bg-slate-900 px-4 py-3 font-bold whitespace-nowrap text-white shadow-lg transition active:scale-[0.98]'
								: 'inline-flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-xl bg-slate-900 px-4 font-semibold whitespace-nowrap text-white shadow-[0_8px_24px_rgba(15,23,42,.35)] transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-[1px]'
							: isMobile
								? 'flex w-full items-center justify-between gap-2 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 px-4 py-3 font-bold whitespace-nowrap text-white shadow-lg transition active:scale-[0.98]'
								: 'inline-flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 px-4 font-semibold whitespace-nowrap text-white shadow-[0_8px_24px_rgba(2,132,199,.35)] transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-[1px]'}
						aria-expanded={mostrarMenuGestion}
						aria-haspopup="true"
					>
						<span>Gestionar proyecto</span>
						<Icon
							src={ChevronDown}
							class="h-4 w-4 shrink-0 transition-transform duration-200 {mostrarMenuGestion
								? 'rotate-180'
								: ''}"
						/>
					</button>

					{#if mostrarMenuGestion}
						<div
							class="animate-in {isMobile
								? 'slide-in-from-bottom-5 absolute bottom-full left-0 z-50 mb-3 flex w-max min-w-full text-left'
								: 'fade-in zoom-in-95 absolute top-full right-0 left-0 z-10 mt-2 flex'} flex-col overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl ring-1 ring-black/5 duration-100"
							role="menu"
							tabindex="-1"
						>
							{#each accionesMenu as accion}
								{#if accion.divider}
									<div class="my-1 border-t border-gray-100"></div>
								{:else}
									<button
										class="flex w-full items-center gap-3 px-4 py-2.5 {isMobile
											? 'text-base'
											: 'text-sm'} font-medium transition-colors {accion.variant === 'danger'
											? accion.disabled
												? 'cursor-not-allowed text-gray-400 opacity-50'
												: 'text-red-600 hover:bg-red-50'
											: 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'} {accion.disabled
											? 'cursor-not-allowed opacity-50'
											: ''}"
										role="menuitem"
										disabled={accion.disabled}
										onclick={() => {
											accion.onclick();
											mostrarMenuGestion = false;
										}}
									>
										<Icon
											src={accion.icon}
											class="{isMobile ? 'h-5 w-5' : 'h-4 w-4'} {accion.variant === 'danger'
												? accion.disabled
													? 'text-gray-400'
													: 'text-red-500'
												: 'text-gray-500'}"
										/>
										{accion.label}
									</button>
								{/if}
							{/each}
						</div>

						<div
							class="fixed inset-0 z-[-1] {isMobile ? 'bg-black/50' : ''}"
							onclick={() => (mostrarMenuGestion = false)}
							aria-hidden="true"
						></div>
					{/if}
				</div>
			{/if}
		{/snippet}
		<main
			class="min-h-screen pt-6 pb-24 text-gray-800 sm:pt-10 {esAdministrador
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

			{#if estadoCodigo === 'en_auditoria' && !esAdministrador}
				<div
					class="sticky z-40 -mt-6 mb-6 flex w-full items-center justify-center bg-purple-800 px-4 py-3 text-center text-sm font-medium text-purple-50 shadow-md transition-all duration-500 sm:-mt-10 sm:mb-10 {$layoutStore.headerVisible
						? 'top-[4.5rem]'
						: 'top-0'}"
					role="alert"
				>
					<p>
						Este proyecto se encuentra bajo revisión administrativa tras detectarse posibles
						irregularidades. Estamos trabajando para garantizar la transparencia y seguridad de
						nuestra comunidad. Agradecemos su comprensión.
					</p>
				</div>
			{/if}

			<div
				class="animate-fade-up mx-auto w-full max-w-7xl space-y-6 px-4 sm:space-y-12 sm:px-6 lg:px-8"
			>
				<ProyectoHeader {proyecto} {esAdministrador} {esCreador} />

				<div class="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-10">
					<!-- Columna principal -->
					<div class="animate-fade-up order-2 space-y-6 sm:space-y-10 lg:order-1 lg:col-span-2">
						<section
							class="rounded-xl border border-gray-200 bg-white p-4 shadow transition-shadow hover:shadow-lg sm:p-6"
							aria-labelledby="titulo-progreso"
						>
							<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
								<h2 id="titulo-progreso" class="text-xl font-semibold sm:text-2xl">
									Progreso del proyecto
								</h2>
								{#if esCreador && (estadoCodigo === 'en_curso' || estadoCodigo === 'pendiente_solicitud_cierre')}
									<!-- TODO: implementar función para actualizar el progreso de un proyecto -->
									<a
										href={`/proyectos/${proyecto.id_proyecto}`}
										class="inline-flex items-center gap-2 rounded-lg bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:bg-sky-100 focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 focus-visible:outline-none"
									>
										<Icon src={Pencil} class="h-4 w-4" />
										Actualizar progreso
									</a>
								{/if}
							</div>

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
										<div
											class="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600 md:mt-0"
										>
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
															: `${p.actual || 0} / ${p.objetivo} ${formatoUnidad(p)}`}
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

						{#if esColaboradorAprobado}
							<section
								class="rounded-xl border border-gray-200 bg-white p-4 shadow transition-shadow hover:shadow-lg sm:p-6"
								aria-labelledby="titulo-mis-aportes"
							>
								<h2 id="titulo-mis-aportes" class="mb-4 text-xl font-semibold sm:text-2xl">
									Mis aportes
								</h2>

								{#if misAportes.length > 0}
									<ul class="space-y-3">
										{#each misAportes as aporte}
											<li
												class="flex items-center justify-between rounded-lg border border-gray-100 p-3"
											>
												<span class="font-medium text-gray-700">
													{aporte.participacion_permitida?.tipo_participacion?.descripcion ||
														'Aporte'}
													{#if aporte.participacion_permitida?.especie}
														({aporte.participacion_permitida.especie})
													{/if}
												</span>
												<span class="font-semibold text-gray-900">
													{#if aporte.participacion_permitida && esParticipacionMonetaria(aporte.participacion_permitida)}
														$
													{/if}
													{formatoNumero(aporte.cantidad)}
													{aporte.participacion_permitida?.unidad_medida}
												</span>
											</li>
										{/each}
									</ul>
								{:else}
									<p class="text-gray-500">Aún no registraste aportes específicos.</p>
								{/if}
							</section>
						{/if}

						{#if mostrarSeccionResumenIA}
							<section
								class="rounded-xl border border-gray-200 bg-white p-4 shadow transition-shadow hover:shadow-lg sm:p-6"
								aria-labelledby="titulo-resumen-ia"
							>
								<div class="mb-4">
									<h2 id="titulo-resumen-ia" class="text-xl font-semibold sm:text-2xl">
										Resumen y aprendizajes
									</h2>
									<p class="mt-2 text-sm text-gray-600">
										El resumen es público. Los aprendizajes solo están disponibles para quienes
										participaron del proyecto.
									</p>
								</div>

								<div class="space-y-3">
									<div class="overflow-hidden rounded-xl border border-gray-200">
										<button
											type="button"
											class="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-gray-50"
											aria-expanded={mostrarResumenIA}
											onclick={() => (mostrarResumenIA = !mostrarResumenIA)}
										>
											<span class="flex items-center gap-2 text-sm font-semibold text-gray-900">
												<FileText class="h-4 w-4 text-sky-600" />
												Resumen ejecutivo
											</span>
											<ChevronDownIcon
												class="h-4 w-4 text-gray-400 transition-transform {mostrarResumenIA
													? 'rotate-180'
													: ''}"
											/>
										</button>
										{#if mostrarResumenIA}
											<div class="px-4 pb-4 text-sm whitespace-pre-line text-gray-700">
												{resumenTexto || 'El resumen aún no está disponible.'}
											</div>
										{/if}
									</div>

									{#if puedeVerAprendizajesIA}
										<div class="overflow-hidden rounded-xl border border-gray-200">
											<button
												type="button"
												class="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-gray-50"
												aria-expanded={mostrarAprendizajesIA}
												onclick={() => (mostrarAprendizajesIA = !mostrarAprendizajesIA)}
											>
												<span class="flex items-center gap-2 text-sm font-semibold text-gray-900">
													<Lightbulb class="h-4 w-4 text-amber-500" />
													Aprendizajes
												</span>
												<ChevronDownIcon
													class="h-4 w-4 text-gray-400 transition-transform {mostrarAprendizajesIA
														? 'rotate-180'
														: ''}"
												/>
											</button>
											{#if mostrarAprendizajesIA}
												<div class="px-4 pb-4 text-sm whitespace-pre-line text-gray-700">
													{aprendizajesTexto || 'Los aprendizajes aún no están disponibles.'}
												</div>
											{/if}
										</div>
									{/if}
								</div>
							</section>
						{/if}
						<section
							class="rounded-xl border border-gray-200 bg-white p-4 shadow transition-shadow hover:shadow-lg sm:p-6"
							aria-label="Detalles del proyecto"
						>
							<DetallesProyecto {proyecto} formatearFecha={formatearFechaLocal} />
						</section>

						<!-- {#if puedeVerResenas}
							<section
								class="rounded-xl border border-gray-200 bg-white p-4 shadow transition-shadow hover:shadow-lg sm:p-6"
								aria-labelledby="titulo-resenas-proyecto"
							>
								<div class="flex flex-wrap items-start justify-between gap-4">
									<div>
										<h2 id="titulo-resenas-proyecto" class="text-xl font-semibold sm:text-2xl">
											Reseñas
										</h2>
										<p class="mt-2 text-sm text-gray-600">
											{#if puedeRedactarResena && !tieneResenaUsuario}
												Compartí tu experiencia y ayudá a mejorar futuros proyectos.
											{:else if tieneResenaUsuario}
												Ya publicaste tu reseña. Podés editarla o eliminarla si necesitás cambios.
											{:else if esCreador || esColaboradorAprobado}
												{mensajeResenaBloqueada}
											{:else}
												Las reseñas son públicas para toda la comunidad.
											{/if}
										</p>
									</div>
									<button
										type="button"
										onclick={abrirModalResena}
										disabled={!puedeCrearResena}
										class="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
									>
										<Icon src={Star} class="h-4 w-4" />
										{tieneResenaUsuario ? 'Reseña publicada' : 'Redactar reseña'}
									</button>
								</div>

								{#if resenasProyecto.length}
									<div class="mt-6 grid gap-5 md:grid-cols-2">
										{#each resenasProyecto as resena (resena.id_resena || resena.contenido)}
											<div class="flex h-full flex-col gap-3">
												<ResenaCard
													{resena}
													onEditar={resena.username && resena.username === $usuario?.username
														? () => editarResena(resena)
														: null}
													onEliminar={resena.username && resena.username === $usuario?.username
														? () => solicitarEliminarResena(resena)
														: null}
												/>
											</div>
										{/each}
									</div>
								{:else}
									<div class="mt-6 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
										Todavía no hay reseñas para este proyecto.
									</div>
								{/if}
							</section>
						{/if} -->
					</div>

					<!-- Columna lateral -->
					<div class="animate-fade-up order-1 space-y-6 lg:order-2" style="animation-delay: 100ms">
						<div
							class="hidden lg:sticky lg:top-6 lg:z-[1] lg:block lg:rounded-2xl lg:bg-white/60 lg:p-1 lg:backdrop-blur lg:supports-[backdrop-filter]:bg-white/40"
							role="group"
							aria-label="Acciones principales del proyecto"
						>
							<div class="flex flex-col gap-3 p-3">
								<div class="flex gap-3">
									{#if esAdministrador || esCreador || esColaboradorAprobado}
										{@render MenuGestion(false)}
									{:else if !esInstitucion}
										{#if esSolicitudRechazada}
											<button
												type="button"
												onclick={() => (mostrarModalJustificacion = true)}
												class="inline-flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-100 font-semibold text-red-700 shadow-sm transition hover:bg-red-200 focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-[1px]"
												aria-label="Ver motivo del rechazo"
											>
												Solicitud rechazada
											</button>
										{:else}
											<button
												type="button"
												onclick={manejarClickSolicitud}
												disabled={(estadoCodigo !== 'en_curso' &&
													estadoCodigo !== 'pendiente_solicitud_cierre') ||
													solicitudRecienEnviada}
												class={tieneSolicitudPendiente
													? 'inline-flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-100 font-semibold text-amber-700 shadow-sm transition hover:bg-amber-200 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-[1px]'
													: 'inline-flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 font-semibold text-white shadow-[0_8px_24px_rgba(2,132,199,.35)] transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:grayscale'}
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
										onclick={compartirProyecto}
										class="inline-flex h-11 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-[1px]"
										aria-label="Compartir este proyecto"
									>
										<Icon src={Share} class="h-4 w-4" aria-hidden="true" />
									</button>
								</div>

								<p class="pt-1 text-center text-xs text-gray-500">
									Tu ayuda se refleja en tiempo real en el progreso del proyecto.
								</p>
							</div>
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
									{#if obtenerUrlPerfil(proyecto.institucion)}
										<a
											href={obtenerUrlPerfil(proyecto.institucion)}
											class="flex min-w-0 flex-1 items-center gap-3 transition-opacity hover:opacity-80"
										>
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
													class="block truncate text-sm font-medium text-gray-900 hover:text-blue-600"
													title={proyecto.institucion?.nombre_legal || 'Institución organizadora'}
													aria-label="Institución organizadora"
												>
													{proyecto.institucion?.nombre_legal || 'Institución organizadora'}
												</span>
												<div class="mt-1">
													<span
														class="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-100"
													>
														{proyecto.institucion?.tipo_institucion || 'Institución'}
													</span>
												</div>
											</div>
										</a>
									{:else}
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
													{proyecto.institucion?.nombre_legal || 'Institución organizadora'}
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
									{/if}
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
														<Icon
															src={GlobeAlt}
															class="h-4 w-4 text-violet-700"
															aria-hidden="true"
														/>
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
															<p class="mt-1 text-sm text-gray-500">
																Enlace virtual no especificado
															</p>
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
								<p class="text-sm text-gray-500">
									Este proyecto aún no tiene ubicaciones cargadas.
								</p>
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
											{#if obtenerUrlPerfil(colab.colaborador)}
												<a
													href={obtenerUrlPerfil(colab.colaborador)}
													class="block flex-1 truncate text-sm text-gray-700 transition-colors hover:text-blue-600 hover:underline"
													title={obtenerNombreColaborador(colab.colaborador)}
												>
													{obtenerNombreColaborador(colab.colaborador)}
												</a>
											{:else}
												<span
													class="block flex-1 truncate text-sm text-gray-700"
													title={obtenerNombreColaborador(colab.colaborador)}
												>
													{obtenerNombreColaborador(colab.colaborador)}
												</span>
											{/if}
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
						{#if $usuario}
							<section
								class="rounded-xl border border-gray-200 bg-white p-4 shadow sm:p-6"
								aria-label="Reportar irregularidad"
							>
								<div class="flex flex-col gap-3">
									<p class="text-center text-sm font-medium text-gray-700">
										¿Hay algún problema con este proyecto?
									</p>
									<button
										type="button"
										disabled={yaReporto}
										onclick={() => pushState('', { showReportModal: true })}
										class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 disabled:opacity-75"
									>
										<Icon src={Flag} class="h-4 w-4" />
										{yaReporto ? 'Ya tenés un reporte pendiente' : 'Reportar irregularidad'}
									</button>
								</div>
							</section>
						{/if}
					</div>
				</div>
			</div>
			<!-- Modal de reporte interceptado (Shallow Routing) -->
			<ModalReportarIrregularidad
				open={!!$page.state.showReportModal}
				tipo_objeto="Proyecto"
				id_objeto={proyecto.id_proyecto ?? 0}
				nombre_objeto={proyecto.titulo}
				onclose={() => history.back()}
				onsuccess={handleReportSuccess}
			/>

			<div
				class="fixed bottom-0 left-0 z-30 w-full border-t border-gray-200 bg-white p-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] supports-[padding-bottom:env(safe-area-inset-bottom)]:pb-[calc(env(safe-area-inset-bottom)+0.75rem)] lg:hidden"
			>
				<div class="flex gap-3">
					{#if esAdministrador || esCreador || esColaboradorAprobado}
						{@render MenuGestion(true)}
					{:else if !esInstitucion}
						<button
							type="button"
							onclick={manejarClickSolicitud}
							class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 px-4 py-3 font-bold text-white shadow-lg transition active:scale-[0.98]"
						>
							<Icon src={Heart} class="h-5 w-5" />
							Colaborar ahora
						</button>
					{/if}
					<button
						type="button"
						onclick={compartirProyecto}
						class="flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 hover:bg-gray-100 active:scale-[0.98]"
						aria-label="Compartir"
					>
						<Icon src={Share} class="h-5 w-5" />
					</button>
				</div>
			</div>
		</main>
	{:else}
		<main class="min-h-screen bg-gray-50 pt-10 pb-24 text-gray-800">
			<div class="mx-auto w-full max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
				<p>Cargando proyecto...</p>
			</div>
		</main>
	{/if}

	<ModalColaboracion
		bind:open={mostrarModalColaborar}
		onsubmit={() => {
			mostrarModalColaborar = false;
			mostrarModalExito = true;
			solicitudRecienEnviada = true;
		}}
	/>

	{#if mostrarModalExito}
		<!-- Overlay -->
		<div
			class="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-300"
			onclick={() => (mostrarModalExito = false)}
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
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => {
					if (e.key === 'Escape') mostrarModalExito = false;
				}}
			>
				<div class="flex flex-col items-center gap-3 px-6 pt-6 pb-4 text-center">
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
						class="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-gray-300 focus:outline-none"
						onclick={() => (mostrarModalExito = false)}
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
			onclick={() => (mostrarModalJustificacion = false)}
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
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => {
					if (e.key === 'Escape') mostrarModalJustificacion = false;
				}}
			>
				<div class="flex flex-col items-center gap-3 px-6 pt-6 pb-4 text-center">
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
						class="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-gray-300 focus:outline-none"
						onclick={() => (mostrarModalJustificacion = false)}
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
			onclick={() => (mostrarModalPendiente = false)}
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
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => {
					if (e.key === 'Escape') mostrarModalPendiente = false;
				}}
			>
				<div class="flex flex-col items-center gap-3 px-6 pt-6 pb-4 text-center">
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
						class="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-gray-300 focus:outline-none"
						onclick={() => (mostrarModalPendiente = false)}
					>
						Cerrar
					</button>
				</div>
			</div>
		</div>
	{/if}
{/if}

<!-- <ResenaProyectoModal
	mostrar={mostrarModalResena}
	modo={modoResena}
	resenaInicial={resenaEnEdicion}
	maxCaracteres={maxCaracteresResena}
	on:guardar={guardarResena}
	on:cerrar={() => (mostrarModalResena = false)}
/>

{#if mostrarConfirmarEliminar}
	
	<div
		class="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-300"
		onclick={cancelarEliminarResena}
		aria-hidden="true"
	></div>

	
	<div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
		<div
			class="pointer-events-auto relative mx-auto w-full max-w-sm rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200/60"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-eliminar-resena-titulo"
			tabindex="-1"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => {
				if (e.key === 'Escape') cancelarEliminarResena();
			}}
		>
			<div class="flex flex-col gap-3 px-6 pt-6 pb-4 text-center">
				<h3
					id="modal-eliminar-resena-titulo"
					class="text-base font-semibold text-gray-900 sm:text-lg"
				>
					¿Eliminar reseña?
				</h3>
				<p class="text-sm text-gray-500">Esta acción no se puede deshacer.</p>
			</div>

			<div class="flex items-center justify-center gap-3 border-t border-gray-100 px-6 py-4">
				<button
					type="button"
					class="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-gray-300 focus:outline-none"
					onclick={cancelarEliminarResena}
				>
					Cancelar
				</button>
				<button
					type="button"
					class="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-300 focus:outline-none"
					onclick={confirmarEliminarResena}
				>
					Eliminar
				</button>
			</div>
		</div>
	</div>
{/if} -->

<ResenaProyectoModal
	mostrar={mostrarModalResena}
	modo={modoResena}
	resenaInicial={resenaEnEdicion}
	maxCaracteres={maxCaracteresResena}
	on:guardar={guardarResena}
	on:cerrar={() => (mostrarModalResena = false)}
/>

{#if mostrarConfirmarEliminar}
	<!-- Overlay -->
	<div
		class="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-300"
		onclick={cancelarEliminarResena}
		aria-hidden="true"
	></div>

	<!-- Modal de confirmación de eliminación -->
	<div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
		<div
			class="pointer-events-auto relative mx-auto w-full max-w-sm rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200/60"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-eliminar-resena-titulo"
			tabindex="-1"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => {
				if (e.key === 'Escape') cancelarEliminarResena();
			}}
		>
			<div class="flex flex-col gap-3 px-6 pt-6 pb-4 text-center">
				<h3
					id="modal-eliminar-resena-titulo"
					class="text-base font-semibold text-gray-900 sm:text-lg"
				>
					¿Eliminar reseña?
				</h3>
				<p class="text-sm text-gray-500">
					Esta acción no se puede deshacer.
				</p>
			</div>

			<div class="flex items-center justify-center gap-3 border-t border-gray-100 px-6 py-4">
				<button
					type="button"
					class="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-gray-300 focus:outline-none"
					onclick={cancelarEliminarResena}
				>
					Cancelar
				</button>
				<button
					type="button"
					class="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-300 focus:outline-none"
					onclick={confirmarEliminarResena}
				>
					Eliminar
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
