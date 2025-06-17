<!-- ContactMethodsForm.svelte -->
<script lang="ts">
	import Input from '../ui/Input.svelte';
	import Button from '../ui/Button.svelte';
	import { createEventDispatcher } from 'svelte';

	// Importa funciones y mensajes del archivo centralizado
	import {
		isValidEmail,
		isValidInternationalPhone,
		isValidWeb,
		ERROR_MESSAGES
	} from '$lib/utils/validators';

	let contactos = [{ tipo: 'Teléfono', valor: '', etiqueta: '' }];
	let sending = false;

	// Tipos principales de contacto
	const tiposContacto = ['Teléfono', 'Correo electrónico', 'Sitio web', 'Red social', 'Otro'];
	const redesSociales = ['Instagram', 'Facebook', 'LinkedIn', 'WhatsApp'];
	const etiquetasGenerales = ['Principal', 'Secundario', 'Personal'];

	// Dispatcher de evento
	const dispatch = createEventDispatcher();

	// Función para obtener placeholder según tipo
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

	// Validaciones reactivas por contacto
	$: errors = contactos.map((contacto, index) => {
		const { tipo, valor, etiqueta } = contacto;

		if (!valor.trim()) return ERROR_MESSAGES.required;

		if (tipo === 'Teléfono' && !isValidInternationalPhone(valor))
			return ERROR_MESSAGES.phoneInvalid;

		if (tipo === 'Correo electrónico' && !isValidEmail(valor)) return ERROR_MESSAGES.emailInvalid;

		if (tipo === 'Sitio web' && !isValidWeb(valor)) return ERROR_MESSAGES.urlInvalid;

		if (tipo === 'Otro' && !etiqueta?.trim()) return ERROR_MESSAGES.specifyOtherContact;

		// Validar duplicados (mismo tipo + valor)
		const isDuplicate = contactos.some(
			(c, i) => i !== index && c.tipo === tipo && c.valor === valor
		);

		if (isDuplicate) return ERROR_MESSAGES.contactDuplicate;

		return '';
	});

	// Valida si hay al menos un teléfono válido
	$: telefonoValido = contactos.some(
		(c) => c.tipo === 'Teléfono' && isValidInternationalPhone(c.valor)
	);

	// Verifica duplicados
	$: contactosUnicos = Array.from(new Set(contactos.map((c) => c.valor)));
	$: hasErrors = !telefonoValido || contactos.some((_, i) => errors[i]);

	// Agrega un nuevo contacto
	function addContact() {
		contactos = [...contactos, { tipo: 'Teléfono', valor: '', etiqueta: '' }];
	}

	// Elimina un contacto
	function removeContact(index: number) {
		contactos = contactos.filter((_, i) => i !== index);
	}

	// Maneja el envío del formulario
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
				class="group relative flex flex-wrap items-end gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
			>
				<!-- Tipo de contacto -->
				<div class="min-w-[200px] flex-1 md:flex-none">
					<label for="tipo-{i}" class="mb-2 block text-sm font-semibold text-gray-700">
						Tipo de contacto
					</label>
					<select
						id="tipo-{i}"
						bind:value={contacto.tipo}
						disabled={i === 0}
						class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-base text-black focus:border-blue-400 focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
					>
						{#each tiposContacto as tipo}
							<option value={tipo}>{tipo}</option>
						{/each}
					</select>
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

				<!-- Etiqueta opcional -->
				<div class="min-w-[200px] flex-1 md:flex-none">
					<label for="etiqueta-{i}" class="mb-2 block text-sm font-semibold text-gray-700">
						{contacto.tipo === 'Otro' ? 'Especificar tipo' : 'Etiqueta'}
					</label>
					{#if contacto.tipo === 'Red social'}
						<select
							id="etiqueta-{i}"
							bind:value={contacto.etiqueta}
							class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-base text-black focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
						>
							<option value="">Elegí una red social</option>
							{#each redesSociales as red}
								<option value={red}>{red}</option>
							{/each}
						</select>
					{:else if contacto.tipo === 'Otro'}
						<Input id="etiqueta-{i}" bind:value={contacto.etiqueta} placeholder="Ej: Telegram..." />
					{:else}
						<select
							id="etiqueta-{i}"
							bind:value={contacto.etiqueta}
							class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-base text-black focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
						>
							<option value="">Elegí una opción</option>
							{#each etiquetasGenerales as tag}
								<option value={tag}>{tag}</option>
							{/each}
						</select>
					{/if}
				</div>

				<!-- Botón eliminar -->
				{#if i > 0}
					<button
						type="button"
						on:click={() => removeContact(i)}
						class="cursor-pointer self-end rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 focus:outline-none"
					>
						Eliminar
					</button>
				{/if}
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

	<!-- Botón continuar -->
	<div class="mt-8 flex justify-end">
		<Button
			label={sending ? 'Guardando...' : 'Continuar'}
			variant="primary"
			size="md"
			type="submit"
			disabled={hasErrors || sending}
			customClass="w-full md:w-auto"
		/>
	</div>
</form>
