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
		validarUnidadLibre,
		normalizarEspecie,
		validarEspecie,
		validarAumentoObjetivo
	} from '$lib/utils/util-proyecto-form';
	import type { TipoParticipacionDescripcion } from '$lib/domain/types/TipoParticipacion';
	import type { ParticipacionPermitida } from '$lib/domain/types/ParticipacionPermitida';
	import type { ParticipacionForm } from '$lib/domain/types/forms/CrearProyectoForm';
	import { Users, CurrencyDollar, Cube } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import type { IconSource } from '@steeze-ui/svelte-icon';
	import { TriangleAlert, Trash2, Plus } from 'lucide-svelte';

	export let tiposParticipacionSeleccionados: TipoParticipacionDescripcion[] = [];
	export let participacionesPermitidas: ParticipacionForm[] = [];
	export let errores: Record<string, string> = {};
	export let limpiarError: (campo: string) => void;

	// Modo edición
	export let modoEdicion = false;
	export let participacionesOriginales: ParticipacionPermitida[] = [];
	export let esAdmin = false;

	function esUnidadRepetida(
		tipo: TipoParticipacionDescripcion | undefined,
		texto: string
	): boolean {
		const key = toKey(texto);
		const lista = unidadesPorTipo[(tipo ?? 'Voluntariado') as keyof typeof unidadesPorTipo] ?? [];
		return lista.map(toKey).includes(key);
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
			const valNum = value as number | undefined;
			const original = participacionesOriginales.find(
				(p) =>
					p.id_participacion_permitida ===
					participacionesPermitidas[index].id_participacion_permitida
			);

			const errAumento = validarAumentoObjetivo(valNum, original?.objetivo);

			participacionesPermitidas[index] = {
				...participacionesPermitidas[index],
				objetivo: valNum
			};

			if (errAumento && !esAdmin) {
				errores[`participacion_${index}_objetivo`] = errAumento;
			} else {
				limpiarError(`participacion_${index}_objetivo`);
			}
		} else {
			participacionesPermitidas[index] = {
				...participacionesPermitidas[index],
				[field]: value as any
			};
		}
		participacionesPermitidas = participacionesPermitidas;

		if (field === 'unidad_medida_otra') {
			const descripcionTipo = participacionesPermitidas[index].tipo_participacion?.descripcion;
			const esMonetaria = descripcionTipo === 'Monetaria';
			const norm = normalizarUnidadLibre(String(value ?? ''), esMonetaria);
			participacionesPermitidas[index] = {
				...participacionesPermitidas[index],
				unidad_medida_otra: norm
			};
			const err = validarUnidadLibre(norm, {
				allowUpperCase: esMonetaria,
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
		// En modo edición, no permitir eliminar participaciones originales
		if (modoEdicion && participacionesPermitidas[index].id_participacion_permitida && !esAdmin) {
			return;
		}

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

	const tiposParticipacionInfo: Record<
		string,
		{ titulo: string; descripcion: string; icon: IconSource; color: string }
	> = {
		Voluntariado: {
			titulo: 'Voluntariado',
			descripcion: 'Necesitas personas que dediquen su tiempo',
			icon: Users,
			color: 'blue'
		},
		Monetaria: {
			titulo: 'Aporte Monetario',
			descripcion: 'Necesitas donaciones económicas',
			icon: CurrencyDollar,
			color: 'green'
		},
		Especie: {
			titulo: 'En Especie',
			descripcion: 'Necesitas materiales o productos específicos',
			icon: Cube,
			color: 'orange'
		}
	};

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
	<h2 class="mb-2 text-xl font-semibold text-gray-900">
		{#if modoEdicion}
			Objetivos del proyecto
		{:else}
			Tipos de participación *
		{/if}
	</h2>
	<p class="mb-6 text-gray-600">
		{#if modoEdicion && !esAdmin}
			Los objetivos solo pueden aumentar. Podés agregar nuevos tipos de participación.
		{:else if esAdmin}
			Como administrador tenés control total sobre los objetivos y tipos de participación.
		{:else}
			Definí los objetivos y cómo los colaboradores pueden ayudarte.
		{/if}
	</p>

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
						<div class="mb-3 text-3xl {clases.iconColor}">
							<Icon src={info.icon} class="h-8 w-8" />
						</div>
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
		{@const esOriginal = modoEdicion && !!participacion.id_participacion_permitida}
		{@const original = esOriginal
			? participacionesOriginales.find(
					(p) => p.id_participacion_permitida === participacion.id_participacion_permitida
				)
			: undefined}
		<div class="mt-6 rounded-lg border-2 p-4 {clases.border} {clases.bg}">
			<div class="mb-4 flex items-center justify-between">
				<h4 class="flex items-center gap-2 font-medium text-gray-900">
					<span class="text-xl {clases.iconColor}">
						<Icon src={tipoInfo.icon} class="h-6 w-6" />
					</span>
					{participacion.tipo_participacion?.descripcion}
				</h4>
				<button
					type="button"
					on:click={() => eliminarParticipacion(index)}
					disabled={esOriginal && !esAdmin}
					class="text-gray-400 hover:text-gray-600"
					class:opacity-50={esOriginal && !esAdmin}
					class:cursor-not-allowed={esOriginal && !esAdmin}
					title={esOriginal && !esAdmin
						? 'No se pueden eliminar participaciones existentes'
						: 'Eliminar'}
					aria-label="Eliminar participación"
				>
					<Trash2 class="h-5 w-5" />
				</button>
			</div>
			<div class="grid gap-4">
				{#if participacion.tipo_participacion?.descripcion === 'Especie'}
					<div>
						<label for="especie_{index}" class="mb-2 block text-sm font-medium text-gray-700">
							¿Qué necesitás? *
						</label>
						<input
							id="especie_{index}"
							type="text"
							value={participacion.especie || ''}
							on:input={(e) => updateParticipacion(index, 'especie', e.currentTarget.value)}
							disabled={esOriginal && !esAdmin}
							class="focus:ring-opacity-20 w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
							class:border-gray-300={!esOriginal || esAdmin}
							class:border-red-300={errores[`participacion_${index}_especie`] &&
								(!esOriginal || esAdmin)}
							class:cursor-not-allowed={esOriginal && !esAdmin}
							class:bg-gray-50={esOriginal && !esAdmin}
							class:text-gray-600={esOriginal && !esAdmin}
							placeholder="Ejemplo: libros, alimentos, ropa, medicamentos..."
						/>
						{#if errores[`participacion_${index}_especie`]}
							<p class="mt-1 text-sm text-red-600">{errores[`participacion_${index}_especie`]}</p>
						{/if}
					</div>
				{/if}

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<label for="objetivo_{index}" class="mb-2 block text-sm font-medium text-gray-700">
							Objetivo *
							{#if esOriginal && original}
								<span class="ml-2 text-xs text-gray-500">(Min: {original.objetivo})</span>
							{/if}
						</label>
						<input
							id="objetivo_{index}"
							type="number"
							value={participacion.objetivo ?? ''}
							on:input={(e) => {
								const val = e.currentTarget.value;
								updateParticipacion(index, 'objetivo', val ? Number(val) : undefined);
							}}
							min={esOriginal && original && !esAdmin ? original.objetivo : 1}
							step={participacion.tipo_participacion?.descripcion === 'Monetaria' ? '0.01' : '1'}
							class="focus:ring-opacity-20 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
							placeholder="100"
							class:border-red-300={errores[`participacion_${index}_objetivo`]}
						/>
						{#if errores[`participacion_${index}_objetivo`]}
							<p class="mt-1 text-sm text-red-600">{errores[`participacion_${index}_objetivo`]}</p>
						{:else if esOriginal && original}
							<p class="mt-1 text-xs text-gray-500">
								Progreso actual: {original.actual || 0} / {original.objetivo}
							</p>
						{/if}
					</div>
					<div>
						<label for="unidad_{index}" class="mb-2 block text-sm font-medium text-gray-700">
							Unidad de medida
						</label>
						<select
							id="unidad_{index}"
							value={participacion.unidad_medida}
							on:change={(e) => updateParticipacion(index, 'unidad_medida', e.currentTarget.value)}
							disabled={esOriginal && !esAdmin}
							class="focus:ring-opacity-20 w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
							class:border-gray-300={!esOriginal || esAdmin}
							class:cursor-not-allowed={esOriginal && !esAdmin}
							class:bg-gray-50={esOriginal && !esAdmin}
							class:text-gray-600={esOriginal && !esAdmin}
						>
							{#each [...unidadesPorTipo[participacion.tipo_participacion?.descripcion || 'Voluntariado'], 'Otra'] as unidad (unidad)}
								<option value={unidad}>{unidad}</option>
							{/each}
						</select>
						{#if participacion.unidad_medida === 'Otra' && !esOriginal}
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
									class="focus:ring-opacity-20 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
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
			<div
				class="mt-4 flex items-center justify-center gap-2 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-center text-sm text-yellow-800"
			>
				<TriangleAlert class="h-5 w-5" />
				Has alcanzado el límite máximo de 10 tipos de donaciones en especie por proyecto.
			</div>
		{:else}
			<div class="mt-4 flex justify-center">
				<button
					type="button"
					on:click={agregarItemEspecie}
					class="flex items-center gap-2 rounded-lg border-2 border-dashed border-orange-300 bg-orange-50 px-3 py-2 text-sm font-medium text-orange-700 transition-colors hover:border-orange-400 hover:bg-orange-100"
				>
					<Plus class="mr-2 h-4 w-4" />
					Agregar otro item en especie
				</button>
			</div>
		{/if}
	{/if}
</div>
