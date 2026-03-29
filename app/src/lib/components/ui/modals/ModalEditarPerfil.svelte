<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import type { Usuario, Institucion, Colaborador, Organizacion } from '$lib/domain/types/Usuario';
	import type { Writable, Readable } from 'svelte/store';
	import type { EditarPerfilForm } from '$lib/domain/types/forms/EditarPerfilForm';
	import type { Localidad } from '$lib/domain/entities/Localidad';
	import type { Provincia } from '$lib/domain/entities/Provincia';
	import MetodosContactoForm from '$lib/components/ui/forms/MetodosContactoForm.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { toastStore } from '$lib/stores/toast';

	let provincias: Provincia[] = [];
	let cargandoProvincias = true;
	let subiendoFoto = false;
	let pendingUploadMetadata: {
		url: string;
		nombreArchivo: string;
		tipoMime: string;
		tamanio: number;
	} | null = null;

	let modoFoto: 'upload' | 'url' = 'upload';
	let urlFotoManual = '';
	let validandoUrl = false;

	import { env } from '$lib/infrastructure/config/env';

	async function handleFileUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

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

			const uploadRes = await fetch(uploadUrl, {
				method: 'PUT',
				body: file,
				headers: { 'Content-Type': file.type }
			});

			if (!uploadRes.ok) throw new Error('Error al subir la imagen');

			const publicUrl = `${env.SUPABASE_URL}/storage/v1/object/public/${fullPath}`;

			onActualizarCampo('url_foto', publicUrl);

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

	async function handleUrlUpload() {
		if (!urlFotoManual) {
			toastStore.show({
				variant: 'error',
				title: 'URL vacía',
				message: 'Por favor ingresá una dirección de imagen válida.'
			});
			return;
		}

		if (!urlFotoManual.startsWith('http')) {
			toastStore.show({
				variant: 'error',
				title: 'URL inválida',
				message: 'La dirección debe comenzar con http:// o https://'
			});
			return;
		}

		validandoUrl = true;
		try {
			// Intentar cargar la imagen para validar que existe y es una imagen
			await new Promise((resolve, reject) => {
				const img = new Image();
				img.onload = resolve;
				img.onerror = () => reject(new Error('No se pudo cargar la imagen desde esa URL.'));
				img.src = urlFotoManual;
				// Timeout de 5 segundos
				setTimeout(() => reject(new Error('Tiempo de espera agotado al validar la imagen.')), 5000);
			});

			onActualizarCampo('url_foto', urlFotoManual);

			pendingUploadMetadata = {
				url: urlFotoManual,
				nombreArchivo: urlFotoManual.split('/').pop()?.split('?')[0] || 'foto-externa.jpg',
				tipoMime: 'image/jpeg', // Default
				tamanio: 0
			};

			toastStore.show({
				variant: 'success',
				title: 'Enlace validado',
				message: 'La imagen se vinculó correctamente. Guardá los cambios para confirmar.'
			});
		} catch (e) {
			console.error('Error validando URL de foto:', e);
			toastStore.show({
				variant: 'error',
				title: 'Error de validación',
				message: e instanceof Error ? e.message : 'No se pudo validar el enlace de la imagen.'
			});
		} finally {
			validandoUrl = false;
		}
	}

	function setModoFoto(nuevoModo: 'upload' | 'url') {
		modoFoto = nuevoModo;
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
	export let onActualizarCampo: (campo: keyof EditarPerfilForm, valor: EditarPerfilForm[keyof EditarPerfilForm]) => void;
	export let edicion: {
		validarDescripcion: (descripcion: string) => string | null;
		actualizarCampo: (campo: keyof EditarPerfilForm, valor: EditarPerfilForm[keyof EditarPerfilForm]) => void;
	};
	export let guardando = false;

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	function handleSubmit() {
		dispatch('guardar');
	}

	function handleCerrar() {
		dispatch('cerrar');
	}

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
		return (usuario as Institucion).nombre_legal || usuario.nombre;
		}
		return `${usuario.nombre} ${usuario.apellido}`;
	}

	function campoNombreDeshabilitado(usuario: UsuarioCompleto): boolean {
		if (usuario.rol === 'institucion') return true;
		if (usuario.rol === 'colaborador' && (usuario as Colaborador).tipo_colaborador === 'unipersonal') {
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
		<div
			class="flex max-h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl focus:outline-none"
			on:click|stopPropagation
			on:keydown={(e) => e.key === 'Escape' && handleCerrar()}
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
			tabindex="-1"
		>
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
					<div class="group relative mb-6">
						<div
							class="h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg ring-1 ring-gray-200 transition-transform duration-300 group-hover:scale-[1.02]"
						>
							<img
								src={$datosEdicion.url_foto || '/logo-1.png'}
								alt="Foto de perfil"
								class="h-full w-full object-cover"
							/>
						</div>
					</div>

					<div class="mb-4 w-full px-4 text-left">
						<p class="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
							Cambiar foto
						</p>
						<div class="flex gap-1 rounded-lg border border-gray-200 bg-white p-1 mb-4">
							<button
								type="button"
								class="flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-all {modoFoto ===
								'upload'
									? 'bg-blue-600 text-white shadow-sm'
									: 'text-gray-600 hover:bg-gray-100'}"
								on:click={() => setModoFoto('upload')}
							>
								Subir
							</button>
							<button
								type="button"
								class="flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-all {modoFoto ===
								'url'
									? 'bg-blue-600 text-white shadow-sm'
									: 'text-gray-600 hover:bg-gray-100'}"
								on:click={() => setModoFoto('url')}
							>
								Enlace
							</button>
						</div>

						{#if modoFoto === 'upload'}
							<div class="space-y-3" in:fly={{ y: 10, duration: 200 }}>
								<p class="text-[11px] text-gray-500">Subí un archivo JPG, PNG o WEBP (máx. 5MB).</p>
								<button
									type="button"
									class="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:border-blue-400 hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50"
									disabled={subiendoFoto}
									on:click={() => document.getElementById('file-upload')?.click()}
								>
									{#if subiendoFoto}
										<svg
											class="h-4 w-4 animate-spin text-blue-600"
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
										<span>Subiendo...</span>
									{:else}
										<svg class="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
										</svg>
										<span>Seleccionar archivo</span>
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
						{:else}
							<div class="space-y-3" in:fly={{ y: 10, duration: 200 }}>
								<p class="text-[11px] text-gray-500">Pegá el enlace directo a una imagen pública.</p>
								<div class="relative">
									<input
										type="url"
										placeholder="https://ejemplo.com/mi-foto.jpg"
										bind:value={urlFotoManual}
										class="block w-full rounded-xl border-gray-300 pr-10 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
									/>
									<button
										type="button"
										on:click={handleUrlUpload}
										disabled={validandoUrl || !urlFotoManual}
										class="absolute right-2 top-1.5 rounded-lg bg-blue-100 p-1.5 text-blue-600 transition-colors hover:bg-blue-200 disabled:opacity-50"
										title="Validar URL"
									>
										{#if validandoUrl}
											<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
												<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
												<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
										{:else}
											<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
											</svg>
										{/if}
									</button>
								</div>
							</div>
						{/if}
					</div>

					<h4 class="mb-1 text-lg font-bold text-gray-900">{nombreUsuario}</h4>
					<p class="mb-6 text-sm break-words text-gray-500 capitalize">{perfilUsuario.rol}</p>
				</div>

				<div class="col-span-1 flex flex-col overflow-hidden bg-white md:col-span-9">
					<div class="scrollbar-hide flex-1 overflow-y-auto px-6 pb-6 sm:px-8">
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
										{#each provincias as prov (prov.id_provincia)}
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
										{#each $localidadesFiltradas as loc (loc.id_localidad)}
											<option value={loc.id_localidad}>{loc.nombre}</option>
										{/each}
									</select>
								</div>
							</div>
						</section>

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
									onsubmit={() => {}}
								/>
							</div>
						</section>
					</div>

					<div class="z-10 border-t border-gray-100 bg-gray-50/50 px-6 py-4 sm:px-8">
						<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
							<Button
								onclick={handleCerrar}
								variant="secondary"
								size="sm"
								label="Cancelar"
								disabled={guardando}
								customClass="min-w-[120px]"
							/>
							<Button
								onclick={handleGuardarClick}
								variant="primary"
								size="sm"
								label="Guardar cambios"
								loading={guardando}
								loadingLabel="Guardando..."
								customClass="min-w-[140px]"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
