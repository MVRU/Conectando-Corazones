<!--
* Componente: ProyectoDirecciones
  -*- Para agregar las ubicaciones del proyecto
 -->
<script lang="ts">
	import { provincias } from '$lib/data/provincias';
	import { mockLocalidades } from '$lib/mocks/mock-localidades';
	import { PRIORIDAD_TIPO, type PrioridadTipo } from '$lib/types/ProyectoUbicacion';
	import type { DireccionFormulario } from '$lib/types/forms/CrearProyectoForm';
	import {
		obtenerPlaceholderQueSehace,
		obtenerDescripcionTipo
	} from '$lib/utils/util-proyecto-form';

	export let direcciones: DireccionFormulario[] = [];
	export let errores: Record<string, string> = {};
	export let limpiarError: (campo: string) => void;

	function obtenerLocalidadesPorProvincia(nombreProvincia: string) {
		const provincia = provincias.find((p) => p.nombre === nombreProvincia);
		if (!provincia) return [];
		return mockLocalidades.filter((l) => l.id_provincia === provincia.id_provincia);
	}

	function agregarDireccion() {
		direcciones = [
			...direcciones,
			{
				tipo_ubicacion: '',
				que_sehace: '',
				calle: '',
				numero: '',
				referencia: '',
				localidad_id: undefined,
				provincia: '',
				localidad_nombre: ''
			}
		];
	}

	const TIPOS_PRIMERA_UBICACION = ['principal', 'virtual'] as const;

	function getIndicePrincipal(): number {
		return direcciones.findIndex((d) => (d.tipo_ubicacion || '').trim() === 'principal');
	}

	function esTipoPermitidoPrimeraUbicacion(tipo: string): boolean {
		return TIPOS_PRIMERA_UBICACION.includes(tipo as (typeof TIPOS_PRIMERA_UBICACION)[number]);
	}

	function tiposPermitidosPara(index: number): ReadonlyArray<PrioridadTipo> {
		const base = PRIORIDAD_TIPO as ReadonlyArray<PrioridadTipo>;
		if (index === 0) {
			return base.filter((t) =>
				esTipoPermitidoPrimeraUbicacion(t as PrioridadTipo)
			) as ReadonlyArray<PrioridadTipo>;
		}
		const indicePrincipal = getIndicePrincipal();
		const seleccionado = (direcciones[index]?.tipo_ubicacion || '') as PrioridadTipo | '';
		if (indicePrincipal !== -1 && indicePrincipal !== index) {
			return seleccionado === 'principal'
				? base
				: (base.filter((t) => t !== 'principal') as ReadonlyArray<PrioridadTipo>);
		}
		return base;
	}

	function eliminarDireccion(index: number) {
		if (index === 0) return;
		if (direcciones.length > 1) {
			direcciones = direcciones.filter((_, i) => i !== index);
		}
	}

	function actualizarDireccion(
		index: number,
		campo: keyof DireccionFormulario,
		valor: string | number | undefined
	) {
		if (campo === 'tipo_ubicacion' && typeof valor === 'string' && valor.trim() === 'principal') {
			const indicePrincipal = getIndicePrincipal();
			if (indicePrincipal !== -1 && indicePrincipal !== index) {
				errores[`direccion_${index}_tipo`] = 'Ya existe una ubicación de tipo "Principal".';
				return;
			} else {
				limpiarError(`direccion_${index}_tipo`);
			}
		}
		if (campo === 'tipo_ubicacion' && index === 0 && typeof valor === 'string') {
			const v = valor.trim();
			if (!esTipoPermitidoPrimeraUbicacion(v)) {
				return;
			}
		}
		direcciones[index] = { ...direcciones[index], [campo]: valor };
		direcciones = direcciones;
		if (campo === 'provincia') {
			direcciones[index].localidad_nombre = '';
			direcciones[index].localidad_id = undefined;
		}
		if (campo === 'tipo_ubicacion' && valor === 'virtual') {
			direcciones[index].provincia = '';
			direcciones[index].localidad_nombre = '';
			direcciones[index].localidad_id = undefined;
			direcciones[index].calle = '';
			direcciones[index].numero = '';
			direcciones[index].referencia = '';
		}
	}

	$: ubicacionesConTipo = direcciones
		.map((d, i) => ({ i, tipo: (d.tipo_ubicacion || '').trim() }))
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

	{#if errores.direcciones}
		<p class="mb-4 text-sm text-red-600">{errores.direcciones}</p>
	{/if}
	{#if errores.direcciones_principal}
		<p class="mb-4 text-sm text-red-600">{errores.direcciones_principal}</p>
	{/if}

	{#each direcciones as direccion, index (index)}
		<div class="mb-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
			<div class="mb-4 flex items-center justify-between">
				<h3 class="font-medium text-gray-900">Ubicación {index + 1}</h3>
				{#if direcciones.length > 1 && index > 0}
					<button
						type="button"
						on:click={() => eliminarDireccion(index)}
						class="text-sm font-medium text-red-600 hover:text-red-800">Eliminar</button
					>
				{/if}
			</div>

			<div class="grid gap-4">
				<div>
					<label for="tipo_{index}" class="mb-2 block text-sm font-medium text-gray-700"
						>Tipo de ubicación *</label
					>
					<select
						id="tipo_{index}"
						value={direccion.tipo_ubicacion}
						on:change={(e) => actualizarDireccion(index, 'tipo_ubicacion', e.currentTarget.value)}
						class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
						class:border-red-300={errores[`direccion_${index}_tipo`]}
					>
						<option value="">Seleccionar tipo</option>
						{#each tiposPermitidosPara(index) as tipo (tipo)}
							<option value={tipo}>{obtenerDescripcionTipo(tipo)}</option>
						{/each}
					</select>
					{#if errores[`direccion_${index}_tipo`]}
						<p class="mt-1 text-sm text-red-600">{errores[`direccion_${index}_tipo`]}</p>
					{/if}
				</div>

				<div>
					<label for="que_sehace_{index}" class="mb-2 block text-sm font-medium text-gray-700"
						>¿Qué se hace en esta ubicación?{indiceUnicaBasica !== index ? ' *' : ''}</label
					>
					<textarea
						id="que_sehace_{index}"
						value={direccion.que_sehace}
						on:input={(e) => actualizarDireccion(index, 'que_sehace', e.currentTarget.value)}
						rows="3"
						class="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
						class:border-red-300={errores[`direccion_${index}_que_sehace`]}
						placeholder={obtenerPlaceholderQueSehace(direccion.tipo_ubicacion)}
					></textarea>
					{#if errores[`direccion_${index}_que_sehace`]}
						<p class="mt-1 text-sm text-red-600">{errores[`direccion_${index}_que_sehace`]}</p>
					{/if}
				</div>

				{#if direccion.tipo_ubicacion !== 'virtual'}
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<label for="provincia_{index}" class="mb-2 block text-sm font-medium text-gray-700"
								>Provincia *</label
							>
							<select
								id="provincia_{index}"
								value={direccion.provincia}
								on:change={(e) => actualizarDireccion(index, 'provincia', e.currentTarget.value)}
								class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
								class:border-red-300={errores[`direccion_${index}_provincia`]}
							>
								<option value="">Seleccionar provincia</option>
								{#each provincias as provincia (provincia.id_provincia)}
									<option value={provincia.nombre}>{provincia.nombre}</option>
								{/each}
							</select>
							{#if errores[`direccion_${index}_provincia`]}
								<p class="mt-1 text-sm text-red-600">{errores[`direccion_${index}_provincia`]}</p>
							{/if}
						</div>
						<div>
							<label for="localidad_{index}" class="mb-2 block text-sm font-medium text-gray-700"
								>Localidad *</label
							>
							<select
								id="localidad_{index}"
								value={direccion.localidad_id || ''}
								on:change={(e) => {
									const localidadId = e.currentTarget.value
										? parseInt(e.currentTarget.value)
										: undefined;
									const localidad = obtenerLocalidadesPorProvincia(direccion.provincia).find(
										(l) => l.id_localidad === localidadId
									);
									direcciones[index] = {
										...direcciones[index],
										localidad_id: localidadId,
										localidad_nombre: localidad?.nombre || ''
									};
									direcciones = direcciones;
								}}
								disabled={!direccion.provincia}
								class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 disabled:bg-gray-100"
								class:border-red-300={errores[`direccion_${index}_localidad`]}
							>
								<option value="">Seleccionar localidad</option>
								{#each obtenerLocalidadesPorProvincia(direccion.provincia) as localidad (localidad.id_localidad)}
									<option value={localidad.id_localidad}>{localidad.nombre}</option>
								{/each}
							</select>
							{#if errores[`direccion_${index}_localidad`]}
								<p class="mt-1 text-sm text-red-600">{errores[`direccion_${index}_localidad`]}</p>
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
								value={direccion.calle}
								on:input={(e) => actualizarDireccion(index, 'calle', e.currentTarget.value)}
								class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
								class:border-red-300={errores[`direccion_${index}_calle`]}
								placeholder="Nombre de la calle"
							/>
							{#if errores[`direccion_${index}_calle`]}
								<p class="mt-1 text-sm text-red-600">{errores[`direccion_${index}_calle`]}</p>
							{/if}
						</div>
						<div>
							<label for="numero_{index}" class="mb-2 block text-sm font-medium text-gray-700"
								>Número *</label
							>
							<input
								id="numero_{index}"
								type="text"
								value={direccion.numero}
								on:input={(e) => actualizarDireccion(index, 'numero', e.currentTarget.value)}
								class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
								class:border-red-300={errores[`direccion_${index}_numero`]}
								placeholder="1234"
							/>
							{#if errores[`direccion_${index}_numero`]}
								<p class="mt-1 text-sm text-red-600">{errores[`direccion_${index}_numero`]}</p>
							{/if}
						</div>
					</div>

					<div>
						<label for="referencia_{index}" class="mb-2 block text-sm font-medium text-gray-700"
							>Referencia</label
						>
						<textarea
							id="referencia_{index}"
							value={direccion.referencia}
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
			on:click={agregarDireccion}
			class="flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
		>
			<span class="text-xl">+</span>
			Agregar ubicación
		</button>
	</div>
</div>
