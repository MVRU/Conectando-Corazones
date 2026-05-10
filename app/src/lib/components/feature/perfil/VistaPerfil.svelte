<script lang="ts">
	import { usuario as usuarioStore, isAuthenticated, authActions, isAdmin } from '$lib/stores/auth';
	import { invalidateAll } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import ModalReportarIrregularidad from '$lib/components/ui/ModalReportarIrregularidad.svelte';
	import ResenaModal from '$lib/components/ui/modals/ResenaModal.svelte';
	import EditarCategoriasModal from '$lib/components/ui/modals/EditarCategoriasModal.svelte';
	import EditarTiposParticipacionModal from '$lib/components/ui/modals/EditarTiposParticipacionModal.svelte';
	import type { Resena } from '$lib/domain/types/Resena';
	import type { Categoria } from '$lib/domain/types/Categoria';
	import type { TipoParticipacion } from '$lib/domain/types/TipoParticipacion';
	import type {
		Usuario,
		Institucion,
		Organizacion,
		Unipersonal,
		Administrador
	} from '$lib/domain/types/Usuario';

	type UsuarioCompleto = Usuario | Institucion | Organizacion | Unipersonal | Administrador;
	import { obtenerPlaceholderResena, obtenerTituloResena } from '$lib/utils/resenas';
	import { puedeVerContactos, puedeDejarResena } from '$lib/utils/util-perfil';
	import PerfilHeader from './PerfilHeader.svelte';
	import PerfilInfoContacto from './PerfilInfoContacto.svelte';
	import PerfilSeccionCategorias from './PerfilSeccionCategorias.svelte';
	import PerfilSeccionTiposParticipacion from './PerfilSeccionTiposParticipacion.svelte';
	import PerfilSeccionProyectos from './PerfilSeccionProyectos.svelte';
	import PerfilSeccionResenas from './PerfilSeccionResenas.svelte';
	import ModalEditarPerfil from '$lib/components/ui/modals/ModalEditarPerfil.svelte';
	import { usePerfilModales } from '$lib/stores/perfilModales';
	import { usePerfilEdicion } from '$lib/stores/perfilEdicion';
	import { toastStore } from '$lib/stores/toast';
	import { determinarEstadoVerificacion } from '$lib/utils/util-verificacion';
	import type { Proyecto } from '$lib/domain/types/Proyecto';
	import type { EditarPerfilForm } from '$lib/domain/types/forms/EditarPerfilForm';
	import { Settings, Flag, ShieldAlert, BarChart3, ShieldCheck } from 'lucide-svelte';

	let {
		perfilUsuario,
		esMiPerfil,
		proyectos = [],
		resenas = [],
		categorias = [],
		tiposParticipacion = []
	} = $props<{
		perfilUsuario: UsuarioCompleto;
		esMiPerfil: boolean;
		proyectos: Proyecto[];
		resenas: Resena[];
		categorias: Categoria[];
		tiposParticipacion: TipoParticipacion[];
	}>();

	let tabActiva = $state<'info' | 'proyectos' | 'resenas'>('info');
	let montado = $state(false);

	$effect(() => {
		const t = setTimeout(() => (montado = true), 50);
		return () => clearTimeout(t);
	});

	let puedeVerContactosPerfil = $derived(
		puedeVerContactos($usuarioStore, perfilUsuario, proyectos)
	);
	let puedeResenar = $derived(puedeDejarResena($usuarioStore, perfilUsuario, proyectos));
	let listaResenas = $state<Resena[]>([]);

	$effect(() => {
		listaResenas = resenas; // Sincronización reactiva
	});

	let resenaAEliminar: Resena | null = $state(null);
	let mostrarConfirmarEliminar = $state(false);

	let yaResenoUsuario = $derived(
		$usuarioStore && !esMiPerfil
			? listaResenas.some(
					(r) =>
						r.username === ($usuarioStore.username || '') &&
						r.id_objeto === perfilUsuario.id_usuario &&
						r.tipo_objeto === 'usuario'
				)
			: false
	);

	let reseñasUsuario = $derived(
		listaResenas.filter(
			(r) => r.id_objeto === perfilUsuario.id_usuario && r.tipo_objeto === 'usuario'
		)
	);

	let verificacionesUsuario = $derived(
		((perfilUsuario as Record<string, unknown>).verificaciones as unknown[]) || []
	);
	let estadoVerificacion = $derived(
		determinarEstadoVerificacion(verificacionesUsuario as never, perfilUsuario)
	);
	let tieneSolicitudVerificacion = $derived(verificacionesUsuario.length > 0);
	let requiereCargaInicialDocumentacion = $derived(
		esMiPerfil &&
			perfilUsuario.rol === 'institucion' &&
			!tieneSolicitudVerificacion &&
			estadoVerificacion !== 'verificado_documental' &&
			estadoVerificacion !== 'verificado_email_institucional' &&
			estadoVerificacion !== 'verificado_renaper'
	);
	let requiereGestionVerificacion = $derived(
		esMiPerfil &&
			perfilUsuario.rol === 'institucion' &&
			estadoVerificacion !== 'verificado_documental' &&
			estadoVerificacion !== 'verificado_email_institucional' &&
			estadoVerificacion !== 'verificado_renaper'
	);
	let mensajeVerificacion = $derived(
		requiereCargaInicialDocumentacion
			? 'Tu cuenta todavía no tiene documentación para validar identidad institucional. Completá la carga para habilitar la revisión.'
			: estadoVerificacion === 'verificacion_pendiente'
				? 'Tu documentación fue recibida y está siendo evaluada por el equipo de administración. Te avisaremos cuando haya una resolución.'
			: estadoVerificacion === 'verificacion_rechazada'
				? 'Tu verificación fue rechazada. Revisá el motivo y reenviá la documentación correcta desde esta sección.'
				: 'Tu cuenta aún no está verificada. Completá la verificación para evitar bloqueos en funcionalidades.'
	);

	const modales = usePerfilModales();
	const edicion = usePerfilEdicion();
	const { datosEdicion, provinciaSeleccionada, errorDescripcion, localidadesFiltradas } = edicion;

	let guardando = $state(false);

	async function actualizarUsuarioCon(parcial: Partial<UsuarioCompleto>, cerrarModal?: () => void) {
		if (!$usuarioStore || !$usuarioStore.id_usuario) return;
		guardando = true;
		try {
			await authActions.actualizarPerfil(
				$usuarioStore.id_usuario,
				parcial as Parameters<typeof authActions.actualizarPerfil>[1]
			);
			await invalidateAll();
			toastStore.show({
				variant: 'success',
				title: 'Perfil actualizado',
				message: 'Los cambios se guardaron correctamente.'
			});
			if (cerrarModal) cerrarModal();
		} catch (error) {
			toastStore.show({
				variant: 'error',
				title: 'Error al actualizar',
				message:
					error instanceof Error
						? error.message
						: 'No se pudieron guardar los cambios en el perfil.'
			});
		} finally {
			guardando = false;
		}
	}

	function crearAbrirModal(tipo: 'categorias' | 'tiposParticipacion') {
		return () => {
			if (!esMiPerfil) return;
			modales.abrir(tipo);
		};
	}

	function abrirModalEdicion() {
		if (!esMiPerfil) return;
		edicion.inicializar(perfilUsuario);
		modales.abrir('edicion');
	}

	async function handleGuardarPerfil() {
		const resultado = await edicion.prepararDatosParaGuardar();
		if (!resultado.valido) return;
		if (resultado.datos) {
			actualizarUsuarioCon(resultado.datos, () => modales.cerrar('edicion'));
		}
	}

	function abrirModalResena() {
		if (esMiPerfil || !puedeResenar) return;
		modales.abrir('resena');
	}

	async function handleGuardarResena(resena: Resena) {
		if (!$usuarioStore) return;

		try {
			const res = await fetch('/api/resenas', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					tipo_objeto: 'usuario',
					id_objeto: perfilUsuario.id_usuario,
					contenido: resena.contenido,
					puntaje: resena.puntaje
				})
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || 'Error al guardar reseña.');
			}

			const nuevaResenaStr = await res.json();

			const reseñaConAutor = {
				...nuevaResenaStr,
				autor: {
					...$usuarioStore,
					rol: $usuarioStore.rol,
					nombre: $usuarioStore.nombre,
					apellido: $usuarioStore.apellido,
					url_foto: $usuarioStore.url_foto,

					nombre_legal: ($usuarioStore as any).nombre_legal,
					razon_social: ($usuarioStore as any).razon_social
				}
			};

			// Agregar reseña a la lista local
			listaResenas = [reseñaConAutor, ...listaResenas];

			toastStore.show({
				variant: 'success',
				title: 'Reseña publicada correctamente',
				message: '¡Gracias por tu reseña! Tu aporte ayuda a mejorar la comunidad.'
			});
			modales.cerrar('resena');
		} catch (err: any) {
			toastStore.show({ variant: 'error', message: err.message });
		}
	}

	function solicitarEliminarResena(resena: Resena) {
		resenaAEliminar = resena;
		mostrarConfirmarEliminar = true;
	}

	function cancelarEliminarResena() {
		resenaAEliminar = null;
		mostrarConfirmarEliminar = false;
	}

	async function confirmarEliminarResena() {
		if (!resenaAEliminar) return;

		try {
			const res = await fetch('/api/resenas', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id_resena: resenaAEliminar.id_resena })
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || 'Error al eliminar la reseña.');
			}

			const idEliminado = resenaAEliminar.id_resena;
			listaResenas = listaResenas.filter((r) => r.id_resena !== idEliminado);
			toastStore.show({
				variant: 'success',
				message: 'Reseña eliminada correctamente.'
			});
		} catch (err: any) {
			toastStore.show({ variant: 'error', message: err.message });
		} finally {
			cancelarEliminarResena();
		}
	}

	const abrirModalCategorias = crearAbrirModal('categorias');
	const abrirModalTiposParticipacion = crearAbrirModal('tiposParticipacion');

	function handleGuardarCategorias(cats: Categoria[]) {
		actualizarUsuarioCon({ categorias_preferidas: cats }, () =>
			modales.cerrar('categorias')
		);
	}

	function handleGuardarTiposParticipacion(tipos: TipoParticipacion[]) {
		actualizarUsuarioCon({ tipos_participacion_preferidas: tipos }, () =>
			modales.cerrar('tiposParticipacion')
		);
	}

	let mostrarModalReporte = $state(false);

	const tabs = [
		{ id: 'info', label: 'Información' },
		{ id: 'proyectos', label: 'Proyectos' },
		{ id: 'resenas', label: 'Reseñas' }
	] as const;

	let statsUsuario = $derived({
		proyectos: proyectos.length,
		categorias: (perfilUsuario.categorias_preferidas || []).length,
		resenas: reseñasUsuario.length
	});
</script>

<main class="min-h-screen bg-gray-50">
	<!-- Fondo decorativo absoluto (no afecta el flujo del contenido) -->
	<div
		class="pointer-events-none absolute inset-x-0 top-0 h-36 overflow-hidden sm:h-44"
		aria-hidden="true"
	>
		<div
			class="absolute inset-0 bg-gradient-to-br from-[#007FFF]/20 via-[#42A1FF]/10 to-transparent"
		></div>
		<div class="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-[#007FFF]/8 blur-3xl"></div>
		<div class="absolute top-0 -right-10 h-56 w-56 rounded-full bg-[#42A1FF]/12 blur-2xl"></div>
	</div>

	<div class="relative mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
		<!-- Barra superior: botón configuración -->
		{#if esMiPerfil}
			<div class="mb-4 flex justify-end">
				<a
					href="/configuracion"
					class="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-[#007FFF]/30 hover:bg-blue-50 hover:text-[#007FFF] hover:shadow-md"
				>
					<Settings class="h-3.5 w-3.5" />
					Configuración
				</a>
			</div>
		{/if}

		<!-- Card principal del perfil -->
		{#if montado}
			<div
				class="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
				in:fly={{ y: 24, duration: 400, easing: cubicOut }}
			>
				<div class="p-5 sm:p-8">
					<PerfilHeader
						{perfilUsuario}
						{esMiPerfil}
						{estadoVerificacion}
						{requiereCargaInicialDocumentacion}
						onEditarClick={abrirModalEdicion}
					/>
					<PerfilInfoContacto {perfilUsuario} puedeVerContactos={puedeVerContactosPerfil} />
				</div>
			</div>

			<!-- Stats rápidas -->
			<div
				class="mb-6 grid grid-cols-3 gap-3 sm:gap-4"
				in:fly={{ y: 20, duration: 400, delay: 100, easing: cubicOut }}
			>
				{#each [{ label: 'Proyectos', valor: statsUsuario.proyectos, color: 'text-[#007FFF]' }, { label: 'Categorías', valor: statsUsuario.categorias, color: 'text-emerald-600' }, { label: 'Reseñas', valor: statsUsuario.resenas, color: 'text-amber-600' }] as stat (stat.label)}
					<div
						class="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md"
					>
						<p class="text-2xl font-bold {stat.color} sm:text-3xl">{stat.valor}</p>
						<p class="mt-0.5 text-xs font-medium text-gray-500 sm:text-sm">{stat.label}</p>
					</div>
				{/each}
			</div>
		{/if}

		<!-- Tabs para mobile -->
		<div class="mb-4 overflow-x-auto lg:hidden">
			<div class="flex gap-1 rounded-xl border border-gray-100 bg-white p-1.5 shadow-sm">
				{#each tabs as tab (tab.id)}
					<button
						onclick={() => (tabActiva = tab.id)}
						class="flex-1 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition-all duration-200 sm:text-sm {tabActiva ===
						tab.id
							? 'bg-[#007FFF] text-white shadow-sm'
							: 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'}"
					>
						{tab.label}
					</button>
				{/each}
			</div>
		</div>

		<!-- Layout de dos columnas en desktop -->
		<div class="flex flex-col gap-6 pb-12 lg:flex-row lg:items-start lg:gap-8">
			<!-- Sidebar izquierdo (desktop) / Tab "info" (mobile) -->
			<div
				class="lg:sticky lg:top-6 lg:w-80 lg:shrink-0 {tabActiva !== 'info'
					? 'hidden lg:block'
					: ''}"
			>
				{#if montado}
					<div in:fly={{ x: -20, duration: 400, delay: 150, easing: cubicOut }}>
						<div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
							<div class="border-b border-gray-100 px-5 py-4">
								<h3 class="flex items-center gap-2 text-sm font-bold text-gray-800">
									<BarChart3 class="h-4 w-4 text-[#007FFF]" />
									Sobre este perfil
								</h3>
							</div>
							<div class="p-5">
								<PerfilSeccionCategorias
									{perfilUsuario}
									{esMiPerfil}
									onEditarClick={abrirModalCategorias}
								/>
								{#if perfilUsuario.rol === 'institucion'}
									<div class="my-5 border-t border-gray-100"></div>
									<PerfilSeccionTiposParticipacion
										{perfilUsuario}
										{esMiPerfil}
										onEditarClick={abrirModalTiposParticipacion}
									/>
								{/if}
							</div>
						</div>

						{#if perfilUsuario.rol === 'colaborador'}
							<div
								class="mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
							>
								<div class="p-5">
									<PerfilSeccionTiposParticipacion
										{perfilUsuario}
										{esMiPerfil}
										onEditarClick={abrirModalTiposParticipacion}
									/>
								</div>
							</div>
						{/if}

						{#if requiereGestionVerificacion}
							<div class="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
								<h4 class="flex items-center gap-2 text-sm font-semibold text-amber-900">
									<ShieldCheck class="h-4 w-4" />
									Verificar cuenta
								</h4>
								<p class="mt-2 text-sm text-amber-800">{mensajeVerificacion}</p>
								<a
									href="/institucion/verificacion"
									class="mt-3 inline-flex items-center rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs font-semibold text-amber-900 transition hover:bg-amber-100"
								>
									Gestionar verificación
								</a>
							</div>
						{/if}

						<!-- Acciones de perfil (reportar, auditar) -->
						{#if !esMiPerfil && $isAuthenticated}
							<div class="mt-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
								{#if $isAdmin}
									<p class="mb-2 text-center text-xs text-gray-400">
										ID: {perfilUsuario.id_usuario}
									</p>
									<button
										onclick={() => console.log('Auditar perfil:', perfilUsuario.username)}
										class="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700 transition-all duration-200 hover:bg-amber-100"
									>
										<ShieldAlert class="h-4 w-4" />
										Auditar perfil
									</button>
								{:else}
									<button
										onclick={() => (mostrarModalReporte = true)}
										class="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-[#DE1C38] transition-all duration-200 hover:bg-red-100"
									>
										<Flag class="h-4 w-4" />
										Reportar perfil
									</button>
								{/if}
							</div>
						{/if}
					</div>
				{/if}
			</div>

			<!-- Contenido principal derecho -->
			<div class="min-w-0 flex-1">
				{#if montado}
					<!-- Proyectos -->
					<div
						class={tabActiva !== 'proyectos' && tabActiva !== 'info'
							? 'hidden'
							: tabActiva === 'info'
								? 'hidden lg:block'
								: ''}
						in:fly={{ y: 20, duration: 350, delay: 200, easing: cubicOut }}
					>
						<div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
							<PerfilSeccionProyectos
								proyectos={proyectos}
								rol={perfilUsuario.rol}
								{estadoVerificacion}
							/>
						</div>
					</div>

					<!-- Reseñas -->
					<div
						class={tabActiva !== 'resenas' && tabActiva !== 'info'
							? 'hidden'
							: tabActiva === 'info'
								? 'hidden lg:block'
								: ''}
						in:fly={{ y: 20, duration: 350, delay: 300, easing: cubicOut }}
					>
						<div
							class="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 lg:mt-6"
						>
							<PerfilSeccionResenas
								resenas={reseñasUsuario}
								{esMiPerfil}
								puedeAgregarResena={puedeResenar}
								{yaResenoUsuario}
								onAgregarResenaClick={abrirModalResena}
								onEliminar={solicitarEliminarResena}
							/>
						</div>
					</div>

					<!-- En desktop, mostrar proyectos y reseñas juntos cuando no hay tab seleccionada -->
					{#if tabActiva === 'proyectos' || tabActiva === 'info'}
						<!-- handled above -->
					{/if}
				{/if}
			</div>
		</div>
	</div>
</main>

<!-- Modales -->
<ModalEditarPerfil
	mostrar={$modales.edicion && esMiPerfil}
	{perfilUsuario}
	{datosEdicion}
	{provinciaSeleccionada}
	{localidadesFiltradas}
	{errorDescripcion}
	onCambiarProvincia={(p: number | undefined) => edicion.cambiarProvincia(p)}
	onActualizarDescripcion={(v: string) => edicion.actualizarDescripcion(v)}
	onActualizarCampo={(c: keyof EditarPerfilForm, v: any) => edicion.actualizarCampo(c, v)}
	{edicion}
	{guardando}
	onGuardar={handleGuardarPerfil}
	onCerrar={() => modales.cerrar('edicion')}
/>

{#if $modales.resena && !esMiPerfil && $isAuthenticated && $usuarioStore}
	<ResenaModal
		mostrar={$modales.resena}
		titulo={obtenerTituloResena('usuario')}
		placeholder={obtenerPlaceholderResena('usuario')}
		tipoObjeto="usuario"
		idObjeto={perfilUsuario.id_usuario}
		maxCaracteres={500}
		onguardar={handleGuardarResena}
		oncerrar={() => modales.cerrar('resena')}
	/>
{/if}

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
			onkeydown={(e) => e.stopPropagation()}
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

<!-- Modal de editar categorías favoritas -->
{#if $modales.categorias && esMiPerfil}
	<EditarCategoriasModal
		mostrar={$modales.categorias}
		categoriasSeleccionadas={perfilUsuario.categorias_preferidas || []}
		{categorias}
		{guardando}
		onguardar={handleGuardarCategorias}
		oncerrar={() => modales.cerrar('categorias')}
	/>
{/if}

{#if $modales.tiposParticipacion && esMiPerfil}
	<EditarTiposParticipacionModal
		mostrar={$modales.tiposParticipacion}
		tiposSeleccionados={perfilUsuario.tipos_participacion_preferidas || []}
		{tiposParticipacion}
		{guardando}
		onguardar={handleGuardarTiposParticipacion}
		oncerrar={() => modales.cerrar('tiposParticipacion')}
	/>
{/if}

{#if mostrarModalReporte}
	<ModalReportarIrregularidad
		bind:open={mostrarModalReporte}
		tipo_objeto="Usuario"
		id_objeto={perfilUsuario.id_usuario ?? 0}
		nombre_objeto={perfilUsuario.username}
		onclose={() => (mostrarModalReporte = false)}
		onsuccess={(detail) => console.log('Reporte generado:', detail)}
	/>
{/if}
