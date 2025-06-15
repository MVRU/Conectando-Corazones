<script lang="ts">
	import Input from '../ui/Input.svelte';
	import Button from '../ui/Button.svelte';

	let contactos = [{ tipo: 'Teléfono', valor: '', etiqueta: '' }];
	let sending = false;

	// Tipos principales de contacto
	const tiposContacto = ['Teléfono', 'Correo electrónico', 'Sitio web', 'Red social', 'Otro'];

	// Opciones específicas por tipo
	const redesSociales = ['Instagram', 'Facebook', 'LinkedIn', 'WhatsApp'];
	const etiquetasGenerales = ['Principal', 'Secundario', 'Personal'];

	function isValidTelefono(valor: string): boolean {
		const telefonoRegex = /^\+?54\s?9?\d{10}$/;
		return telefonoRegex.test(valor.replace(/\s|-|\(|\)/g, ''));
	}

	function isValidEmail(valor: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(valor);
	}

	function isValidWeb(valor: string): boolean {
		const webRegex = /^(https?:\/\/)?([\w\-])+\.{1}[\w\-]+(\.[\w\-]+)*(:[0-9]+)?(\/.*)?$/;
		return webRegex.test(valor);
	}

	$: contactosUnicos = Array.from(new Set(contactos.map((c) => c.valor)));

	$: errors = contactos.map(({ tipo, valor, etiqueta }) => {
		if (tipo === 'Teléfono') return !isValidTelefono(valor) ? 'Teléfono inválido' : '';
		if (tipo === 'Correo electrónico') return !isValidEmail(valor) ? 'Email inválido' : '';
		if (tipo === 'Sitio web') return !isValidWeb(valor) ? 'URL inválida' : '';
		if (tipo === 'Otro' && !etiqueta?.trim()) return 'Especifica el tipo de contacto';
		return '';
	});

	$: telefonoValido = contactos.some((c) => c.tipo === 'Teléfono' && isValidTelefono(c.valor));

	$: hasErrors = !telefonoValido || contactosUnicos.length !== contactos.length;

	function getPlaceholder(tipo: string) {
		switch (tipo) {
			case 'Teléfono':
				return 'Ej: +54 9 11 1234 5678';
			case 'Correo electrónico':
				return 'Ej: contacto@ejemplo.com';
			case 'Sitio web':
				return 'Ej: https://tuorganizacion.org';
			case 'Red social':
				return 'Ej: @tuorganizacion';
			case 'Otro':
				return 'Ej: Telegram, Fax, etc.';
			default:
				return 'Ej: Valor del contacto';
		}
	}

	// Event dispatcher
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

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
				class="flex flex-wrap items-end gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
			>
				<!-- Tipo de contacto -->
				<div class="min-w-[200px] flex-1 md:flex-none">
					<label for="tipo-{i}" class="mb-2 block text-sm font-semibold text-gray-700"
						>Tipo de contacto</label
					>
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
					<label for="valor-{i}" class="mb-2 block text-sm font-semibold text-gray-700">Valor</label
					>
					<Input
						id="valor-{i}"
						bind:value={contacto.valor}
						placeholder={getPlaceholder(contacto.tipo)}
					/>
					{#if errors[i]}
						<p class="mt-1 text-sm text-red-600">{errors[i]}</p>
					{/if}
				</div>

				<!-- Etiqueta opcional -->
				<div class="min-w-[200px] flex-1 md:flex-none">
					<label for="etiqueta-{i}" class="mb-2 block text-sm font-semibold text-gray-700">
						{contacto.tipo === 'Otro' ? 'Especificar tipo de contacto' : 'Etiqueta (opcional)'}
					</label>
					{#if contacto.tipo === 'Red social'}
						<select
							id="etiqueta-{i}"
							bind:value={contacto.etiqueta}
							class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-base text-black focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
						>
							<option value="">Selecciona una red social</option>
							{#each redesSociales as red}
								<option value={red}>{red}</option>
							{/each}
						</select>
					{:else if contacto.tipo === 'Otro'}
						<Input
							id="etiqueta-{i}"
							bind:value={contacto.etiqueta}
							placeholder="Ej: Fax, Telegram..."
						/>
					{:else}
						<select
							id="etiqueta-{i}"
							bind:value={contacto.etiqueta}
							class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-base text-black focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
						>
							<option value="">Selecciona una etiqueta</option>
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
						class="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100"
					>
						Eliminar
					</button>
				{/if}
			</div>
		{/each}

		<!-- Botón para agregar más contactos -->
		<div class="mt-4 flex justify-center">
			<button
				type="button"
				on:click={addContact}
				class="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
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
		<Button label={sending ? 'Guardando...' : 'Continuar'} disabled={hasErrors || sending} />
	</div>
</form>
