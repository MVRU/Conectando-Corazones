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
	} from '$lib/types/Contacto';

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

// Si vienen valores iniciales y el formulario está "vacío", precargamos
$: if (valoresIniciales && valoresIniciales.length > 0) {
    const formularioVacio = contactos.length === 1 && !contactos[0].valor && contactos[0].tipo_contacto === 'telefono';
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
				message: 'Tu descripción y formas de contacto se actualizaron correctamente.'
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
					class="group relative flex flex-row items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
				>
					<div class="flex w-full flex-wrap gap-4 md:flex-nowrap">
						<!-- Tipo de contacto -->
						<div class="min-w-[180px] flex-1 md:max-w-[240px]">
							<label for={'tipo-' + i} class="mb-2 block text-sm font-semibold text-gray-700">
								Tipo de contacto
							</label>
						<Select
							id={'tipo-' + i}
							bind:value={contacto.tipo_contacto}
							disabled={i === 0}
							options={opcionesTipoContacto as unknown as Array<{ value: string; label: string }>}
							searchable={false}
						/>
					</div>

					<!-- Valor del contacto -->
					<div class="min-w-[200px] flex-[1.2]">
						<label for={'valor-' + i} class="mb-2 block text-sm font-semibold text-gray-700">
							Valor <span class="text-red-600">*</span>
						</label>
						<Input
							id={'valor-' + i}
							bind:value={contacto.valor}
							placeholder={getPlaceholder(contacto.tipo_contacto)}
							error={intentoEnvio || camposTocados[i]?.valor ? errors[i] : ''}
							on:blur={() => marcarCampoComoTocado(i, 'valor')}						disabled={i === 0}						/>
					</div>

					<!-- Etiqueta -->
					<div class="min-w-[180px] flex-1">
						<label for={'etiqueta-' + i} class="mb-2 block text-sm font-semibold text-gray-700">
							{contacto.tipo_contacto === 'otro' ? 'Especificar tipo' : 'Etiqueta'}
						</label>
						{#if contacto.tipo_contacto === 'red_social'}
							<Select
								id={'etiqueta-' + i}
								bind:value={contacto.etiqueta}
								options={[
									{
										value: '',
										label: 'Elegí una red social'
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
								disabled={i === 0}
							/>
						{/if}
					</div>

					<!-- Botón eliminar -->
					{#if i > 0}
						<div class="ml-auto flex items-center">
							<button
								type="button"
								on:click={() => eliminarContacto(i)}
								class="cursor-pointer rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 focus:outline-none"
							>
								Eliminar
							</button>
						</div>
					{/if}
				</div>
			</div>
		{/each}

		<!-- Botón agregar contacto -->
		<div class="mt-4 flex justify-center">
			<button
				type="button"
				on:click={agregarContacto}
				class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6H6m6 0h6" />
				</svg>
				Agregar contacto
			</button>
		</div>
	</div>

	<!-- Botones de acción -->
	<div class="mt-8 flex justify-end gap-4">
		{#if mostrarOmitir}
			<Button
				label={etiquetaOmitir}
				variant="secondary"
				size="md"
				on:click={omitirContactos}
				customClass="w-full md:w-auto"
			/>
		{/if}
		<slot name="botones-extra" />
		<Button
			label={enviando ? 'Guardando...' : 'Continuar'}
			variant="primary"
			size="md"
			disabled={tieneErrores || enviando}
			customClass="w-full md:w-auto"
		/>
	</div>
</form>
