<script lang="ts">
	import type { Usuario, Institucion, Organizacion } from '$lib/types/Usuario';
	import type { Writable, Readable } from 'svelte/store';
	import type { EditarPerfilForm } from '$lib/types/forms/EditarPerfilForm';
	import type { Localidad } from '$lib/types/Localidad';
	import { provincias } from '$lib/data/provincias';
	import MetodosContactoForm from '$lib/components/forms/MetodosContactoForm.svelte';
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
	$: tituloSeccionNombre = perfilUsuario.rol === 'institucion' 
		? 'Representante Legal' 
		: 'Información Personal';
	$: mensajeDeshabilitado = perfilUsuario.rol === 'institucion'
		? 'El nombre del representante legal no puede modificarse'
		: 'Los usuarios unipersonales no pueden modificar su nombre';
	$: placeholderDescripcion = perfilUsuario.rol === 'institucion'
		? 'Describe tu institución, misión, valores...'
		: 'Describe tus intereses, experiencia, motivaciones...';
	$: labelDescripcion = perfilUsuario.rol === 'institucion'
		? 'Cuéntanos sobre tu institución'
		: 'Cuéntanos sobre vos';
</script>

{#if mostrar}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" on:click={handleCerrar}>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-xl" on:click|stopPropagation>
			<div class="mb-6 flex items-center justify-between">
				<h3 class="text-xl font-semibold text-gray-900">Editar Perfil</h3>
				<div class="flex items-center gap-4 flex-1 justify-end">
					<p class="text-lg font-semibold text-gray-900">{nombreUsuario}</p>
					<button
						on:click={handleCerrar}
						aria-label="Cerrar modal"
						class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
			</div>

			<form on:submit|preventDefault={handleSubmit} class="space-y-6">
				<!-- Sección de foto de perfil -->
				<div class="border-b border-gray-200 pb-6">
					<h4 class="text-lg font-medium text-gray-900 mb-4">Foto de Perfil</h4>
					<div class="flex items-center gap-6">
						<div class="relative">
							<img
								src={$datosEdicion.url_foto || '/logo-1.png'}
								alt="Foto de perfil"
								class="h-20 w-20 rounded-full object-cover"
							/>
						</div>
						<div>
							<input
								type="file"
								accept="image/*"
								on:change={onCambioFoto}
								class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
							/>
							<p class="text-sm text-gray-500 mt-1">JPG, PNG o GIF. Máximo 5MB.</p>
						</div>
					</div>
				</div>

				<!-- Información personal -->
				<div class="border-b border-gray-200 pb-6">
					<h4 class="text-lg font-medium text-gray-900 mb-4">{tituloSeccionNombre}</h4>
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<label for="nombre" class="block text-sm font-medium text-gray-700">Nombre</label>
							{#if nombreDeshabilitado}
								<input
									type="text"
									id="nombre"
									bind:value={$datosEdicion.nombre}
									disabled
									class="mt-1 block w-full rounded-lg border-gray-300 bg-gray-100 shadow-sm cursor-not-allowed text-gray-500"
									title={mensajeDeshabilitado}
								/>
							{:else}
								<input
									type="text"
									id="nombre"
									bind:value={$datosEdicion.nombre}
									class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
								/>
							{/if}
						</div>
						<div>
							<label for="apellido" class="block text-sm font-medium text-gray-700">Apellido</label>
							{#if nombreDeshabilitado}
								<input
									type="text"
									id="apellido"
									bind:value={$datosEdicion.apellido}
									disabled
									class="mt-1 block w-full rounded-lg border-gray-300 bg-gray-100 shadow-sm cursor-not-allowed text-gray-500"
									title={mensajeDeshabilitado}
								/>
							{:else}
								<input
									type="text"
									id="apellido"
									bind:value={$datosEdicion.apellido}
									class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
								/>
							{/if}
						</div>
					</div>
				</div>

				<!-- Ubicación -->
				<div class="border-b border-gray-200 pb-6">
					<h4 class="text-lg font-medium text-gray-900 mb-4">Ubicación</h4>
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<label for="provincia" class="block text-sm font-medium text-gray-700">Provincia</label>
							<select
								id="provincia"
								bind:value={$provinciaSeleccionada}
								on:change={handleCambioProvinciaLocal}
								class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							>
								<option value={undefined}>Selecciona una provincia</option>
								{#each provincias as prov}
									<option value={prov.id_provincia}>{prov.nombre}</option>
								{/each}
							</select>
						</div>
						<div>
							<label for="localidad" class="block text-sm font-medium text-gray-700">Localidad</label>
							<select
								id="localidad"
								bind:value={$datosEdicion.localidad_id}
								disabled={$provinciaSeleccionada === undefined}
								class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 {$provinciaSeleccionada === undefined ? 'bg-gray-100 cursor-not-allowed' : ''}"
							>
								<option value={undefined}>
									{$provinciaSeleccionada === undefined ? 'Primero selecciona una provincia' : 'Selecciona una localidad'}
								</option>
								{#each $localidadesFiltradas as loc}
									<option value={loc.id_localidad}>{loc.nombre}</option>
								{/each}
							</select>
						</div>
					</div>
				</div>

				<!-- Descripción -->
				<div class="border-b border-gray-200 pb-6">
					<h4 class="text-lg font-medium text-gray-900 mb-4">Descripción</h4>
					<div>
						<label for="descripcion" class="block text-sm font-medium text-gray-700 mb-1">
							{labelDescripcion}
						</label>
						<textarea
							id="descripcion"
							value={$datosEdicion.descripcion}
							on:input={(e) => onActualizarDescripcion(e.currentTarget.value)}
							rows="4"
							maxlength="500"
							placeholder={placeholderDescripcion}
							class="mt-1 block w-full rounded-lg shadow-sm focus:ring-blue-500 {$errorDescripcion ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}"
						></textarea>
						{#if $errorDescripcion}
							<p class="mt-1 flex items-center gap-1 text-sm text-red-600">
								<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
								</svg>
								{$errorDescripcion}
							</p>
						{/if}
						<p class="mt-1 text-xs {($datosEdicion.descripcion?.length || 0) > 500 ? 'text-red-600' : 'text-gray-500'}">
							Caracteres: {$datosEdicion.descripcion?.length || 0} / 500
						</p>
					</div>
				</div>

				<!-- Información de contacto -->
				<div class="pb-6">
					<h4 class="text-lg font-medium text-gray-900 mb-4">Métodos de Contacto</h4>
					<MetodosContactoForm
						valoresIniciales={$datosEdicion.contactos}
						mostrarOmitir={false}
						on:submit={handleGuardarContactos}
					>
						<svelte:fragment slot="botones-extra">
							<Button
								label="Cancelar"
								variant="secondary"
								size="md"
								type="button"
								on:click={handleCerrar}
								customClass="w-full md:w-auto"
							/>
						</svelte:fragment>
					</MetodosContactoForm>
				</div>
			</form>
		</div>
	</div>
{/if}
