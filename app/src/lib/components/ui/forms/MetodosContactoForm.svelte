<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import Select from '$lib/components/ui/elementos/Select.svelte';
	import { createEventDispatcher } from 'svelte';
	import { toastStore } from '$lib/stores/toast';

	import {
		TIPOS_CONTACTO,
		ETIQUETAS_CONTACTO,
		type Contacto,
		type TipoContacto,
		type EtiquetaContacto
	} from '$lib/domain/types/Contacto';

	import {
		validarCorreo,
		validarTelefonoInternacional,
		validarUrl,
		MENSAJES_ERROR
	} from '$lib/utils/validaciones';

	let contactos: Contacto[] = [{ tipo_contacto: 'telefono', valor: '', etiqueta: '' }];
	let enviando = false;
	let intentoEnvio = false;
	let camposTocados: Array<{ valor: boolean; etiqueta: boolean }> = [
		{ valor: false, etiqueta: false }
	];

	const etiquetasTipoContacto: Record<TipoContacto, string> = {
		telefono: 'Teléfono',
		email: 'Correo electrónico',
		web: 'Sitio web',
		red_social: 'Red social'
	};

	const opcionesTipoContacto = [
		...TIPOS_CONTACTO.map((t) => ({ value: t, label: etiquetasTipoContacto[t] })),
		{ value: 'otro', label: 'Otro' }
	];

	const redesSociales = ['Instagram', 'Facebook', 'LinkedIn', 'WhatsApp'];

	const etiquetasEtiqueta: Record<EtiquetaContacto, string> = {
		principal: 'Principal',
		secundario: 'Secundario'
	};

	const opcionesEtiqueta = ETIQUETAS_CONTACTO.map((e) => ({
		value: e,
		label: etiquetasEtiqueta[e]
	}));

	const dispatch = createEventDispatcher<{
		submit: Contacto[];
		skip: void;
	}>();

	export let mostrarOmitir = false;
	export let etiquetaOmitir = 'Omitir';
	export let valoresIniciales: Contacto[] = [];
	export let bloquearPrimerContacto = true;

	// Si vienen valores iniciales y el formulario está "vacío", precargamos
	$: if (valoresIniciales && valoresIniciales.length > 0) {
		const formularioVacio =
			contactos.length === 1 && !contactos[0].valor && contactos[0].tipo_contacto === 'telefono';
		if (formularioVacio) {
			contactos = valoresIniciales.map((c: Contacto) => ({ ...c }));
		}
	}

	function getPlaceholder(tipo: TipoContacto | string): string {
		switch (tipo) {
			case 'telefono':
				return 'Ej: +54 9 1234 5678';
			case 'email':
				return 'Ej: contacto@ejemplo.com';
			case 'web':
				return 'Ej: https://tuorganizacion.org';
			case 'red_social':
				return 'Ej: @tuorganizacion';
			case 'otro':
				return 'Ej: Telegram, Fax...';
			default:
				return 'Ej: Valor del contacto';
		}
	}

	$: camposTocados =
		camposTocados.length === contactos.length
			? camposTocados
			: contactos.map((_, idx) => camposTocados[idx] ?? { valor: false, etiqueta: false });

	$: errors = contactos.map((contacto, index) => {
		const { tipo_contacto, valor, etiqueta } = contacto;

		if (!valor.trim()) return MENSAJES_ERROR.obligatorio;

		if (tipo_contacto === 'telefono' && !validarTelefonoInternacional(valor))
			return MENSAJES_ERROR.telefonoInvalido;

		if (tipo_contacto === 'email' && !validarCorreo(valor)) return MENSAJES_ERROR.correoInvalido;

		if (tipo_contacto === 'web' && !validarUrl(valor)) return MENSAJES_ERROR.urlInvalida;

		if (tipo_contacto === 'otro' && !etiqueta?.trim())
			return MENSAJES_ERROR.otroContactoObligatorio;

		const isDuplicate = contactos.some(
			(c, i) => i !== index && c.tipo_contacto === tipo_contacto && c.valor === valor
		);

		if (isDuplicate) return MENSAJES_ERROR.contactoDuplicado;

		return '';
	});

	$: telefonoValido = contactos.some(
		(c) => c.tipo_contacto === 'telefono' && validarTelefonoInternacional(c.valor)
	);

	$: tieneErrores = !telefonoValido || contactos.some((_, i) => errors[i]);

	function agregarContacto() {
		contactos = [...contactos, { tipo_contacto: 'telefono', valor: '', etiqueta: '' }];
		camposTocados = [...camposTocados, { valor: false, etiqueta: false }];
	}

	function eliminarContacto(index: number) {
		contactos = contactos.filter((_, i) => i !== index);
		camposTocados = camposTocados.filter((_, i) => i !== index);
	}

	function marcarCampoComoTocado(indice: number, campo: 'valor' | 'etiqueta') {
		camposTocados = camposTocados.map((item, idx) =>
			idx === indice ? { ...item, [campo]: true } : item
		);
	}

	function manejarEnvio(event: SubmitEvent) {
		event.preventDefault();
		intentoEnvio = true;
		if (tieneErrores) return;

		enviando = true;

		setTimeout(() => {
			enviando = false;
			dispatch('submit', contactos);
			toastStore.show({
				variant: 'success',
				title: 'Cambios guardados',
				message: 'Tu descripción, ubicación y formas de contacto se actualizaron correctamente.'
			});
		}, 800);
	}

	function omitirContactos() {
		toastStore.show({
			variant: 'info',
			title: 'Paso omitido',
			message: 'Podés agregar formas de contacto más adelante desde tu panel de registro.'
		});
		dispatch('skip');
	}
</script>

<form on:submit={manejarEnvio}>
	<div class="space-y-6">
		{#each contactos as contacto, i (contacto)}
			<div
				class="group relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:flex sm:items-start sm:gap-4"
			>
				<!-- Indicador para mobile -->
				<div
					class="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 sm:hidden"
				>
					{i + 1}
				</div>

				<div class="flex flex-1 flex-col gap-4 sm:flex-row sm:items-start">
					<!-- Tipo de contacto -->
					<div class="w-full sm:w-1/3 md:w-1/4">
						<label for={'tipo-' + i} class="mb-1 block text-sm font-semibold text-gray-700">
							Tipo <span class="sr-only">de contacto</span>
						</label>
						<Select
							id={'tipo-' + i}
							bind:value={contacto.tipo_contacto}
							disabled={i === 0 && bloquearPrimerContacto}
							options={opcionesTipoContacto as unknown as Array<{ value: string; label: string }>}
							searchable={false}
						/>
					</div>

					<!-- Valor del contacto -->
					<div class="w-full sm:flex-1">
						<label for={'valor-' + i} class="mb-1 block text-sm font-semibold text-gray-700">
							Valor <span class="text-red-600">*</span>
						</label>
						<Input
							id={'valor-' + i}
							bind:value={contacto.valor}
							placeholder={getPlaceholder(contacto.tipo_contacto)}
							error={contacto.valor.trim() ? errors[i] : ''}
							on:blur={() => marcarCampoComoTocado(i, 'valor')}
							disabled={i === 0 && bloquearPrimerContacto}
						/>
					</div>

					<!-- Etiqueta -->
					<div class="w-full sm:w-1/3 md:w-1/4">
						<label for={'etiqueta-' + i} class="mb-1 block text-sm font-semibold text-gray-700">
							{contacto.tipo_contacto === 'otro' ? 'Especificar' : 'Etiqueta'}
						</label>
						{#if contacto.tipo_contacto === 'red_social'}
							<Select
								id={'etiqueta-' + i}
								bind:value={contacto.etiqueta}
								options={[
									{
										value: '',
										label: 'Elegí red social'
									},
									...redesSociales.map((r) => ({ value: r, label: r }))
								]}
								searchable={false}
								on:blur={() => marcarCampoComoTocado(i, 'etiqueta')}
							/>
						{:else if contacto.tipo_contacto === 'otro'}
							<Input
								id={'etiqueta-' + i}
								bind:value={contacto.etiqueta}
								placeholder="Ej: Telegram..."
								on:blur={() => marcarCampoComoTocado(i, 'etiqueta')}
							/>
						{:else}
							<Select
								id={'etiqueta-' + i}
								bind:value={contacto.etiqueta}
								options={[
									{
										value: '',
										label: 'Elegí una opción'
									},
									...opcionesEtiqueta
								]}
								searchable={false}
								on:blur={() => marcarCampoComoTocado(i, 'etiqueta')}
								disabled={i === 0 && bloquearPrimerContacto}
							/>
						{/if}
					</div>
				</div>

				<!-- Botón eliminar -->
				{#if i > 0}
					<div class="mt-4 flex justify-end sm:mt-6 sm:w-auto">
						<button
							type="button"
							on:click={() => eliminarContacto(i)}
							title="Eliminar contacto"
							aria-label="Eliminar contacto"
							class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 focus:ring-2 focus:ring-red-200 focus:outline-none"
						>
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
								/>
							</svg>
						</button>
					</div>
				{:else}
					<!-- Espaciador para alinear con filas que tienen botón de eliminar (solo desktop) -->
					<div class="hidden sm:mt-6 sm:block sm:w-[36px]"></div>
				{/if}
			</div>
		{/each}

		<!-- Botón agregar contacto -->
		<div class="mt-4 flex justify-center">
			<button
				type="button"
				on:click={agregarContacto}
				class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-blue-300 bg-blue-50/50 px-6 py-3 text-sm font-medium text-blue-600 transition-all hover:border-blue-400 hover:bg-blue-50 hover:shadow-sm"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6H6m6 0h6" />
				</svg>
				Agregar otro contacto
			</button>
		</div>
	</div>

	<!-- Botones de acción -->
	<div class="mt-8 flex justify-end gap-4">
		{#if mostrarOmitir}
			<Button
				label={etiquetaOmitir}
				variant="secondary"
				size="sm"
				on:click={omitirContactos}
				customClass="w-full md:w-auto"
			/>
		{/if}
		<slot name="botones-extra" />
		<Button
			label={enviando ? 'Guardando...' : 'Continuar'}
			variant="primary"
			size="sm"
			disabled={tieneErrores || enviando}
			customClass="w-full md:w-auto"
		/>
	</div>
</form>

