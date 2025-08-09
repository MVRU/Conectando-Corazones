<script lang="ts">
	import Input from '../ui/Input.svelte';
	import Button from '../ui/elements/Button.svelte';
	import Select from '../ui/elements/Select.svelte';
	import { createEventDispatcher } from 'svelte';

	import {
		isValidEmail,
		isValidInternationalPhone,
		isValidWeb,
		ERROR_MESSAGES
	} from '$lib/utils/validators';

	let contactos = [{ tipo: 'Teléfono', valor: '', etiqueta: '' }];
	let sending = false;

	const tiposContacto = ['Teléfono', 'Correo electrónico', 'Sitio web', 'Red social', 'Otro'];
	const redesSociales = ['Instagram', 'Facebook', 'LinkedIn', 'WhatsApp'];
	const etiquetasGenerales = ['Principal', 'Secundario', 'Personal'];

	const dispatch = createEventDispatcher();

	export let showSkip = false;
	export let skipLabel = 'Omitir';

	function getPlaceholder(tipo: string): string {
		switch (tipo) {
			case 'Teléfono':
				return 'Ej: +54 9 1234 5678';
			case 'Correo electrónico':
				return 'Ej: contacto@ejemplo.com';
			case 'Sitio web':
				return 'Ej: https://tuorganizacion.org';
			case 'Red social':
				return 'Ej: @tuorganizacion';
			case 'Otro':
				return 'Ej: Telegram, Fax...';
			default:
				return 'Ej: Valor del contacto';
		}
	}

	$: errors = contactos.map((contacto, index) => {
		const { tipo, valor, etiqueta } = contacto;

		if (!valor.trim()) return ERROR_MESSAGES.required;

		if (tipo === 'Teléfono' && !isValidInternationalPhone(valor))
			return ERROR_MESSAGES.phoneInvalid;

		if (tipo === 'Correo electrónico' && !isValidEmail(valor)) return ERROR_MESSAGES.emailInvalid;

		if (tipo === 'Sitio web' && !isValidWeb(valor)) return ERROR_MESSAGES.urlInvalid;

		if (tipo === 'Otro' && !etiqueta?.trim()) return ERROR_MESSAGES.specifyOtherContact;

		const isDuplicate = contactos.some(
			(c, i) => i !== index && c.tipo === tipo && c.valor === valor
		);

		if (isDuplicate) return ERROR_MESSAGES.contactDuplicate;

		return '';
	});

	$: telefonoValido = contactos.some(
		(c) => c.tipo === 'Teléfono' && isValidInternationalPhone(c.valor)
	);

	$: hasErrors = !telefonoValido || contactos.some((_, i) => errors[i]);

	function addContact() {
		contactos = [...contactos, { tipo: 'Teléfono', valor: '', etiqueta: '' }];
	}

	function removeContact(index: number) {
		contactos = contactos.filter((_, i) => i !== index);
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (hasErrors) return;

		sending = true;

		setTimeout(() => {
			sending = false;
			dispatch('submit', contactos);
		}, 800);
	}
</script>

<form on:submit={handleSubmit}>
	<div class="space-y-6">
		{#each contactos as contacto, i (contacto)}
			<div
				class="group relative flex flex-row items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
			>
				<div class="flex flex-1 flex-wrap gap-4">
					<!-- Tipo de contacto -->
					<div class="min-w-[200px] flex-1 md:flex-none">
						<label for="tipo-{i}" class="mb-2 block text-sm font-semibold text-gray-700">
							Tipo de contacto
						</label>
						<Select
							id={'tipo-' + i}
							bind:value={contacto.tipo}
							disabled={i === 0}
							options={tiposContacto.map((t) => ({ value: t, label: t }))}
							searchable={false}
						/>
					</div>

					<!-- Valor del contacto -->
					<div class="min-w-[200px] flex-1 md:flex-none">
						<label for="valor-{i}" class="mb-2 block text-sm font-semibold text-gray-700">
							Valor <span class="text-red-600">*</span>
						</label>
						<Input
							id="valor-{i}"
							bind:value={contacto.valor}
							placeholder={getPlaceholder(contacto.tipo)}
							error={errors[i]}
						/>
					</div>

					<!-- Etiqueta -->
					<div class="min-w-[200px] flex-1 md:flex-none">
						<label for="etiqueta-{i}" class="mb-2 block text-sm font-semibold text-gray-700">
							{contacto.tipo === 'Otro' ? 'Especificar tipo' : 'Etiqueta'}
						</label>
						{#if contacto.tipo === 'Red social'}
							<Select
								id={'etiqueta-' + i}
								bind:value={contacto.etiqueta}
								options={[
									{ value: '', label: 'Elegí una red social' },
									...redesSociales.map((r) => ({ value: r, label: r }))
								]}
								searchable={false}
							/>
						{:else if contacto.tipo === 'Otro'}
							<Input
								id="etiqueta-{i}"
								bind:value={contacto.etiqueta}
								placeholder="Ej: Telegram..."
							/>
						{:else}
							<Select
								id={'etiqueta-' + i}
								bind:value={contacto.etiqueta}
								options={[
									{ value: '', label: 'Elegí una opción' },
									...etiquetasGenerales.map((t) => ({ value: t, label: t }))
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
								on:click={() => removeContact(i)}
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
				on:click={addContact}
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
		{#if showSkip}
			<Button
				label={skipLabel}
				variant="secondary"
				size="md"
				on:click={() => dispatch('skip')}
				customClass="w-full md:w-auto"
			/>
		{/if}
		<Button
			label={sending ? 'Guardando...' : 'Continuar'}
			variant="primary"
			size="md"
			disabled={hasErrors || sending}
			customClass="w-full md:w-auto"
		/>
	</div>
</form>
