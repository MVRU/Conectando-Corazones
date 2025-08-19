<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/elements/Button.svelte';
	import Select from '$lib/components/ui/elements/Select.svelte';
	import { createEventDispatcher } from 'svelte';

	import {
		TIPOS_CONTACTO,
		ETIQUETAS_CONTACTO,
		type Contacto,
		type TipoContacto,
		type EtiquetaContacto
	} from '$lib/types/Contacto';

	import {
		isValidEmail,
		isValidInternationalPhone,
		isValidWeb,
		ERROR_MESSAGES
	} from '$lib/utils/validators';

	let contactos: Contacto[] = [{ tipo_contacto: 'telefono', valor: '', etiqueta: '' }];
	let enviando = false;

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

	$: errors = contactos.map((contacto, index) => {
		const { tipo_contacto, valor, etiqueta } = contacto;

		if (!valor.trim()) return ERROR_MESSAGES.required;

		if (tipo_contacto === 'telefono' && !isValidInternationalPhone(valor))
			return ERROR_MESSAGES.phoneInvalid;

		if (tipo_contacto === 'email' && !isValidEmail(valor)) return ERROR_MESSAGES.emailInvalid;

		if (tipo_contacto === 'web' && !isValidWeb(valor)) return ERROR_MESSAGES.urlInvalid;

		if (tipo_contacto === 'otro' && !etiqueta?.trim()) return ERROR_MESSAGES.specifyOtherContact;

		const isDuplicate = contactos.some(
			(c, i) => i !== index && c.tipo_contacto === tipo_contacto && c.valor === valor
		);

		if (isDuplicate) return ERROR_MESSAGES.contactDuplicate;

		return '';
	});

	$: telefonoValido = contactos.some(
		(c) => c.tipo_contacto === 'telefono' && isValidInternationalPhone(c.valor)
	);

	$: tieneErrores = !telefonoValido || contactos.some((_, i) => errors[i]);

	function agregarContacto() {
		contactos = [...contactos, { tipo_contacto: 'telefono', valor: '', etiqueta: '' }];
	}

	function eliminarContacto(index: number) {
		contactos = contactos.filter((_, i) => i !== index);
	}

	function manejarEnvio(event: SubmitEvent) {
		event.preventDefault();
		if (tieneErrores) return;

		enviando = true;

		setTimeout(() => {
			enviando = false;
			dispatch('submit', contactos);
		}, 800);
	}
</script>

<form on:submit={manejarEnvio}>
	<div class="space-y-6">
		{#each contactos as contacto, i (contacto)}
			<div
				class="group relative flex flex-row items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
			>
				<div class="flex flex-1 flex-wrap gap-4">
					<!-- Tipo de contacto -->
					<div class="min-w-[200px] flex-1 md:flex-none">
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
					<div class="min-w-[200px] flex-1 md:flex-none">
						<label for={'valor-' + i} class="mb-2 block text-sm font-semibold text-gray-700">
							Valor <span class="text-red-600">*</span>
						</label>
						<Input
							id={'valor-' + i}
							bind:value={contacto.valor}
							placeholder={getPlaceholder(contacto.tipo_contacto)}
							error={errors[i]}
						/>
					</div>

					<!-- Etiqueta -->
					<div class="min-w-[200px] flex-1 md:flex-none">
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
							/>
						{:else if contacto.tipo_contacto === 'otro'}
							<Input
								id={'etiqueta-' + i}
								bind:value={contacto.etiqueta}
								placeholder="Ej: Telegram..."
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
							/>
						{/if}
					</div>

					<!-- Botón eliminar -->
					{#if i > 0}
						<div class="ml-auto">
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
				on:click={() => dispatch('skip')}
				customClass="w-full md:w-auto"
			/>
		{/if}
		<Button
			label={enviando ? 'Guardando...' : 'Continuar'}
			variant="primary"
			size="md"
			disabled={tieneErrores || enviando}
			customClass="w-full md:w-auto"
		/>
	</div>
</form>
