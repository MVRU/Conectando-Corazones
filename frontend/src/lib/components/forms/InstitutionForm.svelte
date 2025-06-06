<!--
* Componente: InstitutionForm
        -*- Descripción: formulario de registro para instituciones.
        -*- Incluye datos de representante legal y validación básica.
        -*- Usa funciones compartidas para validaciones (email y mayoría de edad).
-->

<script lang="ts">
	import Button from '../ui/Button.svelte';
	import DatePicker from './DatePicker.svelte';
	import Input from '../ui/Input.svelte';
	import { isAdult, isValidEmail } from '$lib/utils/validation';

	let sending = false;
	let tipo = 'Escuela';
	let otroTipo = '';
	let errors: Record<string, string> = {};

	function handleSubmit(event: Event) {
		event.preventDefault();
		const data = new FormData(event.target as HTMLFormElement);
		errors = {};

		const nombre = (data.get('nombre') || '').toString().trim();
		const tipoSel = (data.get('tipo') || '').toString();
		const otro = (data.get('otroTipo') || '').toString().trim();
		const username = (data.get('username') || '').toString().trim();
		const email = (data.get('email') || '').toString().trim();
		const cuit = (data.get('cuit') || '').toString().trim();
		const repNombre = (data.get('repNombre') || '').toString().trim();
		const repApellido = (data.get('repApellido') || '').toString().trim();
		const repDocTipo = (data.get('repDocTipo') || '').toString();
		const repDocNumero = (data.get('repDocNumero') || '').toString().trim();
		const repNacimiento = (data.get('repNacimiento') || '').toString();
		const password = (data.get('password') || '').toString();
		const repassword = (data.get('repassword') || '').toString();

		if (!nombre) errors.nombre = 'Requerido';
		if (tipoSel === 'Otro' && !otro) errors.otroTipo = 'Especifique el tipo';
		if (!username) errors.username = 'Requerido';
		if (!email || !isValidEmail(email)) errors.email = 'Email inválido';
		if (!cuit) errors.cuit = 'CUIT obligatorio';
		if (!repNombre) errors.repNombre = 'Requerido';
		if (!repApellido) errors.repApellido = 'Requerido';
		if (!repDocTipo || !repDocNumero) errors.repDocNumero = 'Documento obligatorio';
		if (!repNacimiento || !isAdult(repNacimiento))
			errors.repNacimiento = 'Debe ser mayor de 18 años';
		if (!password) errors.password = 'Requerido';
		if (password !== repassword) errors.repassword = 'Las contraseñas no coinciden';

		if (Object.keys(errors).length > 0) return;

		sending = true;
		setTimeout(() => {
			sending = false;
			console.log('Institución registrada');
		}, 1000);
	}
</script>

<form on:submit={handleSubmit} class="space-y-6 rounded-2xl bg-white p-8 shadow">
	<div>
		<label for="nombre" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
			>Nombre de la institución *</label
		>
		<Input id="nombre" name="nombre" required error={errors.nombre} />
	</div>
	<div>
		<label for="tipo" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
			>Tipo de institución *</label
		>
		<select
			id="tipo"
			name="tipo"
			bind:value={tipo}
			required
			class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
		>
			<option>Escuela</option>
			<option>Hospital</option>
			<option>Comedor</option>
			<option>Otro</option>
		</select>
	</div>
	{#if tipo === 'Otro'}
		<div>
			<label for="otroTipo" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
				>Especifique *</label
			>
			<Input id="otroTipo" name="otroTipo" bind:value={otroTipo} required error={errors.otroTipo} />
		</div>
	{/if}
	<div>
		<label for="username" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
			>Nombre de usuario *</label
		>
		<Input id="username" name="username" required error={errors.username} />
	</div>
	<div>
		<label for="email" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
			>Email *</label
		>
		<Input id="email" name="email" type="email" required error={errors.email} />
	</div>
	<div>
		<label for="cuit" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
			>CUIT *</label
		>
		<Input id="cuit" name="cuit" required error={errors.cuit} />
	</div>
	<fieldset class="border-t pt-4">
		<legend class="mb-2 text-sm font-semibold">Representante legal</legend>
		<div class="grid gap-4 md:grid-cols-2">
			<div>
				<label for="repNombre" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
					>Nombre *</label
				>
				<Input id="repNombre" name="repNombre" required error={errors.repNombre} />
			</div>
			<div>
				<label
					for="repApellido"
					class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Apellido *</label
				>
				<Input id="repApellido" name="repApellido" required error={errors.repApellido} />
			</div>
			<div>
				<label for="repDocTipo" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
					>Tipo de documento *</label
				>
				<select
					id="repDocTipo"
					name="repDocTipo"
					required
					class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
				>
					<option>DNI</option>
					<option>Pasaporte</option>
					<option>Otro</option>
				</select>
			</div>
			<div>
				<label
					for="repDocNumero"
					class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Número *</label
				>
				<Input id="repDocNumero" name="repDocNumero" required error={errors.repDocNumero} />
			</div>
			<div class="md:col-span-2">
				<label
					for="repNacimiento"
					class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
					>Fecha de nacimiento *</label
				>
				<DatePicker id="repNacimiento" name="repNacimiento" required error={errors.repNacimiento} />
			</div>
		</div>
	</fieldset>
	<div>
		<label for="password" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
			>Contraseña *</label
		>
		<Input id="password" name="password" type="password" required error={errors.password} />
	</div>
	<div>
		<label for="repassword" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
			>Confirmar contraseña *</label
		>
		<Input id="repassword" name="repassword" type="password" required error={errors.repassword} />
	</div>
	<Button label="Continuar" disabled={sending} customClass="w-full" />
</form>
