<!--
	* Componente: ProyectoUbicaciones
  	-*- Para agregar las ubicaciones del proyecto
 -->

<script lang="ts">
	import { provincias } from '$lib/data/provincias';
	import { mockLocalidades } from '$lib/mocks/mock-localidades';
	import { TIPO_UBICACION, MODALIDAD_UBICACION, type TipoUbicacion, type ModalidadUbicacion } from '$lib/types/Ubicacion';
	import type { UbicacionFormulario, DireccionPresencialFormulario } from '$lib/types/forms/CrearProyectoForm';
	import {
		obtenerDescripcionTipo
	} from '$lib/utils/util-proyecto-form';
	import { obtenerLocalidadesPorProvincia } from '$lib/utils/util-ubicaciones';

	export let ubicaciones: UbicacionFormulario[] = [];
	export let errores: Record<string, string> = {};



	function agregarUbicacion() {
		ubicaciones = [
			...ubicaciones,
			{
				tipo_ubicacion: '',
				modalidad: '',
				direccion_presencial: {
					calle: '',
					numero: '',
					referencia: '',
					localidad_id: undefined,
					provincia: '',
					localidad_nombre: ''
				},
				url_virtual: ''
			}
		];
	}

	function esTipoPredefinido(tipo: string): boolean {
		return ['principal', 'voluntariado'].includes(tipo);
	}

	function manejarCambioTipo(index: number, valor: string) {
		if (valor === 'personalizado') {
			// Si selecciona "personalizado", cambiar a un valor que active el input
			actualizarUbicacion(index, 'tipo_ubicacion', 'personalizado_input');
		} else {
			actualizarUbicacion(index, 'tipo_ubicacion', valor);
		}
	}

	function eliminarUbicacion(index: number) {
		if (index === 0) return;
		if (ubicaciones.length > 1) {
			ubicaciones = ubicaciones.filter((_, i) => i !== index);
		}
	}

	function actualizarUbicacion(
		index: number,
		campo: 'tipo_ubicacion' | 'modalidad',
		valor: string
	) {
		// Simplemente actualizamos el valor sin restricciones
		ubicaciones[index] = { ...ubicaciones[index], [campo]: valor };
		ubicaciones = ubicaciones;
		
		// Limpiar datos cuando cambia modalidad
		if (campo === 'modalidad') {
			if (valor === 'virtual') {
				ubicaciones[index].direccion_presencial = {
					calle: '',
					numero: '',
					referencia: '',
					localidad_id: undefined,
					provincia: '',
					localidad_nombre: ''
				};
			} else if (valor === 'presencial') {
				ubicaciones[index].url_virtual = '';
			}
		}
	}

	function actualizarDireccion(
		index: number,
		campo: keyof DireccionPresencialFormulario,
		valor: string | number | undefined
	) {
		if (!ubicaciones[index].direccion_presencial) {
			ubicaciones[index].direccion_presencial = {
				calle: '',
				numero: '',
				referencia: '',
				localidad_id: undefined,
				provincia: '',
				localidad_nombre: ''
			};
		}
		ubicaciones[index] = {
			...ubicaciones[index],
			direccion_presencial: { ...ubicaciones[index].direccion_presencial!, [campo]: valor }
		};
		ubicaciones = ubicaciones;
		if (campo === 'provincia') {
			ubicaciones[index].direccion_presencial!.localidad_nombre = '';
			ubicaciones[index].direccion_presencial!.localidad_id = undefined;
		}
	}

	$: ubicacionesConTipo = ubicaciones
		.map((u, i) => ({ i, tipo: (u.tipo_ubicacion || '').trim() }))
		.filter((x) => x.tipo);

	$: esUnicaBasica =
		ubicacionesConTipo.length === 1 &&
		(ubicacionesConTipo[0]?.tipo === 'principal' || ubicacionesConTipo[0]?.tipo === 'virtual');

	$: indiceUnicaBasica = esUnicaBasica ? ubicacionesConTipo[0].i : -1;
</script>

<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
	<div class="mb-3 flex items-center justify-between">
		<h2 class="text-xl font-semibold text-gray-900">Ubicaciones del proyecto *</h2>
	</div>

	{#if errores.ubicaciones}
		<p class="mb-4 text-sm text-red-600">{errores.ubicaciones}</p>
	{/if}
	{#if errores.ubicaciones_principal}
		<p class="mb-4 text-sm text-red-600">{errores.ubicaciones_principal}</p>
	{/if}

	{#each ubicaciones as ubicacion, index (index)}
		<div class="mb-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
			<div class="mb-4 flex items-center justify-between">
				<h3 class="font-medium text-gray-900">Ubicación {index + 1}</h3>
				{#if ubicaciones.length > 1 && index > 0}
					<button
						type="button"
						on:click={() => eliminarUbicacion(index)}
						class="text-sm font-medium text-red-600 hover:text-red-800">Eliminar</button
					>
				{/if}
			</div>

			<div class="grid gap-4">
				<div>
					<label for="tipo_{index}" class="mb-2 block text-sm font-medium text-gray-700"
						>Tipo de ubicación *</label
					>
					{#if esTipoPredefinido(ubicacion.tipo_ubicacion) || ubicacion.tipo_ubicacion === ''}
						<!-- Dropdown para tipos predefinidos -->
						<select
							id="tipo_{index}"
							value={ubicacion.tipo_ubicacion}
							on:change={(e) => manejarCambioTipo(index, e.currentTarget.value)}
							class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
							class:border-red-300={errores[`ubicacion_${index}_tipo`]}
						>
							<option value="">Seleccionar tipo</option>
							{#each TIPO_UBICACION as tipo (tipo)}
								<option value={tipo}>{obtenerDescripcionTipo(tipo)}</option>
							{/each}
							<option value="personalizado">Otro...</option>
						</select>
					{:else}
						<!-- Input para tipos personalizados -->
						<div class="flex gap-2">
							<input
								id="tipo_{index}"
								type="text"
								value={ubicacion.tipo_ubicacion === 'personalizado_input' ? '' : ubicacion.tipo_ubicacion}
								on:input={(e) => actualizarUbicacion(index, 'tipo_ubicacion', e.currentTarget.value)}
								placeholder="Escriba el tipo de ubicación..."
								class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
								class:border-red-300={errores[`ubicacion_${index}_tipo`]}
							/>
							<button
								type="button"
								on:click={() => actualizarUbicacion(index, 'tipo_ubicacion', '')}
								class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
								title="Volver a opciones predefinidas"
							>
								↺
							</button>
						</div>
					{/if}
					{#if errores[`ubicacion_${index}_tipo`]}
						<p class="mt-1 text-sm text-red-600">{errores[`ubicacion_${index}_tipo`]}</p>
					{/if}
				</div>

				<div>
					<label for="modalidad_{index}" class="mb-2 block text-sm font-medium text-gray-700"
						>Modalidad *</label
					>
					<select
						id="modalidad_{index}"
						value={ubicacion.modalidad}
						on:change={(e) => actualizarUbicacion(index, 'modalidad', e.currentTarget.value)}
						class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
						class:border-red-300={errores[`ubicacion_${index}_modalidad`]}
					>
						<option value="">Seleccionar modalidad</option>
						{#each MODALIDAD_UBICACION as modalidad (modalidad)}
							<option value={modalidad}>{modalidad === 'presencial' ? 'Presencial' : 'Virtual'}</option>
						{/each}
					</select>
					{#if errores[`ubicacion_${index}_modalidad`]}
						<p class="mt-1 text-sm text-red-600">{errores[`ubicacion_${index}_modalidad`]}</p>
					{/if}
				</div>

				{#if ubicacion.modalidad === 'virtual'}
					<div>
						<label for="url_virtual_{index}" class="mb-2 block text-sm font-medium text-gray-700"
							>URL Virtual *</label
						>
						<input
							id="url_virtual_{index}"
							type="url"
							value={ubicacion.url_virtual || ''}
							on:input={(e) => {
								ubicaciones[index] = { ...ubicaciones[index], url_virtual: e.currentTarget.value };
								ubicaciones = ubicaciones;
							}}
							class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
							class:border-red-300={errores[`ubicacion_${index}_url_virtual`]}
							placeholder="https://meet.google.com/abc-defg-hij"
						/>
						{#if errores[`ubicacion_${index}_url_virtual`]}
							<p class="mt-1 text-sm text-red-600">{errores[`ubicacion_${index}_url_virtual`]}</p>
						{/if}
					</div>
				{/if}

				{#if ubicacion.modalidad === 'presencial'}
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<label for="provincia_{index}" class="mb-2 block text-sm font-medium text-gray-700"
								>Provincia *</label
							>
							<select
								id="provincia_{index}"
								value={ubicacion.direccion_presencial?.provincia}
								on:change={(e) => actualizarDireccion(index, 'provincia', e.currentTarget.value)}
								class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
								class:border-red-300={errores[`ubicacion_${index}_provincia`]}
							>
								<option value="">Seleccionar provincia</option>
								{#each provincias as provincia (provincia.id_provincia)}
									<option value={provincia.nombre}>{provincia.nombre}</option>
								{/each}
							</select>
							{#if errores[`ubicacion_${index}_provincia`]}
								<p class="mt-1 text-sm text-red-600">{errores[`ubicacion_${index}_provincia`]}</p>
							{/if}
						</div>
						<div>
							<label for="localidad_{index}" class="mb-2 block text-sm font-medium text-gray-700"
								>Localidad *</label
							>
							<select
								id="localidad_{index}"
								value={ubicacion.direccion_presencial?.localidad_id || ''}
								on:change={(e) => {
									const localidadId = e.currentTarget.value
										? parseInt(e.currentTarget.value)
										: undefined;
									const localidad = obtenerLocalidadesPorProvincia(ubicacion.direccion_presencial?.provincia || '').find(
										(l) => l.id_localidad === localidadId
									);
									ubicaciones[index] = {
										...ubicaciones[index],
										direccion_presencial: {
											...ubicaciones[index].direccion_presencial!,
											localidad_id: localidadId,
											localidad_nombre: localidad?.nombre || ''
										}
									};
									ubicaciones = ubicaciones;
								}}
								disabled={!ubicacion.direccion_presencial?.provincia}
								class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 disabled:bg-gray-100"
								class:border-red-300={errores[`ubicacion_${index}_localidad`]}
							>
								<option value="">Seleccionar localidad</option>
								{#each obtenerLocalidadesPorProvincia(ubicacion.direccion_presencial?.provincia || '') as localidad (localidad.id_localidad)}
									<option value={localidad.id_localidad}>{localidad.nombre}</option>
								{/each}
							</select>
							{#if errores[`ubicacion_${index}_localidad`]}
								<p class="mt-1 text-sm text-red-600">{errores[`ubicacion_${index}_localidad`]}</p>
							{/if}
						</div>
					</div>

					<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
						<div class="md:col-span-2">
							<label for="calle_{index}" class="mb-2 block text-sm font-medium text-gray-700"
								>Calle *</label
							>
								<input
									id="calle_{index}"
									type="text"
									value={ubicacion.direccion_presencial?.calle}
									on:input={(e) => actualizarDireccion(index, 'calle', e.currentTarget.value)}
									class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
									class:border-red-300={errores[`ubicacion_${index}_calle`]}
									placeholder="Nombre de la calle"
								/>
								{#if errores[`ubicacion_${index}_calle`]}
									<p class="mt-1 text-sm text-red-600">{errores[`ubicacion_${index}_calle`]}</p>
								{/if}
						</div>
						<div>
							<label for="numero_{index}" class="mb-2 block text-sm font-medium text-gray-700"
								>Número *</label
							>
								<input
									id="numero_{index}"
									type="text"
									value={ubicacion.direccion_presencial?.numero}
									on:input={(e) => actualizarDireccion(index, 'numero', e.currentTarget.value)}
									class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
									class:border-red-300={errores[`ubicacion_${index}_numero`]}
									placeholder="1234"
								/>
								{#if errores[`ubicacion_${index}_numero`]}
									<p class="mt-1 text-sm text-red-600">{errores[`ubicacion_${index}_numero`]}</p>
								{/if}
						</div>
					</div>

					<div>
						<label for="referencia_{index}" class="mb-2 block text-sm font-medium text-gray-700"
							>Referencia</label
						>
						<textarea
							id="referencia_{index}"
							value={ubicacion.direccion_presencial?.referencia}
							on:input={(e) => actualizarDireccion(index, 'referencia', e.currentTarget.value)}
							rows="2"
							class="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
						></textarea>
					</div>
				{/if}
			</div>
		</div>
	{/each}
	<div class="flex justify-center">
		<button
			type="button"
			on:click={agregarUbicacion}
			class="flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
		>
			<span class="text-xl">+</span>
			Agregar ubicación
		</button>
	</div>
</div>
