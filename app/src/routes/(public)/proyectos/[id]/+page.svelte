<script lang="ts">
	import type { PageData } from './$types';
	import type { Proyecto } from '$lib/domain/types/Proyecto';
	import type { EstadoDescripcion } from '$lib/domain/types/Estado';
	import type { Colaboracion } from '$lib/domain/types/Colaboracion';
	import type { ParticipacionPermitida } from '$lib/domain/types/ParticipacionPermitida';
	import { PRIORIDAD_TIPO, type ProyectoUbicacion } from '$lib/domain/types/ProyectoUbicacion';
	import { setBreadcrumbs, BREADCRUMB_ROUTES } from '$lib/stores/breadcrumbs';
	import { page } from '$app/state';
	import {
		esUbicacionPresencial,
		esUbicacionVirtual,
		construirDireccionCompleta,
		generarUrlGoogleMaps
	} from '$lib/utils/util-proyectos';
	import { goto, pushState, invalidateAll } from '$app/navigation';
	import GestionarProyectoDropdown from '$lib/components/feature/proyectos/GestionarProyectoDropdown.svelte';

	let { data }: { data: PageData } = $props();

	import ProyectoHeader from '$lib/components/feature/proyectos/ProyectoHeader.svelte';
	import DetallesProyecto from '$lib/components/feature/proyectos/DetallesProyecto.svelte';
	import ProyectoProgreso from '$lib/components/feature/proyectos/ProyectoProgreso.svelte';
	import ModalColaboracion from '$lib/components/feature/proyectos/ModalColaboracion.svelte';
	import ProjectActionCard from '$lib/components/proyectos/ProjectActionCard.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import ResenaProyectoModal from '$lib/components/feature/proyectos/ResenaProyectoModal.svelte';
	import ResenaCard from '$lib/components/ui/cards/ResenaCard.svelte';
	import { getEstadoCodigo, estadoLabel } from '$lib/utils/util-estados';
	import { colaboracionesVisibles, obtenerNombreColaborador } from '$lib/utils/util-colaboraciones';
	import { obtenerUrlPerfil } from '$lib/utils/util-perfil';
	import { ordenarPorProgreso, calcularProgresoTotal } from '$lib/utils/util-progreso';
	import { layoutStore } from '$lib/stores/layout';
	import { usuario } from '$lib/stores/auth';
	import type { ColaboracionTipoParticipacion } from '$lib/domain/types/ColaboracionTipoParticipacion';
	import type { Resena } from '$lib/domain/types/Resena';
	import ModalReportarIrregularidad from '$lib/components/ui/ModalReportarIrregularidad.svelte';
	import Modal from '$lib/components/ui/overlays/Modal.svelte';
	import { toastStore } from '$lib/stores/toast';
	import { guardarReporteLog } from '$lib/utils/util-reportes';
	import { ChevronDown as ChevronDownIcon, FileText, Lightbulb, Loader2 } from 'lucide-svelte';

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
		ChevronDown,
		ChatBubbleLeftRight,
		ClipboardDocumentList,
		Photo,
		Flag,
		Plus,
		ClipboardDocumentCheck,
		Star
	} from '@steeze-ui/heroicons';

	let proyecto: Proyecto = $derived(data.proyecto);
	let colaboracionesActivas: Colaboracion[] = $derived(colaboracionesVisibles(proyecto?.colaboraciones ?? []));
	let participacionesOrdenadas: ParticipacionPermitida[] = $derived(ordenarPorProgreso(proyecto?.participacion_permitida ?? []));
	let ubicacionesOrdenadas: ProyectoUbicacion[] = $derived(ordenarUbicaciones(proyecto?.ubicaciones));
	
	let resenasProyecto: Resena[] = $state([]);
	let resenaAEliminar: Resena | null = $state(null);
	let mostrarModalResena = $state(false);
	let mostrarConfirmarEliminar = $state(false);
	const maxCaracteresResena = 500;

	let esCreador = $derived(!!$usuario && !!proyecto && $usuario.id_usuario === proyecto.institucion?.id_usuario);
	let colaboracionUsuario = $derived(
		$usuario && proyecto?.colaboraciones
			? proyecto.colaboraciones.find((c) => c.colaborador_id === $usuario?.id_usuario)
			: undefined
	);
	let misAportes: ColaboracionTipoParticipacion[] = $derived(colaboracionUsuario?.colaboraciones_tipo_participacion || []);

	let esColaboradorAprobado = $derived(colaboracionUsuario?.estado === 'aprobada');
	let esSolicitudRechazada = $derived(colaboracionUsuario?.estado === 'rechazada');
	let tieneSolicitudPendiente = $derived(colaboracionUsuario?.estado === 'pendiente');
	let tieneColaboracionAnulada = $derived(colaboracionUsuario?.estado === 'anulada');
	let esAdministrador = $derived($usuario?.rol === 'administrador');
	let esInstitucion = $derived($usuario?.rol === 'institucion');

	let resenaUsuarioActual = $derived(resenasProyecto.find((r) => r.autor_id === $usuario?.id_usuario));
	let tieneResenaUsuario = $derived(!!resenaUsuarioActual);

	$effect(() => {
		if (proyecto) {
			setBreadcrumbs([
				BREADCRUMB_ROUTES.proyectos,
				{ label: proyecto.titulo }
			]);
		}
	});

	function aFecha(fecha: string | Date | undefined | null): Date | null {
		if (!fecha) return null;
		const d = fecha instanceof Date ? fecha : new Date(fecha);
		return isNaN(d.getTime()) ? null : d;
	}

	function diasRestantes(fechaFin: string | Date | undefined | null): number {
		const fin = aFecha(fechaFin);
		if (!fin) return 0;

		const hoy = new Date();
		const baseHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()).getTime();

		let baseFin: number;
		if (fin.getUTCHours() === 0 && fin.getUTCMinutes() === 0) {
			baseFin = new Date(fin.getUTCFullYear(), fin.getUTCMonth(), fin.getUTCDate()).getTime();
		} else {
			baseFin = new Date(fin.getFullYear(), fin.getMonth(), fin.getDate()).getTime();
		}

		const diff = Math.ceil((baseFin - baseHoy) / 86_400_000);
		return Math.max(diff, 0);
	}

	function formatearFechaLocal(fecha: string | Date | undefined | null): string {
		if (!fecha) return 'Fecha no disponible';
		const d = aFecha(fecha);
		if (!d) return 'Fecha no disponible';

		const esMedianocheUTC = d.getUTCHours() === 0 && d.getUTCMinutes() === 0;

		if (esMedianocheUTC) {
			return d.toLocaleDateString('es-AR', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				timeZone: 'UTC'
			});
		}

		return d.toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' });
	}

	function clasesEstado(estado: EstadoDescripcion) {
		return (
			{
				borrador: 'text-slate-600 bg-slate-100',
				en_curso: 'text-green-600 bg-green-100',
				pendiente_solicitud_cierre: 'text-orange-600 bg-orange-100',
				en_revision: 'text-gray-600 bg-gray-100',
				en_auditoria: 'text-gray-600 bg-gray-100',
				completado: 'text-blue-600 bg-blue-100',
				cancelado: 'text-gray-600 bg-gray-100'
			}[estado] || 'text-gray-600 bg-gray-100'
		);
	}

	let estadoCodigo = $derived(proyecto ? getEstadoCodigo(proyecto.estado, proyecto.estado_id) : 'en_curso');
	let clasesChipEstado = $derived(clasesEstado(estadoCodigo));
	let puedeVerResenas = $derived(
		estadoCodigo === 'completado' || estadoCodigo === 'en_revision' || esCreador
	);
	let puedeRedactarResena = $derived((esCreador || esColaboradorAprobado) && estadoCodigo === 'en_revision');
	let puedeCrearResena = $derived(puedeRedactarResena && !tieneResenaUsuario);
	let mensajeResenaBloqueada = 'La reseña solo puede redactarse cuando el proyecto está en revisión.';
	let resumenTexto = $derived((proyecto?.resumen || '').trim());
	let aprendizajesTexto = $derived((proyecto?.aprendizajes || '').trim());
	let listadoAprendizajes = $derived((aprendizajesTexto || '')
		.split('\n')
		.map((l) => l.trim())
		.filter((l) => l.length > 0)
		.map((l) => l.replace(/^[-*•]\s*/, '')));

	let listadoResumen = $derived((resumenTexto || '')
		.split('. ')
		.map((s) => s.trim())
		.filter((s) => s.length > 0)
		.map((s) => (s.endsWith('.') ? s : s + '.')));

	let tieneResumenIA = $derived(Boolean(resumenTexto));
	let tieneAprendizajesIA = $derived(Boolean(aprendizajesTexto));
	let mostrarSeccionResumenIA = $derived(
		estadoCodigo === 'completado' && (tieneResumenIA || tieneAprendizajesIA)
	);
	let puedeVerAprendizajesIA = $derived(esCreador || esColaboradorAprobado);

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

	let colaboradoresAprobados = $derived((colaboracionesActivas ?? []).filter((c) => c.estado === 'aprobada'));

	let progresoTotal = $derived(proyecto ? calcularProgresoTotal(proyecto) : 0);
	let diasFaltantes = $derived(proyecto?.fecha_fin_tentativa ? diasRestantes(proyecto.fecha_fin_tentativa) : 999);
	let mostrarAccionFinalizar = $derived(
		esCreador &&
		estadoCodigo === 'en_curso' &&
		(progresoTotal >= 80 || diasFaltantes <= 0)
	);

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

	let mostrarModalColaborar = $state(false);
	let mostrarModalCancelar = $state(false);
	let justificacionCancelacion = $state('');
	let cancelando = $state(false);

	let mostrarModalCeseActividades = $state(false);
	let ceseActividades = $state(false);

	async function confirmarCeseActividades() {
		if (ceseActividades) return;
		ceseActividades = true;
		try {
			const res = await fetch(`/api/proyectos/${proyecto.id_proyecto}/solicitar-cierre`, {
				method: 'POST'
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.message || 'Error al finalizar actividades');
			}

			toastStore.show({
				variant: 'success',
				message: 'Actividades finalizadas. El proyecto está pendiente de solicitud de cierre.'
			});

			await invalidateAll();
		} catch (err: unknown) {
			const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
			toastStore.show({
				variant: 'error',
				message: errorMsg
			});
		} finally {
			ceseActividades = false;
			mostrarModalCeseActividades = false;
		}
	}

	async function confirmarCancelacion() {
		if (cancelando) return;
		cancelando = true;
		try {
			const res = await fetch(`/api/proyectos/${proyecto.id_proyecto}/cancelar`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ justificacion: justificacionCancelacion })
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.message || 'Error al cancelar el proyecto');
			}

			toastStore.show({
				variant: 'success',
				message: 'Proyecto cancelado exitosamente'
			});

			goto('/mi-panel');
		} catch (err: any) {
			toastStore.show({
				variant: 'error',
				message: err.message
			});
		} finally {
			cancelando = false;
			mostrarModalCancelar = false;
		}
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

	async function anularSolicitud() {
		mostrarModalAnular = true;
	}

	async function confirmarAnulacion() {
		if (!colaboracionUsuario?.id_colaboracion) return;

		anulando = true;
		try {
			const res = await fetch(`/api/colaboraciones/${colaboracionUsuario.id_colaboracion}`, {
				method: 'DELETE'
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.message || 'Error al anular la solicitud');
			}

			toastStore.show({
				variant: 'success',
				message: 'Solicitud anulada exitosamente'
			});

			await invalidateAll();

			mostrarModalAnular = false;
		} catch (err: unknown) {
			const error = err as Error;
			console.error('Error al anular solicitud:', error);
			toastStore.show({
				variant: 'error',
				message: error.message || 'Error al anular la solicitud'
			});
		} finally {
			anulando = false;
		}
	}

	function irAColaborar() {
		if (!$usuario) {
			goto('/iniciar-sesion');
			return;
		}
		mostrarModalColaborar = true;
	}

	function manejarClickSolicitud() {
		if (tieneSolicitudPendiente || solicitudRecienEnviada) {
			mostrarModalPendiente = true;
			return;
		}
		if (esSolicitudRechazada) {
			mostrarModalJustificacion = true;
			return;
		}
		irAColaborar();
	}

	let mostrarModalExito = $state(false);
	let mostrarModalJustificacion = $state(false);
	let mostrarModalPendiente = $state(false);
	let mostrarModalAnular = $state(false);
	let anulando = $state(false);
	let mostrarResumenIA = $state(false);
	let mostrarAprendizajesIA = $state(false);
	let mostrarMenuGestion = $state(false);
	let solicitudRecienEnviada = $state(false);

	let accionesMenu = $derived.by(() => {
		const acc: {
			label: string;
			icon: typeof CheckCircle;
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
			acc.push({ divider: true } as { label: string; icon: any; onclick: () => void; divider: boolean });
			acc.push({
				label: 'Cancelar proyecto',
				icon: XCircle,
				onclick: () => (mostrarModalCancelar = true),
				variant: 'danger'
			});

			return acc;
		}

		if (esCreador || esColaboradorAprobado) {
			acc.push({
				label: 'Ir al chat',
				icon: ChatBubbleLeftRight,
				onclick: () => goto(`/mensajes/${proyecto.id_proyecto}`)
			});

			if (esCreador) {
				acc.push({
					label: 'Solicitudes de colaboración',
					icon: ClipboardDocumentList,
					onclick: () =>
						goto(`/institucion/solicitudes-colaboracion?proyecto=${proyecto.id_proyecto}`)
				});
				if (estadoCodigo !== 'borrador' && estadoCodigo !== 'cancelado' && estadoCodigo !== 'en_curso') {
					acc.push({
						label: 'Solicitudes de cierre',
						icon: ClipboardDocumentCheck,
						onclick: () =>
							goto(`/institucion/proyectos/${proyecto.id_proyecto}/solicitudes-cierre`)
					});
				}
				if (estadoCodigo === 'pendiente_solicitud_cierre') {
					acc.push({
						label: 'Solicitar cierre',
						icon: CheckCircle,
						onclick: () =>
							goto(`/institucion/solicitar-cierre?proyecto=${proyecto.id_proyecto}`)
					});
				}
			} else {
				acc.push({
					label: 'Solicitudes de colaboración',
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

			acc.push({ divider: true } as { label: string; icon: any; onclick: () => void; divider: boolean });

			if (esCreador) {
				const esEditable = estadoCodigo === 'en_curso';

				if (estadoCodigo === 'en_curso') {
					acc.push({
						label: 'Editar proyecto',
						icon: Pencil,
						onclick: () => goto(`/proyectos/${proyecto.id_proyecto}/editar`),
						disabled: !esEditable
					});
				}

				const esCancelable = estadoCodigo === 'en_curso' && colaboradoresAprobados.length === 0;

				if (esCancelable) {
					acc.push({
						label: 'Cancelar proyecto',
						icon: XCircle,
						onclick: () => (mostrarModalCancelar = true),
						variant: 'danger'
					});
				}
			} else if (esColaboradorAprobado) {
				acc.push({
					label: 'Reportar irregularidad',
					icon: Flag,
					onclick: () => pushState('', { showReportModal: true }),
					variant: 'danger'
				});
			}
		}

		if (tieneSolicitudPendiente) {
			acc.push({
				label: 'Anular solicitud',
				icon: XCircle,
				onclick: anularSolicitud,
				variant: 'danger'
			});
		}

		return acc;
	});

	async function handleReportSuccess() {
		if ($usuario?.id_usuario && proyecto?.id_proyecto) {
			toastStore.show({
				variant: 'success',
				message:
					'Gracias por ayudarnos a mantener la comunidad segura. Un administrador revisará tu reporte.'
			});
			await invalidateAll();
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

	function abrirModalResena() {
		if (!puedeRedactarResena) {
			toastStore.show({
				variant: 'warning',
				message: mensajeResenaBloqueada
			});
			return;
		}
		if (tieneResenaUsuario) {
			return;
		}
		mostrarModalResena = true;
	}

	function solicitarEliminarResena(resena: Resena) {
		resenaAEliminar = resena;
		mostrarConfirmarEliminar = true;
	}

	async function confirmarEliminarResena() {
		if (resenaAEliminar?.id_resena) {
			try {
				const res = await fetch('/api/resenas', {
					method: 'DELETE',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id_resena: resenaAEliminar.id_resena })
				});

				if (!res.ok) {
					const data = await res.json();
					throw new Error(data.error || 'Error al eliminar reseña.');
				}

				resenasProyecto = resenasProyecto.filter((r) => r.id_resena !== resenaAEliminar?.id_resena);
				toastStore.show({
					variant: 'success',
					message: 'La reseña fue eliminada.'
				});
			} catch (err: any) {
				toastStore.show({ variant: 'error', message: err.message });
			}
		}
		resenaAEliminar = null;
		mostrarConfirmarEliminar = false;
	}

	function cancelarEliminarResena() {
		resenaAEliminar = null;
		mostrarConfirmarEliminar = false;
	}

	async function guardarResena({ contenido, puntaje }: { contenido: string; puntaje: number }) {
		if (!proyecto?.id_proyecto || !$usuario) return;

		if (tieneResenaUsuario) {
			toastStore.show({
				variant: 'warning',
				message: 'Ya dejaste una reseña.'
			});
			return;
		}

		try {
			const res = await fetch('/api/resenas', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					tipo_objeto: 'proyecto',
					id_objeto: proyecto.id_proyecto,
					contenido,
					puntaje
				})
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || 'Error al guardar reseña.');
			}
			const nuevaResena = await res.json();

			resenasProyecto = [nuevaResena, ...resenasProyecto];
			mostrarModalResena = false;
			toastStore.show({
				variant: 'success',
				message: 'Reseña publicada correctamente.'
			});
		} catch (err: any) {
			toastStore.show({ variant: 'error', message: err.message });
		}
	}

	$effect(() => {
		layoutStore.showStickyBottomBar();
		
		async function cargarResenas() {
			if (proyecto?.id_proyecto) {
				try {
					const res = await fetch(`/api/resenas?tipo_objeto=proyecto&id_objeto=${proyecto.id_proyecto}`);
					if (res.ok) {
						resenasProyecto = await res.json();
					}
				} catch (e) {
					console.error('Error cargando reseñas', e);
				}
			}
		}

		cargarResenas();

		return () => {
			layoutStore.hideStickyBottomBar();
		};
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
				<GestionarProyectoDropdown
					bind:isOpen={mostrarMenuGestion}
					{accionesMenu}
					{isMobile}
					esAdministrador={esAdministrador}
				/>
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
				<ProyectoHeader
					{proyecto}
					{esAdministrador}
					{esCreador}
					tieneReportePendiente={data.tieneReportePendiente ?? false}
				/>

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

							{#if mostrarAccionFinalizar}
								<ProjectActionCard
									title="Finalizá las actividades"
									description="El proyecto dejará de aceptar nuevos colaboradores. Podrás seguir subiendo evidencias antes del cierre formal."
									buttonLabel="Finalizar actividades"
									onClick={() => (mostrarModalCeseActividades = true)}
								/>
							{:else if esCreador && estadoCodigo === 'pendiente_solicitud_cierre'}
								<div
									class="mt-6 rounded-xl border border-sky-200 bg-sky-50 p-4 sm:p-5"
									role="region"
									aria-label="Solicitud de cierre"
								>
									<p class="text-sm font-semibold text-sky-900">¿Listo para cerrar el proyecto?</p>
									<p class="mt-1 text-sm text-sky-800">
										Enviá la solicitud de cierre con tus evidencias para que los colaboradores la
										revisen.
									</p>
									<a
										href={`/institucion/solicitar-cierre?proyecto=${proyecto.id_proyecto}`}
										class="mt-4 inline-flex items-center justify-center rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-sky-700 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:outline-none"
									>
										Solicitar cierre
									</a>
								</div>
							{/if}

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
										{#each misAportes as aporte (aporte.id_colaboracion_tipo_participacion || Math.random())}
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
									<div
										class="overflow-hidden rounded-xl border border-gray-200 transition-shadow hover:shadow-md"
									>
										<button
											type="button"
											class="flex w-full items-center justify-between gap-3 bg-white px-4 py-4 text-left transition hover:bg-gray-50"
											aria-expanded={mostrarResumenIA}
											onclick={() => (mostrarResumenIA = !mostrarResumenIA)}
										>
											<span class="flex items-center gap-2.5 text-base font-semibold text-gray-900">
												<FileText class="h-5 w-5 text-sky-600" />
												Resumen ejecutivo
											</span>
											<ChevronDownIcon
												class="h-5 w-5 text-gray-400 transition-transform {mostrarResumenIA
													? 'rotate-180'
													: ''}"
											/>
										</button>
										{#if mostrarResumenIA}
											<div class="border-t border-gray-100 bg-sky-50/30 px-4 pt-4 pb-6">
												<div class="space-y-4">
													{#each listadoResumen as parrafo (parrafo)}
														<p class="text-base leading-relaxed text-gray-700">
															{parrafo}
														</p>
													{/each}
													{#if listadoResumen.length === 0}
														<p class="text-sm text-gray-500 italic">
															El resumen aún no está disponible.
														</p>
													{/if}
												</div>
											</div>
										{/if}
									</div>

									{#if puedeVerAprendizajesIA}
										<div
											class="overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
										>
											<button
												type="button"
												class="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition hover:bg-gray-50"
												aria-expanded={mostrarAprendizajesIA}
												onclick={() => (mostrarAprendizajesIA = !mostrarAprendizajesIA)}
											>
												<span
													class="flex items-center gap-2.5 text-base font-semibold text-gray-900"
												>
													<Lightbulb class="h-5 w-5 text-amber-500" />
													Aprendizajes clave
												</span>
												<ChevronDownIcon
													class="h-5 w-5 text-gray-400 transition-transform {mostrarAprendizajesIA
														? 'rotate-180'
														: ''}"
												/>
											</button>
											{#if mostrarAprendizajesIA}
												<div class="border-t border-gray-100 bg-amber-50/30 px-4 pt-4 pb-6">
													{#if listadoAprendizajes.length > 0}
														<ul class="flex flex-col gap-4">
															{#each listadoAprendizajes as item (item)}
																<li class="flex gap-4">
																	<div class="relative mt-2 flex-shrink-0">
																		<div
																			class="flex h-2 w-2 items-center justify-center rounded-full bg-amber-400 ring-4 ring-amber-100"
																		></div>
																	</div>
																	<span class="text-base leading-relaxed text-gray-800">
																		{item}
																	</span>
																</li>
															{/each}
														</ul>
													{:else}
														<div class="flex flex-col items-center justify-center py-6 text-center">
															<span class="mb-2 rounded-full bg-gray-100 p-3">
																<Lightbulb class="h-6 w-6 text-gray-400" />
															</span>
															<p class="text-sm text-gray-500">
																No hay detalles adicionales disponibles por el momento.
															</p>
														</div>
													{/if}
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

						{#if puedeVerResenas}
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
													autor={resena.autor}
													onEliminar={resena.autor_id && resena.autor_id === $usuario?.id_usuario || esAdministrador
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
						{/if}
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
												<Icon src={XCircle} class="h-4 w-4" aria-hidden="true" />
												Solicitud rechazada
											</button>
										{:else if tieneColaboracionAnulada}
											<button
												type="button"
												disabled
												class="inline-flex h-11 flex-1 cursor-wait items-center justify-center gap-2 rounded-xl bg-orange-100 font-semibold text-orange-700 decoration-inherit opacity-80 shadow-sm focus-visible:outline-none active:translate-y-[1px]"
												aria-label="Solicitud anulada"
											>
												<Icon src={XCircle} class="h-4 w-4" aria-hidden="true" />
												Solicitud anulada
											</button>
										{:else}
											<button
												type="button"
												onclick={manejarClickSolicitud}
												disabled={estadoCodigo !== 'en_curso' || solicitudRecienEnviada}
												class={tieneSolicitudPendiente || solicitudRecienEnviada
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

											{#if tieneSolicitudPendiente && !solicitudRecienEnviada}
												<button
													type="button"
													onclick={anularSolicitud}
													class="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 shadow-sm transition hover:bg-red-100 active:translate-y-[1px]"
													title="Anular solicitud"
													aria-label="Anular solicitud"
												>
													<Icon src={XCircle} class="h-5 w-5" />
												</button>
											{/if}
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
											href="{obtenerUrlPerfil(
												proyecto.institucion
											)}?from=proyecto&proyecto={proyecto.id_proyecto}"
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
													href="{obtenerUrlPerfil(
														colab.colaborador
													)}?from=proyecto&proyecto={proyecto.id_proyecto}"
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
										disabled={data.tieneReportePendiente}
										onclick={() => pushState('', { showReportModal: true })}
										class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 disabled:opacity-75"
									>
										<Icon src={Flag} class="h-4 w-4" />
										{data.tieneReportePendiente ? 'Ya tenés un reporte pendiente' : 'Reportar irregularidad'}
									</button>
								</div>
							</section>
						{/if}
					</div>
				</div>
			</div>
			<!-- Modal de reporte interceptado (Shallow Routing) -->
			<ModalReportarIrregularidad
				open={!!page.state.showReportModal}
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
						{#if esSolicitudRechazada}
							<button
								type="button"
								onclick={() => (mostrarModalJustificacion = true)}
								class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-100 px-4 py-3 font-bold text-red-700 shadow-lg transition active:scale-[0.98]"
							>
								<Icon src={XCircle} class="h-5 w-5" aria-hidden="true" />
								Solicitud rechazada
							</button>
						{:else if tieneColaboracionAnulada}
							<button
								type="button"
								disabled
								class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-100 px-4 py-3 font-bold text-orange-700 opacity-80 shadow-lg"
							>
								<Icon src={XCircle} class="h-5 w-5" aria-hidden="true" />
								Solicitud anulada
							</button>
						{:else}
							<button
								type="button"
								onclick={manejarClickSolicitud}
								disabled={estadoCodigo !== 'en_curso' || solicitudRecienEnviada}
								class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 px-4 py-3 font-bold text-white shadow-lg transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale"
							>
								{#if tieneSolicitudPendiente || solicitudRecienEnviada}
									<Icon src={Clock} class="h-5 w-5" aria-hidden="true" />
									Solicitud enviada
								{:else}
									<Icon src={Heart} class="h-5 w-5" aria-hidden="true" />
									Colaborar ahora
								{/if}
							</button>

							{#if tieneSolicitudPendiente && !solicitudRecienEnviada}
								<button
									type="button"
									onclick={anularSolicitud}
									class="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 shadow-sm transition hover:bg-red-100 active:scale-[0.98]"
									aria-label="Anular solicitud"
								>
									<Icon src={XCircle} class="h-6 w-6" />
								</button>
							{/if}
						{/if}
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
		onsubmit={async ({ mensaje }) => {
			try {
				const res = await fetch('/api/colaboraciones', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						proyecto_id: proyecto.id_proyecto,
						mensaje
					})
				});

				const result = await res.json();

				if (!res.ok) {
					throw new Error(result.error || 'Error al enviar la solicitud');
				}

				mostrarModalColaborar = false;
				mostrarModalExito = true;
				solicitudRecienEnviada = true;

				// Actualizar el estado local para reflejar la solicitud pendiente
				if (proyecto.colaboraciones) {
					proyecto.colaboraciones = [...proyecto.colaboraciones, result];
				} else {
					proyecto.colaboraciones = [result];
				}

				toastStore.show({
					variant: 'success',
					message: '¡Tu solicitud fue enviada correctamente!'
				});
			} catch (err: any) {
				toastStore.show({
					variant: 'error',
					message: err.message
				});
			}
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

	{#if mostrarModalCancelar}
		<!-- Overlay -->
		<div
			class="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-300"
			onclick={() => (mostrarModalCancelar = false)}
			aria-hidden="true"
		></div>

		<!-- Modal de Cancelación -->
		<div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
			<div
				class="animate-fade-up pointer-events-auto relative mx-auto w-full max-w-md scale-100 rounded-2xl bg-white opacity-100 shadow-2xl ring-1 ring-gray-200/60 transition-all duration-300"
				role="dialog"
				aria-modal="true"
				aria-labelledby="modal-cancelar-titulo"
				tabindex="-1"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => {
					if (e.key === 'Escape') mostrarModalCancelar = false;
				}}
			>
				<div class="p-6">
					<div class="mb-4 flex items-center justify-center">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 ring-1 ring-red-100"
						>
							<Icon src={XCircle} class="h-6 w-6 text-red-600" aria-hidden="true" />
						</div>
					</div>
					<h3 id="modal-cancelar-titulo" class="mb-2 text-center text-xl font-bold text-gray-900">
						¿Cancelar proyecto?
					</h3>
					<p class="mb-6 text-center text-sm text-gray-600">
						{#if esAdministrador}
							Estás por cancelar este proyecto como administrador. Esta acción es permanente y
							notificará a las partes involucradas.
						{:else}
							Esta acción cancelará el proyecto de forma permanente. Solo podés hacerlo porque aún
							no hay colaboradores aprobados.
						{/if}
					</p>

					<div class="mb-6">
						<label for="justificacion-cancel" class="mb-2 block text-sm font-medium text-gray-700">
							Justificación (opcional)
						</label>
						<textarea
							id="justificacion-cancel"
							bind:value={justificacionCancelacion}
							placeholder="Explicá brevemente el motivo de la cancelación..."
							class="w-full rounded-xl border border-gray-200 p-3 text-sm transition-all outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
							rows="3"
						></textarea>
					</div>

					<div class="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
						<button
							type="button"
							class="flex-1 rounded-xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-200 sm:flex-none"
							onclick={() => (mostrarModalCancelar = false)}
						>
							No, mantener
						</button>
						<button
							type="button"
							disabled={cancelando}
							class="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50 sm:flex-none"
							onclick={confirmarCancelacion}
						>
							{cancelando ? 'Cancelando...' : 'Sí, cancelar proyecto'}
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}
{/if}

<!-- Modal de Anulación de Solicitud -->
{#if mostrarModalAnular}
	<div
		class="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-300"
		onclick={() => !anulando && (mostrarModalAnular = false)}
		aria-hidden="true"
	></div>

	<div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
		<div
			class="pointer-events-auto relative mx-auto w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200/60"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-anular-titulo"
			tabindex="-1"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => {
				if (e.key === 'Escape' && !anulando) mostrarModalAnular = false;
			}}
		>
			<div class="flex flex-col gap-4 px-6 pt-6 pb-4">
				<div class="flex justify-center">
					<div
						class="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 ring-8 ring-yellow-50"
					>
						<Icon src={Flag} class="h-8 w-8 text-yellow-600" aria-hidden="true" />
					</div>
				</div>
				<h3 id="modal-anular-titulo" class="text-center text-xl font-bold text-gray-900">
					¿Anular tu solicitud?
				</h3>
				<p class="text-center text-sm text-gray-600">
					Esta acción no se puede deshacer y <strong>no podrás volver a colaborar</strong> en este proyecto.
				</p>

				<div class="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
					<button
						type="button"
						disabled={anulando}
						class="flex-1 rounded-xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
						onclick={() => (mostrarModalAnular = false)}
					>
						Cancelar
					</button>
					<button
						type="button"
						disabled={anulando}
						class="flex-1 rounded-xl bg-yellow-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-yellow-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
						onclick={confirmarAnulacion}
					>
						{#if anulando}
							<span class="flex items-center justify-center gap-2">
								<Loader2 class="h-4 w-4 animate-spin" />
								Anulando...
							</span>
						{:else}
							Confirmar anulación
						{/if}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

	<ResenaProyectoModal
		mostrar={mostrarModalResena}
		modo="crear"
		resenaInicial={null}
		maxCaracteres={maxCaracteresResena}
		onguardar={guardarResena}
		oncerrar={() => (mostrarModalResena = false)}
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
{/if}

<!-- Modal de Cese de Actividades -->
<Modal
	bind:abierto={mostrarModalCeseActividades}
	titulo="Finalizar actividades"
	oncerrar={() => (mostrarModalCeseActividades = false)}
>
	<div class="space-y-6">
		<div class="flex flex-col items-center justify-center text-center">
			<div
				class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 ring-8 ring-blue-50/50"
			>
				<Icon src={CheckCircle} class="h-8 w-8 text-blue-600" />
			</div>
			<h3 class="text-xl font-bold text-gray-900">¿Finalizar las actividades?</h3>
			<p class="mt-2 text-sm text-gray-500">Estás a un paso de completar una gran etapa.</p>
		</div>

		<div class="rounded-2xl border border-sky-100 bg-sky-50/50 p-5">
			<h4 class="mb-3 flex items-center gap-2 text-sm font-bold text-sky-900">
				<Icon src={Clock} class="h-4 w-4" />
				¿Qué sucede al finalizar?
			</h4>
			<ul class="space-y-3 text-sm text-sky-800/80">
				<li class="flex gap-2">
					<span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400"></span>
					<span>El proyecto dejará de ser visible para nuevas postulaciones.</span>
				</li>
				<li class="flex gap-2">
					<span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400"></span>
					<span>Podrás subir fotos y documentos como evidencia del impacto.</span>
				</li>
			</ul>
		</div>

		<div class="rounded-xl border border-amber-100 bg-amber-50 p-4">
			<p class="text-xs leading-relaxed text-amber-800">
				<strong class="mb-1 block">Nota importante:</strong>
				Esta acción no cierra legalmente el proyecto, pero es necesaria para prepararlo para la auditoría
				y validación final de los colaboradores.
			</p>
		</div>
	</div>

	{#snippet footer()}
		<div class="flex flex-col-reverse gap-3 sm:flex-row">
			<Button
				label="Todavía no"
				variant="secondary"
				size="sm"
				customClass="flex-1"
				onclick={() => (mostrarModalCeseActividades = false)}
			/>
			<Button
				label="Sí, finalizar actividades"
				variant="primary"
				size="sm"
				customClass="flex-1"
				loading={ceseActividades}
				onclick={confirmarCeseActividades}
			/>
		</div>
	{/snippet}
</Modal>

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
