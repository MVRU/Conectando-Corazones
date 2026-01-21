<script lang="ts">
	import type { Usuario, Institucion, Organizacion } from '$lib/domain/types/Usuario';
	import type { Writable, Readable } from 'svelte/store';
	import type { EditarPerfilForm } from '$lib/domain/types/forms/EditarPerfilForm';
	import type { Localidad } from '$lib/domain/types/Localidad';
	import { provincias } from '\$lib/domain/types/static-data/provincias';
	import MetodosContactoForm from '\$lib/components/ui/forms/MetodosContactoForm.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';

	type UsuarioCompleto = Usuario | Institucion | Organizacion;

	export let mostrar: boolean;
	export let perfilUsuario: UsuarioCompleto;
	export let datosEdicion: Writable<EditarPerfilForm>;
	export let provinciaSeleccionada: Writable<number | undefined>;
	export let localidadesFiltradas: Readable<Localidad[]>;
	export let errorDescripcion: Readable<string | null>;
	export let onCambioFoto: (event: Event) => void;
	export let onCambiarProvincia: (idProvincia: number | undefined) => void;
	export let onActualizarDescripcion: (valor: string) => void;
	export let onActualizarCampo: (campo: keyof EditarPerfilForm, valor: any) => void;

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	function handleSubmit() {
		dispatch('guardar');
	}

	function handleCerrar() {
		dispatch('cerrar');
	}

	function handleCambioProvinciaLocal() {
		onCambiarProvincia($provinciaSeleccionada);
	}

	function handleGuardarContactos(e: CustomEvent) {
		onActualizarCampo('contactos', e.detail);
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

			<div class="grid flex-1 grid-cols-1 overflow-hidden bg-white md:grid-cols-12">
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
							class="absolute right-1 bottom-1 cursor-pointer rounded-full bg-blue-600 p-2.5 text-white shadow-md transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
							aria-label="Cambiar foto de perfil"
							on:click={() => document.getElementById('file-upload')?.click()}
						>
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
						</button>
						<input
							id="file-upload"
							type="file"
							accept="image/*"
							on:change={onCambioFoto}
							class="sr-only"
						/>
					</div>

					<h4 class="mb-1 text-lg font-bold text-gray-900">{nombreUsuario}</h4>
					<p class="mb-6 text-sm text-gray-500 capitalize">{perfilUsuario.rol}</p>
				</div>

				<div class="col-span-1 space-y-8 overflow-y-auto p-6 md:col-span-9 md:p-8">
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
						<h4 class="border-b border-gray-100 pb-2 text-lg font-bold text-gray-900">Ubicación</h4>
						<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
							<div>
								<label for="provincia" class="mb-1.5 block text-sm font-medium text-gray-700"
									>Provincia</label
								>
								<select
									id="provincia"
									bind:value={$provinciaSeleccionada}
									on:change={handleCambioProvinciaLocal}
									class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
								>
									<option value={undefined}>Seleccioná una provincia</option>
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
								valoresIniciales={$datosEdicion.contactos}
								mostrarOmitir={false}
								bloquearPrimerContacto={true}
								on:submit={handleGuardarContactos}
							>
								<svelte:fragment slot="botones-extra">
									<Button
										label="Cancelar"
										variant="secondary"
										size="sm"
										type="button"
										on:click={handleCerrar}
										customClass="w-full md:w-auto"
									/>
								</svelte:fragment>
							</MetodosContactoForm>
						</div>
					</section>
				</div>
			</div>
		</div>
	</div>
{/if}
