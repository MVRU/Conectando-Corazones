<!--
 * * Componente: ProyectoParticipaciones
 * -!- Para agregar los tipos de participaciones permitidas y sus objetivos.
 -->
 
<script lang="ts">
	import {
		obtenerClasesColor,
		objetivoListo,
		objetivoTexto,
		toKey,
		normalizarUnidadLibre,
		validarUnidadLibre ,
		normalizarEspecie ,
		validarEspecie 
	} from '$lib/utils/util-proyecto-form';
	import type { TipoParticipacionDescripcion } from '$lib/types/TipoParticipacion';
	import type { ParticipacionPermitida } from '$lib/types/ParticipacionPermitida';
	import type { ParticipacionForm } from '$lib/types/forms/CrearProyectoForm';

	export let tiposParticipacionSeleccionados: TipoParticipacionDescripcion[] = [];
	export let participacionesPermitidas: ParticipacionForm[] = [];
	export let errores: Record<string, string> = {};
	export let limpiarError: (campo: string) => void;


	function esUnidadRepetida(
		tipo: TipoParticipacionDescripcion | undefined,
		texto: string
	): boolean {
		const key = toKey(texto);
		const lista = unidadesPorTipo[(tipo ?? 'Voluntariado') as keyof typeof unidadesPorTipo] ?? [];
		return lista.map(toKey).includes(key);
	}

	
	function validarUnidadMedidaOtra(s: string, tipo?: TipoParticipacionDescripcion): string | null {
		if (s == null) return 'Este campo es obligatorio';
		const v = s.normalize('NFC').trim().replace(/\s+/g, ' ');
		if (v.length < 2) return 'Debe tener al menos 2 caracteres';
		if (v.length > 40) return 'Máximo 40 caracteres';
		if (!/[A-Za-zÁÉÍÓÚÜáéíóúüÑñ]/u.test(v)) return 'Debe incluir al menos una letra';
		if (/^\d+$/u.test(v)) return 'No puede ser solo números';
		if (!/^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ0-9 .,'’/%()-]+$/u.test(v))
			return 'Usá letras, números y signos comunes';
		if (esUnidadRepetida(tipo, v)) {
			return 'Esa unidad ya existe. Elegíla de la lista.';
		}
		return null;
	}


	function toggleTipoParticipacion(tipo: TipoParticipacionDescripcion) {
		if (tiposParticipacionSeleccionados.includes(tipo)) {
			tiposParticipacionSeleccionados = tiposParticipacionSeleccionados.filter((t) => t !== tipo);
			participacionesPermitidas = participacionesPermitidas.filter(
				(p) => p.tipo_participacion?.descripcion !== tipo
			);
		} else {
			tiposParticipacionSeleccionados = [...tiposParticipacionSeleccionados, tipo];
			participacionesPermitidas = [
				...participacionesPermitidas,
				{
					tipo_participacion: { descripcion: tipo },
					objetivo: undefined,
					actual: 0,
					unidad_medida:
						tipo === 'Monetaria' ? 'ARS' : tipo === 'Voluntariado' ? 'personas' : 'unidades',
					especie: tipo === 'Especie' ? '' : undefined
				}
			];
		}
	}

	function updateParticipacion(
		index: number,
		field: keyof ParticipacionForm,
		value: string | number | undefined
	) {
		if (field === 'especie') {
			const norm = normalizarEspecie(String(value ?? ''));
			participacionesPermitidas[index] = {
				...participacionesPermitidas[index],
				especie: norm
			};
			const err = validarEspecie(norm);
			if (err) errores[`participacion_${index}_especie`] = err;
			else limpiarError(`participacion_${index}_especie`);
		} else if (field === 'objetivo') {
			participacionesPermitidas[index] = { ...participacionesPermitidas[index], objetivo: value as number | undefined };
			// Limpiar error si el objetivo es válido
			if (value != null && Number(value) > 0) {
				limpiarError(`participacion_${index}_objetivo`);
			}
		} else {
			participacionesPermitidas[index] = { ...participacionesPermitidas[index], [field]: value as any };
		}
		participacionesPermitidas = participacionesPermitidas;

		if (field === 'unidad_medida_otra') {
			const norm = normalizarUnidadLibre(String(value ?? ''));
			participacionesPermitidas[index] = {
				...participacionesPermitidas[index],
				unidad_medida_otra: norm
			};
			const err = validarUnidadLibre(norm, {
				esRepetida: (t) =>
					esUnidadRepetida(
						participacionesPermitidas[index].tipo_participacion?.descripcion as
							| TipoParticipacionDescripcion
							| undefined,
						t
					)
			});
			if (err) errores[`participacion_${index}_unidad_otra`] = err;
			else limpiarError(`participacion_${index}_unidad_otra`);
		}

		if (field === 'unidad_medida' && String(value) !== 'Otra') {
			limpiarError(`participacion_${index}_unidad_otra`);
		}
	}

	function eliminarParticipacion(index: number) {
		const tipo = participacionesPermitidas[index].tipo_participacion?.descripcion as
			| TipoParticipacionDescripcion
			| undefined;
		participacionesPermitidas = participacionesPermitidas.filter((_, i) => i !== index);
		if (tipo) {
			const tieneOtrosDelMismoTipo = participacionesPermitidas.some(
				(p) => p.tipo_participacion?.descripcion === tipo
			);
			if (!tieneOtrosDelMismoTipo) {
				tiposParticipacionSeleccionados = tiposParticipacionSeleccionados.filter((t) => t !== tipo);
			}
		}
	}

	function agregarItemEspecie() {
		participacionesPermitidas = [
			...participacionesPermitidas,
			{
				tipo_participacion: { descripcion: 'Especie' },
				objetivo: undefined,
				actual: 0,
				unidad_medida: 'unidades',
				especie: ''
			}
		];
	}

	const tiposParticipacionInfo = {
		Voluntariado: {
			titulo: 'Voluntariado',
			descripcion: 'Necesitás personas que dediquen su tiempo',
			icon: '🤝',
			color: 'blue'
		},
		Monetaria: {
			titulo: 'Aporte Monetario',
			descripcion: 'Necesitás donaciones económicas',
			icon: '💰',
			color: 'green'
		},
		Especie: {
			titulo: 'En Especie',
			descripcion: 'Necesitás materiales o productos específicos',
			icon: '📦',
			color: 'orange'
		}
	} as const;

	const unidadesPorTipo = {
		Voluntariado: ['personas', 'horas', 'días'],
		Monetaria: ['ARS', 'USD', 'EUR'],
		Especie: ['unidades', 'kilogramos', 'mililitros', 'litros', 'centímetros', 'metros']
	} as const;

	$: cantidadDonacionesEspecie = participacionesPermitidas.filter(
		(p) => p.tipo_participacion?.descripcion === 'Especie'
	).length;
	$: limiteEspecieAlcanzado = cantidadDonacionesEspecie >= 10;
</script>

<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
	<h2 class="mb-2 text-xl font-semibold text-gray-900">Tipos de participación *</h2>
	<p class="mb-6 text-gray-600">Defina los objetivos y cómo los colaboradores pueden ayudarle.</p>

	{#if Object.entries(tiposParticipacionInfo).filter(([tipo]) => !tiposParticipacionSeleccionados.includes(tipo as TipoParticipacionDescripcion)).length > 0}
		<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
			{#each Object.entries(tiposParticipacionInfo) as [tipo, info] (tipo)}
				{#if !tiposParticipacionSeleccionados.includes(tipo as TipoParticipacionDescripcion)}
					{@const clases = obtenerClasesColor(info.color, false)}
					<button
						type="button"
						on:click={() => toggleTipoParticipacion(tipo as TipoParticipacionDescripcion)}
						class="relative rounded-lg border-2 p-4 text-left transition-all hover:shadow-md {clases.border} {clases.bg} {clases.hover}"
					>
						<div class="mb-3 text-3xl">{info.icon}</div>
						<h3 class="mb-1 font-semibold text-gray-900">{info.titulo}</h3>
						<p class="text-sm text-gray-600">{info.descripcion}</p>
					</button>
				{/if}
			{/each}
		</div>
	{/if}

	{#if errores.participacion}
		<p class="mb-4 text-sm text-red-600">{errores.participacion}</p>
	{/if}

	{#each participacionesPermitidas as participacion, index (index)}
		{@const tipoInfo =
			tiposParticipacionInfo[participacion.tipo_participacion?.descripcion || 'Voluntariado']}
		{@const clases = obtenerClasesColor(tipoInfo.color, true)}
		<div class="mt-6 rounded-lg border-2 p-4 {clases.border} {clases.bg}">
			<div class="mb-4 flex items-center justify-between">
				<h4 class="flex items-center gap-2 font-medium text-gray-900">
					<span class="text-xl">{tipoInfo.icon}</span>
					{participacion.tipo_participacion?.descripcion}
				</h4>
				<button
					type="button"
					on:click={() => eliminarParticipacion(index)}
					class="text-gray-400 hover:text-gray-600"
					title="Eliminar"
					aria-label="Eliminar participación"
				>
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"
						><path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/></svg
					>
				</button>
			</div>
			<div class="grid gap-4">
				{#if participacion.tipo_participacion?.descripcion === 'Especie'}
					<div>
						<label for="especie_{index}" class="mb-2 block text-sm font-medium text-gray-700"
							>¿Qué necesitás? *</label
						>
						<input
							id="especie_{index}"
							type="text"
							value={participacion.especie || ''}
							on:input={(e) => updateParticipacion(index, 'especie', e.currentTarget.value)}
							class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
							placeholder="Ejemplo: libros, alimentos, ropa, medicamentos..."
							class:border-red-300={errores[`participacion_${index}_especie`]}
						/>
						{#if errores[`participacion_${index}_especie`]}
							<p class="mt-1 text-sm text-red-600">{errores[`participacion_${index}_especie`]}</p>
						{/if}
					</div>
				{/if}

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<label for="objetivo_{index}" class="mb-2 block text-sm font-medium text-gray-700"
							>Objetivo *</label
						>
						<input
							id="objetivo_{index}"
							type="number"
						value={participacion.objetivo ?? ''}
						on:input={(e) => {
							const val = e.currentTarget.value;
							updateParticipacion(index, 'objetivo', val ? Number(val) : undefined);
						}}
							min="1"
							step={participacion.tipo_participacion?.descripcion === 'Monetaria' ? '0.01' : '1'}
							class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
							placeholder="100"
							class:border-red-300={errores[`participacion_${index}_objetivo`]}
						/>
						{#if errores[`participacion_${index}_objetivo`]}
							<p class="mt-1 text-sm text-red-600">{errores[`participacion_${index}_objetivo`]}</p>
						{/if}
					</div>
					<div>
						<label for="unidad_{index}" class="mb-2 block text-sm font-medium text-gray-700"
							>Unidad de medida</label
						>
						<select
							id="unidad_{index}"
							value={participacion.unidad_medida}
							on:change={(e) => updateParticipacion(index, 'unidad_medida', e.currentTarget.value)}
							class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
						>
							{#each [...unidadesPorTipo[participacion.tipo_participacion?.descripcion || 'Voluntariado'], 'Otra'] as unidad (unidad)}
								<option value={unidad}>{unidad}</option>
							{/each}
						</select>
						{#if participacion.unidad_medida === 'Otra'}
							<div class="mt-2">
								<label for="unidad_otra_{index}" class="mb-2 block text-sm text-gray-700"
									>Especificá la unidad *</label
								>
								<input
									id="unidad_otra_{index}"
									type="text"
									value={participacion.unidad_medida_otra || ''}
									on:input={(e) =>
										updateParticipacion(index, 'unidad_medida_otra', e.currentTarget.value)}
									class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
									class:border-red-300={errores[`participacion_${index}_unidad_otra`]}
									aria-invalid={!!errores[`participacion_${index}_unidad_otra`]}
								placeholder={participacion.tipo_participacion?.descripcion === 'Monetaria'
									? 'Ejemplo: GPB, Bitcoin'
									: 'Ejemplo: toneladas, docentes, metros'}
									maxlength="40"
								/>
								{#if errores[`participacion_${index}_unidad_otra`]}
									<p class="mt-1 text-sm text-red-600">
										{errores[`participacion_${index}_unidad_otra`]}
									</p>
								{/if}
							</div>
						{/if}
					</div>
				</div>
				{#if objetivoListo(participacion)}
					<p class="mt-3 rounded-md bg-white/70 px-3 py-2 text-sm text-gray-800">
						{objetivoTexto(participacion)}
					</p>
				{/if}
			</div>
		</div>
	{/each}

	{#if tiposParticipacionSeleccionados.includes('Especie')}
		{#if limiteEspecieAlcanzado}
			<div class="mt-4 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-center text-sm text-yellow-800">
				⚠️ Has alcanzado el límite máximo de 10 tipos de donaciones en especie por proyecto.
			</div>
		{:else}
			<div class="mt-4 flex justify-center">
				<button
					type="button"
					on:click={agregarItemEspecie}
					class="flex items-center gap-2 rounded-lg border-2 border-dashed border-orange-300 bg-orange-50 px-3 py-2 text-sm font-medium text-orange-700 transition-colors hover:border-orange-400 hover:bg-orange-100"
				>
					<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6v6m0 0v6m0-6h6m-6 0H6"
						/></svg
					>
					Agregar otro item en especie
				</button>
			</div>
		{/if}
	{/if}
</div>
