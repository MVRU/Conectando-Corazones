<script lang="ts">
	import { usuario as usuarioStore, isAuthenticated, authActions } from '$lib/stores/auth';
	import { mockProyectos } from '$lib/mocks/mock-proyectos';
	import type { EditarPerfilForm } from '$lib/types/forms/EditarPerfilForm';
	import { crearFormularioVacio } from '$lib/types/forms/EditarPerfilForm';
	import MetodosContactoForm from '$lib/components/forms/MetodosContactoForm.svelte';
	import ProyectoCard from '$lib/components/ui/cards/ProyectoCard.svelte';
	import ResenaCard from '$lib/components/ui/cards/ResenaCard.svelte';
	import ResenaModal from '$lib/components/modals/ResenaModal.svelte';
	import EditarCategoriasModal from '$lib/components/modals/EditarCategoriasModal.svelte';
	import EditarTiposParticipacionModal from '$lib/components/modals/EditarTiposParticipacionModal.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import type { Resena } from '$lib/types/Resena';
	import type { Categoria } from '$lib/types/Categoria';
	import type { TipoParticipacion } from '$lib/types/TipoParticipacion';
	import type { Usuario, Institucion, Organizacion, Unipersonal, Administrador } from '$lib/types/Usuario';

	type UsuarioCompleto = Usuario | Institucion | Organizacion | Unipersonal | Administrador;
	import { mockTestimonios } from '$lib/mocks/mock-testimonios';
	import { yaReseno, filtrarResenasPorTipo, obtenerPlaceholderResena, obtenerTituloResena } from '$lib/utils/resenas';
	import { obtenerColorRol, formatearEtiquetaContacto, obtenerIconoContacto } from '$lib/utils/util-ui';
	import { obtenerIconoCategoria } from '$lib/utils/util-proyecto-form';
	import { puedeVerContactos } from '$lib/utils/util-perfil';
	import { INFO_TIPOS_PARTICIPACION } from '$lib/utils/constants';

	export let perfilUsuario: UsuarioCompleto;
	export let esMiPerfil: boolean;

	// Si es mi perfil, sincronizar con el store para que los cambios se reflejen
	$: if (esMiPerfil && $usuarioStore) {
		perfilUsuario = $usuarioStore as UsuarioCompleto;
	}

	// Verificar si el usuario actual puede ver los contactos del perfil
	$: puedeVerContactosPerfil = puedeVerContactos($usuarioStore, perfilUsuario, mockProyectos);

	// Proyectos del usuario
	$: proyectosUsuario = perfilUsuario.rol === 'institucion'
		? mockProyectos.filter(p => p.institucion_id === perfilUsuario.id_usuario)
		: mockProyectos.filter(p => 
			p.colaboraciones?.some(c => 
				c.colaborador_id === perfilUsuario.id_usuario && 
				(c.estado === 'aprobada')
			)
		);
	$: proyectosActivos = proyectosUsuario.filter(p => p.estado === 'en_curso');
	$: proyectosCompletados = proyectosUsuario.filter(p => p.estado === 'completado');

	// Estado del modal de edición
	let mostrarModalEdicion = false;

	// Estado del modal de reseñas
	let mostrarModalResena = false;

	// Estado del modal de categorías
	let mostrarModalCategorias = false;

	// Estado del modal de tipos de participación
	let mostrarModalTiposParticipacion = false;

	// Estado para el formulario de edición
	let datosEdicion: EditarPerfilForm = crearFormularioVacio();

	function abrirModalEdicion() {
		if (!esMiPerfil) return;
		
		// Inicializar datos con los valores actuales del usuario
		datosEdicion = {
			nombre: perfilUsuario.nombre || '',
			apellido: perfilUsuario.apellido || '',
			url_foto: perfilUsuario.url_foto || '',
			contactos: perfilUsuario.contactos ?? []
		};
		mostrarModalEdicion = true;
	}

	function cerrarModalEdicion() {
		mostrarModalEdicion = false;
	}

	function handleGuardarPerfil() {
		// Aquí iría la llamada a la API para guardar todos los datos del perfil
		console.log('Perfil guardado:', datosEdicion);
		cerrarModalEdicion();
	}

	function handleCambioFoto(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		
		if (!file) return;
		
		// Validar tipo de archivo
		const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
		if (!tiposPermitidos.includes(file.type)) {
			alert('Por favor selecciona un archivo JPG, PNG o GIF válido.');
			return;
		}
		
		// Validar tamaño (5MB máximo)
		const maxSize = 5 * 1024 * 1024; // 5MB en bytes
		if (file.size > maxSize) {
			alert('El archivo es demasiado grande. Máximo 5MB.');
			return;
		}
		
		// Crear URL local para previsualización
		datosEdicion.url_foto = URL.createObjectURL(file);
		
		// TODO: Aquí iría la subida real del archivo a un servicio de almacenamiento
		// y la actualización de la URL en el servidor
	}

	// Funciones para reseñas
	function abrirModalResena() {
		// Solo permitir agregar reseñas si NO es tu propio perfil
		if (esMiPerfil) return;
		mostrarModalResena = true;
	}

	function cerrarModalResena() {
		mostrarModalResena = false;
	}

	function handleGuardarResena(event: CustomEvent<Resena>) {
		// TODO: Aquí iría la llamada a la API para guardar la reseña
		console.log('Reseña guardada:', event.detail);
		cerrarModalResena();
	}

	// Funciones para categorías
	function abrirModalCategorias() {
		if (!esMiPerfil) return;
		mostrarModalCategorias = true;
	}

	function cerrarModalCategorias() {
		mostrarModalCategorias = false;
	}

	function handleGuardarCategorias(event: CustomEvent<Categoria[]>) {
		// TODO: Aquí iría la llamada a la API para guardar las categorías favoritas
		if ($usuarioStore) {
			// Actualizar el store con las nuevas categorías usando el método del store
			authActions.updateUsuario({
				...$usuarioStore,
				categorias_preferidas: event.detail
			} as any);
			console.log('Categorías guardadas:', event.detail);
		}
		cerrarModalCategorias();
	}

	// Funciones para tipos de participación
	function abrirModalTiposParticipacion() {
		if (!esMiPerfil) return;
		mostrarModalTiposParticipacion = true;
	}

	function cerrarModalTiposParticipacion() {
		mostrarModalTiposParticipacion = false;
	}

	function handleGuardarTiposParticipacion(event: CustomEvent<TipoParticipacion[]>) {
		// TODO: Aquí iría la llamada a la API para guardar los tipos de participación favoritos
		if ($usuarioStore) {
			authActions.updateUsuario({
				...$usuarioStore,
				tipos_participacion_preferidas: event.detail
			} as any);
			console.log('Tipos de participación guardados:', event.detail);
		}
		cerrarModalTiposParticipacion();
	}

	// Verificar si el usuario actual ya reseñó a este perfil
	$: yaResenoUsuario = $usuarioStore && !esMiPerfil
		? yaReseno($usuarioStore.username || '', mockTestimonios, 'usuario', perfilUsuario.id_usuario)
		: false;
	$: reseñasUsuario = filtrarResenasPorTipo(mockTestimonios, 'usuario', perfilUsuario.id_usuario);
</script>

<main class="min-h-screen bg-gray-50">
	<!-- Contenido principal -->
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
			<div class="p-8">
				<div class="flex items-start gap-6">
					<div class="relative group">
						<img
							src={perfilUsuario.url_foto ?? '/users/default-avatar.jpg'}
							alt="Foto de perfil"
							class="h-24 w-24 rounded-full object-cover"
						/>
						{#if esMiPerfil}
							<!-- Overlay con ícono de edición solo en perfil propio -->
							<div class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
								 on:click={abrirModalEdicion}
								 on:keydown={(e) => e.key === 'Enter' && abrirModalEdicion()}
								 role="button"
								 tabindex="0">
								<svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
								</svg>
							</div>
						{/if}
					</div>
					<div class="flex-1">
						<h2 class="text-3xl font-bold text-gray-900">
							{perfilUsuario.rol === 'institucion' 
								? (perfilUsuario as any).nombre_legal || perfilUsuario.nombre 
								: perfilUsuario.nombre + ' ' + perfilUsuario.apellido}
						</h2>
						
						<!-- Tags -->
						<div class="mt-4 flex flex-wrap gap-2">
							<!-- Tag del rol con color -->
							<span class="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium {obtenerColorRol(perfilUsuario.rol)}">
								{perfilUsuario.rol}
							</span>
						</div>
					</div>
				</div>

				<!-- Botón de editar solo en perfil propio -->
				{#if esMiPerfil}
					<div class="mt-6 flex justify-end">
						<button
							on:click={abrirModalEdicion}
							class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
							</svg>
							Editar información
						</button>
					</div>
				{/if}

				<!-- Información de contacto -->
				<div class="mt-8 border-t border-gray-200 pt-8">
					<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
						<!-- Columna izquierda: Información de contacto -->
						<div class="space-y-6">
							<!-- Contacto -->
							<div>
								<div class="mb-3 flex items-center gap-2">
									<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
									</svg>
									<span class="text-sm font-semibold uppercase tracking-wide text-gray-600">Información de Contacto</span>
								</div>
								{#if puedeVerContactosPerfil}
									<div class="ml-7 space-y-3">
										{#each (perfilUsuario.contactos ?? []).slice(0, 5) as c}
											<div class="flex items-start gap-3 border-l-2 border-gray-100 pl-3">
												<svg class="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={obtenerIconoContacto(c.tipo_contacto)} />
												</svg>
												<div class="flex-1">
													<div class="text-xs font-medium uppercase tracking-wide text-gray-500">
														{c.tipo_contacto === 'email' ? 'Correo Electrónico' : 
														 c.tipo_contacto === 'telefono' ? 'Teléfono' :
														 c.tipo_contacto === 'web' ? 'Sitio Web' :
														 c.tipo_contacto === 'red_social' ? 'Red Social' : c.tipo_contacto}
														{#if c.etiqueta}
															<span class="ml-1 text-gray-400">({formatearEtiquetaContacto(c.etiqueta)})</span>
														{/if}
													</div>
												<p class="mt-0.5 text-sm font-medium text-gray-900">{c.valor}</p>
												</div>
											</div>
										{/each}
									</div>
								{:else}
									<div class="ml-7 rounded-lg bg-gray-50 p-4">
										<div class="flex items-start gap-3">
											<svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
											</svg>
											<div class="flex-1">
												<p class="text-sm font-medium text-gray-700">Información de contacto privada</p>
												<p class="mt-1 text-xs text-gray-500">
													{#if perfilUsuario.rol === 'institucion'}
														Para ver los contactos de esta institución, debés tener al menos una colaboración aprobada en uno de sus proyectos.
													{:else}
														Para ver los contactos de este usuario, debés haber colaborado juntos en un mismo proyecto.
													{/if}
												</p>
											</div>
										</div>
									</div>
								{/if}
							</div>
						</div>

						<!-- Columna derecha: Información de cuenta -->
						<div class="space-y-6">
							<div>
								<div class="mb-2 flex items-center gap-2">
									<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
									<span class="text-sm font-semibold uppercase tracking-wide text-gray-600">Usuario</span>
								</div>
								<p class="ml-7 text-base text-gray-900">@{perfilUsuario.username}</p>
							</div>
							<div>
								<div class="mb-2 flex items-center gap-2">
									<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<span class="text-sm font-semibold uppercase tracking-wide text-gray-600">Estado</span>
								</div>
								<p class="ml-7 text-base capitalize text-gray-900">{perfilUsuario.estado}</p>
							</div>
							<div>
								<div class="mb-2 flex items-center gap-2">
									<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
									<span class="text-sm font-semibold uppercase tracking-wide text-gray-600">Miembro desde</span>
								</div>
								<p class="ml-7 text-base text-gray-900">
									{perfilUsuario.created_at ? new Date(perfilUsuario.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : 'No disponible'}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Sección Mis Categorías Favoritas -->
		<section class="mb-8">
			<div class="mb-4 flex items-center justify-between">
				<h3 class="text-xl font-semibold text-gray-900">
					{esMiPerfil ? 'Mis Categorías Favoritas' : 'Categorías Favoritas'}
				</h3>
				{#if esMiPerfil}
					<button
						on:click={abrirModalCategorias}
						class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
						</svg>
						Editar
					</button>
				{/if}
			</div>
			{#if perfilUsuario.categorias_preferidas && perfilUsuario.categorias_preferidas.length > 0}
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each perfilUsuario.categorias_preferidas as categoria}
						<div class="overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
							<div class="flex items-center gap-3">
								<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
									<Icon src={obtenerIconoCategoria(categoria.descripcion)} class="h-6 w-6 text-blue-600" />
								</div>
								<div class="flex-1">
									<h4 class="font-medium text-gray-900">{categoria.descripcion}</h4>

								</div>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="text-center py-12 rounded-xl border border-gray-200 bg-white">
					<div class="mx-auto h-12 w-12 text-gray-400">
						<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
						</svg>
					</div>
					<h3 class="mt-4 text-lg font-medium text-gray-900">No hay categorías favoritas</h3>
					<p class="mt-2 text-gray-500">
						{esMiPerfil 
							? 'Seleccioná tus categorías favoritas para personalizar tu experiencia.'
							: 'Este usuario aún no ha seleccionado categorías favoritas.'}
					</p>
					{#if esMiPerfil}
						<button
							on:click={abrirModalCategorias}
							class="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
							</svg>
							Agregar Categorías
						</button>
					{/if}
				</div>
			{/if}
		</section>

		<!-- Sección Tipos de Participación Favoritas -->
		{#if perfilUsuario.rol === 'colaborador'}
		<section class="mb-8">
			<div class="mb-4 flex items-center justify-between">
				<h3 class="text-xl font-semibold text-gray-900">
					{esMiPerfil ? 'Mis Tipos de Participación Favoritas' : 'Tipos de Participación Favoritas'}
				</h3>
				{#if esMiPerfil}
					<button
						on:click={abrirModalTiposParticipacion}
						class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
						</svg>
						Editar
					</button>
				{/if}
			</div>
			{#if perfilUsuario.tipos_participacion_preferidas && perfilUsuario.tipos_participacion_preferidas.length > 0}
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each perfilUsuario.tipos_participacion_preferidas as tipoParticipacion}
						{@const info = INFO_TIPOS_PARTICIPACION[tipoParticipacion.descripcion]}
						<div class="overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
							<div class="flex items-center gap-3">
								<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-{info.color}-50">
								<Icon src={info.icon} class="h-6 w-6 text-{info.color}-600" />
								</div>
							<h4 class="font-medium text-gray-900">{info.titulo}</h4>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="text-center py-12 rounded-xl border border-gray-200 bg-white">
					<div class="mx-auto h-12 w-12 text-gray-400">
						<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
						</svg>
					</div>
					<h3 class="mt-4 text-lg font-medium text-gray-900">No hay tipos de participación favoritas</h3>
					<p class="mt-2 text-gray-500">
						{esMiPerfil 
							? 'Seleccioná tus formas favoritas de participar en proyectos.'
							: 'Este colaborador aún no ha seleccionado tipos de participación favoritas.'}
					</p>
					{#if esMiPerfil}
						<button
							on:click={abrirModalTiposParticipacion}
							class="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
							</svg>
							Agregar Tipos de Participación
						</button>
					{/if}
				</div>
			{/if}
		</section>
		{/if}

		<!-- Sección Últimos Proyectos -->
		<section class="mb-8">
			<h3 class="mb-4 text-xl font-semibold text-gray-900">Últimos Proyectos</h3>
			{#if proyectosUsuario.length > 0}
				<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{#each proyectosUsuario.slice(0, 3) as proyecto (proyecto.id_proyecto)}
						<ProyectoCard proyecto={proyecto} />
					{/each}
				</div>
			{:else}
				<div class="text-center py-12">
					<div class="mx-auto h-12 w-12 text-gray-400">
						<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
						</svg>
					</div>
					<h3 class="mt-4 text-lg font-medium text-gray-900">No hay proyectos</h3>
					<p class="mt-2 text-gray-500">
						{perfilUsuario.rol === 'institucion' 
							? 'Cuando crees proyectos, aparecerán aquí.' 
							: 'Cuando participes en proyectos, aparecerán aquí.'}
					</p>
				</div>
			{/if}
		</section>

		<!-- Sección Reseñas -->
		<section class="mb-8">
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-xl font-semibold text-gray-900">Reseñas</h3>
				{#if !esMiPerfil && $isAuthenticated && $usuarioStore && !yaResenoUsuario}
					<button
						on:click={abrirModalResena}
						class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
						</svg>
						Añadir Reseña
					</button>
				{/if}
			</div>
			
			{#if reseñasUsuario.length > 0}
				<div class="grid gap-6 md:grid-cols-2">
					{#each reseñasUsuario.slice(0, 4) as resena (resena.id_resena || resena.contenido)}
						<ResenaCard {resena} />
					{/each}
				</div>
			{:else}
				<div class="text-center py-12">
					<div class="mx-auto h-12 w-12 text-gray-400">
						<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
						</svg>
					</div>
					<h3 class="mt-4 text-lg font-medium text-gray-900">No hay reseñas</h3>
					<p class="mt-2 text-gray-500">Las reseñas aparecerán aquí cuando otros usuarios las dejen.</p>
				</div>
			{/if}
		</section>
	</div>
</main>

<!-- Modal de edición de perfil (solo en perfil propio) -->
{#if mostrarModalEdicion && esMiPerfil}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" on:click={cerrarModalEdicion}>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-xl" on:click|stopPropagation>
			<div class="mb-6 flex items-center justify-between">
				<h3 class="text-xl font-semibold text-gray-900">Editar Perfil</h3>
				<div class="flex items-center gap-4 flex-1 justify-end">
					<p class="text-lg font-semibold text-gray-900">
						{perfilUsuario.rol === 'institucion' 
							? (perfilUsuario as any).nombre_legal || perfilUsuario.nombre 
							: perfilUsuario.nombre + ' ' + perfilUsuario.apellido}
					</p>
					<button
						on:click={cerrarModalEdicion}
						aria-label="Cerrar modal"
						class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
			</div>

			<form on:submit|preventDefault={handleGuardarPerfil} class="space-y-6">
				<!-- Sección de foto de perfil -->
				<div class="border-b border-gray-200 pb-6">
					<h4 class="text-lg font-medium text-gray-900 mb-4">Foto de Perfil</h4>
					<div class="flex items-center gap-6">
						<div class="relative">
							<img
								src={datosEdicion.url_foto || '/users/default-avatar.jpg'}
								alt="Foto de perfil"
								class="h-20 w-20 rounded-full object-cover"
							/>
						</div>
						<div>
							<input
								type="file"
								accept="image/*"
								on:change={handleCambioFoto}
								class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
							/>
							<p class="text-sm text-gray-500 mt-1">JPG, PNG o GIF. Máximo 5MB.</p>
						</div>
					</div>
				</div>

				<!-- Información personal -->
				<div class="border-b border-gray-200 pb-6">
					<h4 class="text-lg font-medium text-gray-900 mb-4">
						{perfilUsuario.rol === 'institucion' ? 'Representante Legal' : 'Información Personal'}
					</h4>
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<label for="nombre" class="block text-sm font-medium text-gray-700">Nombre</label>
							{#if perfilUsuario.rol === 'colaborador' && (perfilUsuario as any).tipo_colaborador === 'unipersonal'}
								<input
									type="text"
									id="nombre"
									bind:value={datosEdicion.nombre}
									disabled
									class="mt-1 block w-full rounded-lg border-gray-300 bg-gray-100 shadow-sm cursor-not-allowed text-gray-500"
									title="Los usuarios unipersonales no pueden modificar su nombre"
								/>
							{:else}
								<input
									type="text"
									id="nombre"
									bind:value={datosEdicion.nombre}
									class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
								/>
							{/if}
						</div>
						<div>
							<label for="apellido" class="block text-sm font-medium text-gray-700">Apellido</label>
							{#if perfilUsuario.rol === 'colaborador' && (perfilUsuario as any).tipo_colaborador === 'unipersonal'}
								<input
									type="text"
									id="apellido"
									bind:value={datosEdicion.apellido}
									disabled
									class="mt-1 block w-full rounded-lg border-gray-300 bg-gray-100 shadow-sm cursor-not-allowed text-gray-500"
									title="Los usuarios unipersonales no pueden modificar su apellido"
								/>
							{:else}
								<input
									type="text"
									id="apellido"
									bind:value={datosEdicion.apellido}
									class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
								/>
							{/if}
						</div>
					</div>
				</div>

				<!-- Información de contacto (múltiples) -->
				<div class="border-b border-gray-200 pb-6">
					<h4 class="text-lg font-medium text-gray-900 mb-4">Métodos de Contacto</h4>
					<MetodosContactoForm
						valoresIniciales={datosEdicion.contactos}
						on:submit={(e) => {
							datosEdicion.contactos = e.detail;
						}}
					/>
				</div>

				<!-- Botones de acción -->
				<div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
					<button
						type="button"
						on:click={cerrarModalEdicion}
						class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						Cancelar
					</button>
					<button
						type="submit"
						class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						Guardar Cambios
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Modal de añadir reseña (solo en perfil de otro usuario) -->
{#if mostrarModalResena && !esMiPerfil && $isAuthenticated && $usuarioStore}
	<ResenaModal
		bind:mostrar={mostrarModalResena}
		titulo={obtenerTituloResena('usuario')}
		placeholder={obtenerPlaceholderResena('usuario')}
		tipoObjeto="usuario"
		idObjeto={perfilUsuario.id_usuario}
		on:guardar={handleGuardarResena}
		on:cerrar={cerrarModalResena}
	/>
{/if}

<!-- Modal de editar categorías favoritas (solo en perfil propio) -->
{#if mostrarModalCategorias && esMiPerfil}
	<EditarCategoriasModal
		bind:mostrar={mostrarModalCategorias}
		categoriasSeleccionadas={perfilUsuario.categorias_preferidas || []}
		on:guardar={handleGuardarCategorias}
		on:cerrar={cerrarModalCategorias}
	/>
{/if}

<!-- Modal de editar tipos de participación favoritas (solo en perfil propio de colaborador) -->
{#if mostrarModalTiposParticipacion && esMiPerfil}
	<EditarTiposParticipacionModal
		bind:mostrar={mostrarModalTiposParticipacion}
		tiposSeleccionados={perfilUsuario.tipos_participacion_preferidas || []}
		on:guardar={handleGuardarTiposParticipacion}
		on:cerrar={cerrarModalTiposParticipacion}
	/>
{/if}

