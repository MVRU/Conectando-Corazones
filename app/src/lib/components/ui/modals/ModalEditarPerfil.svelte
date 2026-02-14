<script lang="ts">
	import { onMount } from 'svelte';
	import type { Usuario, Institucion, Organizacion } from '$lib/domain/types/Usuario';
	import type { Writable, Readable } from 'svelte/store';
	import type { EditarPerfilForm } from '$lib/domain/types/forms/EditarPerfilForm';
	import type { Localidad } from '$lib/domain/entities/Localidad';
	import type { Provincia } from '$lib/domain/entities/Provincia';
	import MetodosContactoForm from '$lib/components/ui/forms/MetodosContactoForm.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';

	// Estado para provincias cargadas desde API
	let provincias: Provincia[] = [];
	let cargandoProvincias = true;
	let subiendoFoto = false;
	let pendingUploadMetadata: {
		url: string;
		nombreArchivo: string;
		tipoMime: string;
		tamanio: number;
	} | null = null;

	import type { Contacto } from '$lib/domain/types/Contacto';
	import { toastStore } from '$lib/stores/toast';
	import { env } from '$lib/infrastructure/config/env';

	async function handleFileUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		// Validaciones
		const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
		if (!tiposPermitidos.includes(file.type)) {
			toastStore.show({
				variant: 'error',
				title: 'Formato no válido',
				message: 'Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP).'
			});
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			toastStore.show({
				variant: 'error',
				title: 'Archivo muy grande',
				message: 'La imagen no debe superar los 5MB.'
			});
			return;
		}

		subiendoFoto = true;
		try {
			// 1. Obtener URL firmada
			const response = await fetch('/api/storage/upload-url', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					nombre_archivo: file.name,
					tipo_mime: file.type,
					bucket: 'avatars'
				})
			});

			const { uploadUrl, fullPath, error } = await response.json();
			if (error) throw new Error(error);

			// 2. Subir archivo
			const uploadRes = await fetch(uploadUrl, {
				method: 'PUT',
				body: file,
				headers: { 'Content-Type': file.type }
			});

			if (!uploadRes.ok) throw new Error('Error al subir la imagen');

			// 3. Construir URL pública
			// Supabase Storage URL convention
			const publicUrl = `${env.SUPABASE_URL}/storage/v1/object/public/${fullPath}`;

			// 4. Actualizar estado
			onActualizarCampo('url_foto', publicUrl);

			// 5. Guardar metadata para persistencia
			pendingUploadMetadata = {
				url: publicUrl,
				nombreArchivo: file.name,
				tipoMime: file.type,
				tamanio: file.size
			};

			toastStore.show({
				variant: 'success',
				title: 'Foto subida',
				message: 'La foto se ha cargado correctamente. Guardá los cambios para confirmar.'
			});
		} catch (e) {
			console.error('Error subiendo foto:', e);
			toastStore.show({
				variant: 'error',
				title: 'Error de subida',
				message: 'No se pudo subir la foto de perfil.'
			});
		} finally {
			subiendoFoto = false;
			input.value = ''; // Reset input
		}
	}

	type UsuarioCompleto = Usuario | Institucion | Organizacion;

	export let mostrar: boolean;
	export let perfilUsuario: UsuarioCompleto;
	export let datosEdicion: Writable<EditarPerfilForm>;
	export let provinciaSeleccionada: Writable<number | undefined>;
	export let localidadesFiltradas: Readable<Localidad[]>;
	export let errorDescripcion: Readable<string | null>;
	export let onCambiarProvincia: (idProvincia: number | undefined) => void;
	export let onActualizarDescripcion: (valor: string) => void;
	export let onActualizarCampo: (campo: keyof EditarPerfilForm, valor: any) => void;
	export let edicion: {
		validarDescripcion: (descripcion: string) => string | null;
		actualizarCampo: (campo: keyof EditarPerfilForm, valor: any) => void;
	};

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	function handleSubmit() {
		dispatch('guardar');
	}

	function handleCerrar() {
		dispatch('cerrar');
	}

	// Cargar provincias desde API
	onMount(async () => {
		try {
			const response = await fetch('/api/ubicaciones/provincias');
			if (response.ok) {
				provincias = await response.json();
			}
		} catch (e) {
			console.error('Error cargando provincias:', e);
		} finally {
			cargandoProvincias = false;
		}
	});

	function handleCambioProvinciaLocal() {
		onCambiarProvincia($provinciaSeleccionada);
	}

	async function handleGuardarClick() {
		if (formContactos) {
			if (!formContactos.isValid()) {
				toastStore.show({
					variant: 'error',
					title: 'Datos de contacto inválidos',
					message:
						'Por favor, revisá los métodos de contacto. Asegurate de completarlos o eliminarlos si están vacíos.'
				});
				return;
			}
			edicion.actualizarCampo('contactos', formContactos.getValues());
		}

		// Subida de foto (si aplica)
		if (pendingUploadMetadata) {
			try {
				const response = await fetch('/api/usuarios/me/foto', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(pendingUploadMetadata)
				});

				if (!response.ok) {
					throw new Error('Error al guardar la foto en el sistema');
				}

				// Limpiar metadata tras éxito
				pendingUploadMetadata = null;
			} catch (e) {
				console.error('Error persistiendo foto:', e);
				toastStore.show({
					variant: 'error',
					title: 'Error de guardado',
					message: 'La foto se subió pero no se pudo registrar en tu perfil. Intentá nuevamente.'
				});
				return;
			}
		}

		handleSubmit();
	}

	function obtenerNombreUsuario(usuario: UsuarioCompleto): string {
		if (usuario.rol === 'institucion') {
			return (usuario as any).nombre_legal || usuario.nombre;
		}
		return `${usuario.nombre} ${usuario.apellido}`;
	}

	function campoNombreDeshabilitado(usuario: UsuarioCompleto): boolean {
		if (usuario.rol === 'institucion') return true;
		if (usuario.rol === 'colaborador' && (usuario as any).tipo_colaborador === 'unipersonal') {
			return true;
		}
		return false;
	}

	$: nombreUsuario = obtenerNombreUsuario(perfilUsuario);
	$: nombreDeshabilitado = campoNombreDeshabilitado(perfilUsuario);
	$: tituloSeccionNombre =
		perfilUsuario.rol === 'institucion' ? 'Representante legal' : 'Información personal';
	$: mensajeDeshabilitado =
		perfilUsuario.rol === 'institucion'
			? 'El nombre del representante legal no puede modificarse'
			: 'Los usuarios unipersonales no pueden modificar su nombre';
	$: placeholderDescripcion =
		perfilUsuario.rol === 'institucion'
			? 'Describí tu institución, misión, valores...'
			: 'Describí tus intereses, experiencia, motivaciones...';
	$: labelDescripcion =
		perfilUsuario.rol === 'institucion' ? 'Contanos sobre tu institución' : 'Contanos sobre vos';

	$: tieneFoto = $datosEdicion.url_foto && $datosEdicion.url_foto !== '/logo-1.png';

	let formContactos: MetodosContactoForm;
</script>

{#if mostrar}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm sm:p-6"
		on:click={handleCerrar}
		on:keydown={(e) => e.key === 'Escape' && handleCerrar()}
		role="presentation"
		tabindex="-1"
	>
		<!-- Modal container -->
		<div
			class="flex max-h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl focus:outline-none"
			on:click|stopPropagation
			on:keydown={(e) => e.key === 'Escape' && handleCerrar()}
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
			tabindex="-1"
		>
			<!-- Header -->
			<div
				class="z-20 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4"
			>
				<h3 id="modal-title" class="text-xl font-bold text-gray-900">Editar perfil</h3>
				<button
					on:click={handleCerrar}
					aria-label="Cerrar modal"
					class="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:ring-2 focus:ring-gray-200 focus:outline-none"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<div class="grid flex-1 translate-y-0 overflow-hidden bg-white md:grid-cols-12">
				<div
					class="col-span-1 flex flex-col items-center overflow-y-auto border-b border-gray-100 bg-gray-50 p-6 text-center md:col-span-3 md:border-r md:border-b-0"
				>
					<div class="group relative mb-4">
						<div
							class="h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg ring-1 ring-gray-200"
						>
							<img
								src={$datosEdicion.url_foto || '/logo-1.png'}
								alt="Foto de perfil"
								class="h-full w-full object-cover"
							/>
						</div>

						<button
							type="button"
							class="absolute right-1 bottom-1 cursor-pointer rounded-full bg-blue-600 p-2.5 text-white shadow-md transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-blue-400"
							aria-label="Cambiar foto de perfil"
							disabled={subiendoFoto}
							on:click={() => document.getElementById('file-upload')?.click()}
						>
							{#if subiendoFoto}
								<svg
									class="h-4 w-4 animate-spin"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
									></circle>
									<path
										class="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
							{:else}
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
							{/if}
						</button>
						<input
							id="file-upload"
							type="file"
							accept="image/*"
							disabled={subiendoFoto}
							on:change={handleFileUpload}
							class="sr-only"
						/>
					</div>

					<h4 class="mb-1 text-lg font-bold text-gray-900">{nombreUsuario}</h4>
					<p class="mb-6 text-sm break-words text-gray-500 capitalize">{perfilUsuario.rol}</p>
				</div>

				<div class="col-span-1 flex flex-col overflow-hidden bg-white md:col-span-9">
					<div class="scrollbar-hide flex-1 overflow-y-auto px-6 pb-6 sm:px-8">
						<!-- Información personal -->
						<section class="space-y-4">
							<h4 class="border-b border-gray-100 pb-2 text-lg font-bold text-gray-900">
								{tituloSeccionNombre}
							</h4>
							<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
								<div>
									<label for="nombre" class="mb-1.5 block text-sm font-medium text-gray-700"
										>Nombre</label
									>
									{#if nombreDeshabilitado}
										<div
											class="relative rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-500 opacity-75"
											title={mensajeDeshabilitado}
										>
											<span class="block truncate">{$datosEdicion.nombre}</span>
											<div
												class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
											>
												<svg
													class="h-4 w-4 text-gray-400"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
													/>
												</svg>
											</div>
										</div>
									{:else}
										<input
											type="text"
											id="nombre"
											bind:value={$datosEdicion.nombre}
											class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
										/>
									{/if}
								</div>
								<div>
									<label for="apellido" class="mb-1.5 block text-sm font-medium text-gray-700"
										>Apellido</label
									>
									{#if nombreDeshabilitado}
										<div
											class="relative rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-500 opacity-75"
											title={mensajeDeshabilitado}
										>
											<span class="block truncate">{$datosEdicion.apellido}</span>
										</div>
									{:else}
										<input
											type="text"
											id="apellido"
											bind:value={$datosEdicion.apellido}
											class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
										/>
									{/if}
								</div>
							</div>
						</section>

						<!-- Ubicación -->
						<section class="space-y-4">
							<h4 class="border-b border-gray-100 pb-2 text-lg font-bold text-gray-900">
								Ubicación
							</h4>
							<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
								<div>
									<label for="provincia" class="mb-1.5 block text-sm font-medium text-gray-700"
										>Provincia</label
									>
									<select
										id="provincia"
										bind:value={$provinciaSeleccionada}
										on:change={handleCambioProvinciaLocal}
										disabled={cargandoProvincias}
										class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400 sm:text-sm"
									>
										<option value={undefined}>
											{cargandoProvincias ? 'Cargando...' : 'Seleccioná una provincia'}
										</option>
										{#each provincias as prov}
											<option value={prov.id_provincia}>{prov.nombre}</option>
										{/each}
									</select>
								</div>
								<div>
									<label for="localidad" class="mb-1.5 block text-sm font-medium text-gray-700"
										>Localidad</label
									>
									<select
										id="localidad"
										bind:value={$datosEdicion.localidad_id}
										disabled={$provinciaSeleccionada === undefined}
										class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400 sm:text-sm"
									>
										<option value={undefined}>
											{$provinciaSeleccionada === undefined
												? 'Primero elegí provincia'
												: 'Seleccioná localidad'}
										</option>
										{#each $localidadesFiltradas as loc}
											<option value={loc.id_localidad}>{loc.nombre}</option>
										{/each}
									</select>
								</div>
							</div>
						</section>

						<!-- Descripción -->
						<section class="space-y-4">
							<div class="flex items-baseline justify-between border-b border-gray-100 pb-2">
								<h4 class="text-lg font-bold text-gray-900">Descripción</h4>
								<span
									class="text-xs text-gray-500 {($datosEdicion.descripcion?.length || 0) > 500
										? 'font-bold text-red-600'
										: ''}"
								>
									{$datosEdicion.descripcion?.length || 0}/500
								</span>
							</div>

							<div>
								<label for="descripcion" class="sr-only">
									{labelDescripcion}
								</label>
								<textarea
									id="descripcion"
									value={$datosEdicion.descripcion}
									on:input={(e) => onActualizarDescripcion(e.currentTarget.value)}
									rows="4"
									maxlength="500"
									placeholder={placeholderDescripcion}
									class="block w-full resize-none rounded-lg shadow-sm {$errorDescripcion
										? 'border-red-300 focus:border-red-500 focus:ring-red-500'
										: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} sm:text-sm"
								></textarea>
								{#if $errorDescripcion}
									<p class="mt-2 flex animate-pulse items-center gap-1.5 text-sm text-red-600">
										<svg
											class="h-4 w-4"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
											/>
										</svg>
										{$errorDescripcion}
									</p>
								{/if}
							</div>
						</section>

						<!-- Información de contacto -->
						<section class="space-y-4 pb-4">
							<h4 class="border-b border-gray-100 pb-2 text-lg font-bold text-gray-900">
								Métodos de contacto
							</h4>
							<div class="rounded-lg border border-gray-100 bg-gray-50 p-4 sm:p-5">
								<MetodosContactoForm
									bind:this={formContactos}
									valoresIniciales={$datosEdicion.contactos}
									mostrarOmitir={false}
									bloquearPrimerContacto={true}
									ocultarBotones={true}
								/>
							</div>
						</section>
					</div>

					<!-- Footer con botones -->
					<div class="z-10 border-t border-gray-100 bg-gray-50/50 px-6 py-4 sm:px-8">
						<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
							<button
								type="button"
								class="min-w-[120px] rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 focus:outline-none"
								on:click={handleCerrar}
							>
								Cancelar
							</button>
							<button
								type="button"
								class="min-w-[140px] rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none"
								on:click={handleGuardarClick}
							>
								Guardar cambios
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
