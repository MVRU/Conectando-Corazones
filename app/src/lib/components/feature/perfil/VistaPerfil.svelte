<script lang="ts">
	import { usuario as usuarioStore, isAuthenticated, authActions, isAdmin } from '$lib/stores/auth';
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
	import {
		determinarEstadoVerificacion,
		obtenerVerificacionesUsuario
	} from '$lib/utils/util-verificacion';
	import { mockVerificaciones } from '$lib/infrastructure/mocks/mock-verificaciones';
	import { perfilAdapter } from '$lib/adapters/perfil.adapter';
	import { mockProyectos } from '$lib/infrastructure/mocks/mock-proyectos';
	import { writable } from 'svelte/store';
    import type { Proyecto } from '$lib/domain/types/Proyecto';

	export let perfilUsuario: UsuarioCompleto;
	export let esMiPerfil: boolean;

	// Si es mi perfil, sincronizar con el store para que los cambios se reflejen
	$: if (esMiPerfil && $usuarioStore) {
		perfilUsuario = $usuarioStore as UsuarioCompleto;
	}

	// Verificar si el usuario actual puede ver los contactos del perfil
	$: puedeVerContactosPerfil = puedeVerContactos($usuarioStore, perfilUsuario, mockProyectos);

	// Verificar si el usuario actual puede dejar Reseña
	$: puedeResenar = puedeDejarResena($usuarioStore, perfilUsuario, mockProyectos);

	// Proyectos del usuario
    let proyectosUsuario: Proyecto[] = [];
	$: {
         perfilAdapter.obtenerProyectosUsuario(perfilUsuario.id_usuario, perfilUsuario.rol)
            .then(p => proyectosUsuario = p);
    }

	// Reseñas del usuario - usando writable store local
	const resenasStore = writable<Resena[]>([]);

	$: yaResenoUsuario =
		$usuarioStore && !esMiPerfil
			? $resenasStore.some(
					(r) =>
						r.username === ($usuarioStore.username || '') &&
						r.id_objeto === perfilUsuario.id_usuario &&
						r.tipo_objeto === 'usuario'
				)
			: false;
	$: reseñasUsuario = $resenasStore.filter(
		(r) => r.id_objeto === perfilUsuario.id_usuario && r.tipo_objeto === 'usuario'
	);

	// Gestión de modales usando composable
	const modales = usePerfilModales();

	// Gestión de edición de perfil usando composable
	const edicion = usePerfilEdicion();
	const { datosEdicion, provinciaSeleccionada, errorDescripcion, localidadesFiltradas } = edicion;

	function actualizarUsuarioCon(parcial: Partial<UsuarioCompleto>, cerrarModal?: () => void) {
		if (!$usuarioStore) return;
		authActions.updateUsuario({
			...$usuarioStore,
			...parcial
		} as any);
		if (cerrarModal) cerrarModal();
	}

	function crearAbrirModal(tipo: 'categorias' | 'tiposParticipacion', validacion?: () => boolean) {
		return () => {
			if (validacion && !validacion()) return;
			if (!esMiPerfil) return;
			modales.abrir(tipo);
		};
	}

	function abrirModalEdicion() {
		if (!esMiPerfil) return;
		edicion.inicializar(perfilUsuario);
		modales.abrir('edicion');
	}

	function handleGuardarPerfil() {
		const resultado = edicion.prepararDatosParaGuardar();
		if (!resultado.valido) {
			return;
		}
		if (resultado.datos) {
			actualizarUsuarioCon(resultado.datos, () => modales.cerrar('edicion'));
		}
	}

	function handleCambioFoto(event: Event) {
		edicion.cambiarFoto(event);
	}

	// Funciones para Reseñas
	function abrirModalResena() {
		if (esMiPerfil || !puedeResenar) return;
		modales.abrir('resena');
	}

	function handleGuardarResena(event: CustomEvent<Resena>) {
		if (!$usuarioStore) return;

		const nuevaResena: Resena = {
			...event.detail,
			username: $usuarioStore.username || `${$usuarioStore.nombre} ${$usuarioStore.apellido}`,
			rol:
				$usuarioStore.rol === 'colaborador'
					? ($usuarioStore as any).razon_social || 'Colaborador'
					: ($usuarioStore as any).nombre_legal || 'Institución'
		};

		// Agregar reseña al store local
		resenasStore.update((resenas) => [...resenas, nuevaResena]);

		toastStore.show({
			variant: 'success',
			title: 'Reseña publicada correctamente',
			message: '¡Gracias por tu Reseña! Tu aporte ayuda a mejorar la comunidad.'
		});

		console.log('Reseña guardada:', nuevaResena);
		modales.cerrar('resena');
	}

	const abrirModalCategorias = crearAbrirModal('categorias');
	const abrirModalTiposParticipacion = crearAbrirModal('tiposParticipacion');

	function handleGuardarCategorias(event: CustomEvent<Categoria[]>) {
		actualizarUsuarioCon({ categorias_preferidas: event.detail }, () =>
			modales.cerrar('categorias')
		);
	}

	function handleGuardarTiposParticipacion(event: CustomEvent<TipoParticipacion[]>) {
		actualizarUsuarioCon({ tipos_participacion_preferidas: event.detail }, () =>
			modales.cerrar('tiposParticipacion')
		);
	}

	// Lógica para reportar perfil
	let mostrarModalReporte = false;

	function abrirModalReporte() {
		mostrarModalReporte = true;
	}

	function handleConfirmarReporte(event: CustomEvent) {
		console.log('Reporte generado:', event.detail);
	}

	// Determinar estado de verificación del usuario
	$: verificacionesUsuario = obtenerVerificacionesUsuario(
		perfilUsuario.id_usuario,
		mockVerificaciones
	);
	$: estadoVerificacion = determinarEstadoVerificacion(verificacionesUsuario);
</script>

<main class="min-h-screen bg-gray-50">
	<!-- Contenido principal -->
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<div
			class="mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
		>
			<div class="p-4 sm:p-6 lg:p-8">
				<PerfilHeader
					{perfilUsuario}
					{esMiPerfil}
					{estadoVerificacion}
					onEditarClick={abrirModalEdicion}
				/>

				<PerfilInfoContacto {perfilUsuario} puedeVerContactos={puedeVerContactosPerfil} />
			</div>
		</div>

		<PerfilSeccionCategorias {perfilUsuario} {esMiPerfil} onEditarClick={abrirModalCategorias} />

		<PerfilSeccionTiposParticipacion
			{perfilUsuario}
			{esMiPerfil}
			onEditarClick={abrirModalTiposParticipacion}
		/>

		<PerfilSeccionProyectos proyectos={proyectosUsuario} rol={perfilUsuario.rol} />

		<PerfilSeccionResenas
			resenas={reseñasUsuario}
			{esMiPerfil}
			puedeAgregarResena={puedeResenar}
			{yaResenoUsuario}
			onAgregarResenaClick={abrirModalResena}
		/>

		<!-- Reportar perfil -->
		{#if !esMiPerfil && $isAuthenticated}
			<div class="mt-12 border-t border-gray-200 pb-4 pt-8 text-center">
				{#if $isAdmin}
					<div class="mb-4 text-center">
						<span
							class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
						>
							ID: {perfilUsuario.id_usuario}
						</span>
					</div>
					<p class="text-sm text-gray-500">
						¿Algo no está bien?
						<button
							on:click={() => console.log('Auditar perfil:', perfilUsuario.username)}
							class="font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
						>
							Auditar este perfil
						</button>
					</p>
				{:else}
					<p class="text-sm text-gray-500">
						¿Algo no está bien?
						<button
							on:click={abrirModalReporte}
							class="font-medium text-red-600 transition-colors hover:text-red-700 hover:underline"
						>
							Reportar este perfil
						</button>
					</p>
				{/if}
			</div>
		{/if}
	</div>
</main>

<!-- Modal de edición de perfil -->
<ModalEditarPerfil
	mostrar={$modales.edicion && esMiPerfil}
	{perfilUsuario}
	{datosEdicion}
	{provinciaSeleccionada}
	{localidadesFiltradas}
	{errorDescripcion}
	onCambioFoto={handleCambioFoto}
	onCambiarProvincia={(p) => edicion.cambiarProvincia(p)}
	onActualizarDescripcion={(v) => edicion.actualizarDescripcion(v)}
	onActualizarCampo={(c, v) => edicion.actualizarCampo(c, v)}
	on:guardar={handleGuardarPerfil}
	on:cerrar={() => modales.cerrar('edicion')}
/>
<!-- Modal de añadir Reseña  -->
{#if $modales.resena && !esMiPerfil && $isAuthenticated && $usuarioStore}
	<ResenaModal
		mostrar={$modales.resena}
		titulo={obtenerTituloResena('usuario')}
		placeholder={obtenerPlaceholderResena('usuario')}
		tipoObjeto="usuario"
		idObjeto={perfilUsuario.id_usuario}
		on:guardar={handleGuardarResena}
		on:cerrar={() => modales.cerrar('resena')}
	/>
{/if}

<!-- Modal de editar categorías favoritas -->
{#if $modales.categorias && esMiPerfil}
	<EditarCategoriasModal
		mostrar={$modales.categorias}
		categoriasSeleccionadas={perfilUsuario.categorias_preferidas || []}
		on:guardar={handleGuardarCategorias}
		on:cerrar={() => modales.cerrar('categorias')}
	/>
{/if}

<!-- Modal de editar tipos de participación favoritas -->
{#if $modales.tiposParticipacion && esMiPerfil}
	<EditarTiposParticipacionModal
		mostrar={$modales.tiposParticipacion}
		tiposSeleccionados={perfilUsuario.tipos_participacion_preferidas || []}
		on:guardar={handleGuardarTiposParticipacion}
		on:cerrar={() => modales.cerrar('tiposParticipacion')}
	/>
{/if}

<!-- Modal de reportar irregularidad -->
{#if mostrarModalReporte}
	<ModalReportarIrregularidad
		bind:open={mostrarModalReporte}
		tipo_objeto="Usuario"
		id_objeto={perfilUsuario.id_usuario ?? 0}
		nombre_objeto={perfilUsuario.username}
		on:close={() => (mostrarModalReporte = false)}
		on:success={handleConfirmarReporte}
	/>
{/if}


