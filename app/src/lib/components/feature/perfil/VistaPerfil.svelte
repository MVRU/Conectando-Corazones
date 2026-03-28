<script lang="ts">
	import {
		usuario as usuarioStore,
		isAuthenticated,
		authActions,
		isAdmin
	} from '$lib/stores/auth';
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
	import { writable } from 'svelte/store';
	import type { Proyecto } from '$lib/domain/types/Proyecto';
	import type { EditarPerfilForm } from '$lib/domain/types/forms/EditarPerfilForm';
	import { Settings, Flag, ShieldAlert, BarChart3 } from 'lucide-svelte';

	let { perfilUsuario, esMiPerfil, proyectos = [], resenas = [], categorias = [], tiposParticipacion = [] } = $props<{
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

	let puedeVerContactosPerfil = $derived(puedeVerContactos($usuarioStore, perfilUsuario, proyectos));
	let puedeResenar = $derived(puedeDejarResena($usuarioStore, perfilUsuario, proyectos));
	let proyectosUsuario = $derived(proyectos);

	const resenasStore = writable<Resena[]>(resenas);

	let yaResenoUsuario = $derived(
		$usuarioStore && !esMiPerfil
			? $resenasStore.some(
					(r) =>
						r.username === ($usuarioStore.username || '') &&
						r.id_objeto === perfilUsuario.id_usuario &&
						r.tipo_objeto === 'usuario'
				)
			: false
	);

	let reseñasUsuario = $derived(
		$resenasStore.filter(
			(r) => r.id_objeto === perfilUsuario.id_usuario && r.tipo_objeto === 'usuario'
		)
	);

	let verificacionesUsuario = $derived((perfilUsuario as Record<string, unknown>).verificaciones as unknown[] || []);
	let estadoVerificacion = $derived(determinarEstadoVerificacion(verificacionesUsuario as never, perfilUsuario));

	const modales = usePerfilModales();
	const edicion = usePerfilEdicion();
	const { datosEdicion, provinciaSeleccionada, errorDescripcion, localidadesFiltradas } = edicion;

	let guardando = $state(false);

	async function actualizarUsuarioCon(parcial: Partial<UsuarioCompleto>, cerrarModal?: () => void) {
		if (!$usuarioStore || !$usuarioStore.id_usuario) return;
		guardando = true;
		try {
			await authActions.actualizarPerfil($usuarioStore.id_usuario, parcial as Parameters<typeof authActions.actualizarPerfil>[1]);
			await invalidateAll();
			toastStore.show({ variant: 'success', title: 'Perfil actualizado', message: 'Los cambios se guardaron correctamente.' });
			if (cerrarModal) cerrarModal();
		} catch (error) {
			toastStore.show({
				variant: 'error',
				title: 'Error al actualizar',
				message: error instanceof Error ? error.message : 'No se pudieron guardar los cambios en el perfil.'
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

	function handleGuardarResena(event: CustomEvent<Resena>) {
		if (!$usuarioStore) return;
		const nuevaResena: Resena = {
			...event.detail,
			username: $usuarioStore.username || `${$usuarioStore.nombre} ${$usuarioStore.apellido}`,
			rol: $usuarioStore.rol === 'colaborador'
				? ((($usuarioStore as unknown) as Record<string, string>).razon_social || 'Colaborador')
				: ((($usuarioStore as unknown) as Record<string, string>).nombre_legal || 'Institución')
		};
		resenasStore.update((r) => [...r, nuevaResena]);
		toastStore.show({ variant: 'success', title: 'Reseña publicada correctamente', message: '¡Gracias por tu reseña! Tu aporte ayuda a mejorar la comunidad.' });
		modales.cerrar('resena');
	}

	const abrirModalCategorias = crearAbrirModal('categorias');
	const abrirModalTiposParticipacion = crearAbrirModal('tiposParticipacion');

	function handleGuardarCategorias(event: CustomEvent<Categoria[]>) {
		actualizarUsuarioCon({ categorias_preferidas: event.detail }, () => modales.cerrar('categorias'));
	}

	function handleGuardarTiposParticipacion(event: CustomEvent<TipoParticipacion[]>) {
		actualizarUsuarioCon({ tipos_participacion_preferidas: event.detail }, () => modales.cerrar('tiposParticipacion'));
	}

	let mostrarModalReporte = $state(false);

	const tabs = [
		{ id: 'info', label: 'Información' },
		{ id: 'proyectos', label: 'Proyectos' },
		{ id: 'resenas', label: 'Reseñas' }
	] as const;

	let statsUsuario = $derived({
		proyectos: proyectosUsuario.length,
		categorias: (perfilUsuario.categorias_preferidas || []).length,
		resenas: reseñasUsuario.length
	});
</script>

<main class="min-h-screen bg-gray-50">
	<!-- Fondo decorativo absoluto (no afecta el flujo del contenido) -->
	<div class="pointer-events-none absolute inset-x-0 top-0 h-36 overflow-hidden sm:h-44" aria-hidden="true">
		<div class="absolute inset-0 bg-gradient-to-br from-[#007FFF]/20 via-[#42A1FF]/10 to-transparent"></div>
		<div class="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-[#007FFF]/8 blur-3xl"></div>
		<div class="absolute -right-10 top-0 h-56 w-56 rounded-full bg-[#42A1FF]/12 blur-2xl"></div>
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
				{#each [
					{ label: 'Proyectos', valor: statsUsuario.proyectos, color: 'text-[#007FFF]' },
					{ label: 'Categorías', valor: statsUsuario.categorias, color: 'text-emerald-600' },
					{ label: 'Reseñas', valor: statsUsuario.resenas, color: 'text-amber-600' }
				] as stat (stat.label)}
					<div class="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md">
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
						class="flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 sm:text-sm {tabActiva === tab.id
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
			<div class="lg:sticky lg:top-6 lg:w-80 lg:shrink-0 {tabActiva !== 'info' ? 'hidden lg:block' : ''}">
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
								<PerfilSeccionCategorias {perfilUsuario} {esMiPerfil} onEditarClick={abrirModalCategorias} />
							</div>
						</div>

						{#if perfilUsuario.rol === 'colaborador'}
							<div class="mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
								<div class="p-5">
									<PerfilSeccionTiposParticipacion
										{perfilUsuario}
										{esMiPerfil}
										onEditarClick={abrirModalTiposParticipacion}
									/>
								</div>
							</div>
						{/if}

						<!-- Acciones de perfil (reportar, auditar) -->
						{#if !esMiPerfil && $isAuthenticated}
							<div class="mt-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
								{#if $isAdmin}
									<p class="mb-2 text-center text-xs text-gray-400">ID: {perfilUsuario.id_usuario}</p>
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
						class="{tabActiva !== 'proyectos' && tabActiva !== 'info' ? 'hidden' : tabActiva === 'info' ? 'hidden lg:block' : ''}"
						in:fly={{ y: 20, duration: 350, delay: 200, easing: cubicOut }}
					>
						<div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
							<PerfilSeccionProyectos proyectos={proyectosUsuario} rol={perfilUsuario.rol} {estadoVerificacion} />
						</div>
					</div>

					<!-- Reseñas -->
					<div
						class="{tabActiva !== 'resenas' && tabActiva !== 'info' ? 'hidden' : tabActiva === 'info' ? 'hidden lg:block' : ''}"
						in:fly={{ y: 20, duration: 350, delay: 300, easing: cubicOut }}
					>
						<div class="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 lg:mt-6">
							<PerfilSeccionResenas
								resenas={reseñasUsuario}
								{esMiPerfil}
								puedeAgregarResena={puedeResenar}
								{yaResenoUsuario}
								onAgregarResenaClick={abrirModalResena}
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
	on:guardar={handleGuardarPerfil}
	on:cerrar={() => modales.cerrar('edicion')}
/>

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

{#if $modales.categorias && esMiPerfil}
	<EditarCategoriasModal
		mostrar={$modales.categorias}
		categoriasSeleccionadas={perfilUsuario.categorias_preferidas || []}
		{categorias}
		{guardando}
		on:guardar={handleGuardarCategorias}
		on:cerrar={() => modales.cerrar('categorias')}
	/>
{/if}

{#if $modales.tiposParticipacion && esMiPerfil}
	<EditarTiposParticipacionModal
		mostrar={$modales.tiposParticipacion}
		tiposSeleccionados={perfilUsuario.tipos_participacion_preferidas || []}
		{tiposParticipacion}
		{guardando}
		on:guardar={handleGuardarTiposParticipacion}
		on:cerrar={() => modales.cerrar('tiposParticipacion')}
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
