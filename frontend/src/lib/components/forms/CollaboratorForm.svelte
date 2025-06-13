<!--
* Componente: CollaboratorForm
  -*- Descripción: formulario de registro de colaboradores.
  -*- Soporta registro individual u organización con representante.
  -*- Usa funciones compartidas para validaciones (email y mayoría de edad).

TODOS:
	- [ ] Validar CUIT/CUIL con regex (opcional).
	- [ ] Mejorar accesibilidad (roles ARIA, etiquetas).
  	- [ ] Manejo de errores más robusto (backend).
  	- [ ] Integración con API para registro.
  	- [ ] Estilos y diseño responsivo -> mejorar todavía está fiero
  	- [ ] Pruebas unitarias y de integración.
-->

<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import DatePicker from '$lib/components/forms/DatePicker.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	// Función de validación de email mínima
	function isValidEmail(email: string): boolean {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}
	// Función de mayoría de edad mínima (18 años)
	function isAdult(date: string): boolean {
		if (!date) return false;
		const birth = new Date(date);
		const today = new Date();
		const age = today.getFullYear() - birth.getFullYear();
		const m = today.getMonth() - birth.getMonth();
		return age > 18 || (age === 18 && m >= 0 && today.getDate() >= birth.getDate());
	}

	let tipo: 'persona' | 'organizacion' = 'persona';

	// Datos persona
	let nombre = '';
	let apellido = '';
	let docTipo = 'DNI';
	let docOtro = '';
	let docNumero = '';
	let nacimiento = '';
	let cuil = '';

	// Datos organización
	let razonSocial = '';
	let cuit = '';
	let repNombre = '';
	let repApellido = '';
	let repDocTipo = 'DNI';
	let repDocOtro = '';
	let repDocNumero = '';
	let repNacimiento = '';

	// Datos comunes
	let username = '';
	let email = '';
	let password = '';
	let repassword = '';

	let sending = false;

	let errors: Record<string, string> = {};

	$: errors = {
		// Persona
		nombre: tipo === 'persona' ? (nombre.trim() ? '' : 'Requerido') : '',
		apellido: tipo === 'persona' ? (apellido.trim() ? '' : 'Requerido') : '',
		docTipo: '', // No validás esto
		docOtro:
			tipo === 'persona' && docTipo === 'Otro' && !docOtro.trim() ? 'Especifique el documento' : '',
		docNumero: tipo === 'persona' ? (docNumero.trim() ? '' : 'Documento obligatorio') : '',
		nacimiento:
			tipo === 'persona'
				? nacimiento && isAdult(nacimiento)
					? ''
					: 'Debe ser mayor de 18 años'
				: '',
		cuil: tipo === 'persona' ? (cuil.trim() ? '' : 'CUIL obligatorio') : '',
		// Organización
		razonSocial: tipo === 'organizacion' ? (razonSocial.trim() ? '' : 'Requerido') : '',
		cuit:
			tipo === 'organizacion'
				? cuit.trim()
					? ''
					: 'CUIT obligatorio'
				: tipo === 'persona'
					? cuil.trim()
						? ''
						: 'CUIL obligatorio'
					: '',
		repNombre: tipo === 'organizacion' ? (repNombre.trim() ? '' : 'Requerido') : '',
		repApellido: tipo === 'organizacion' ? (repApellido.trim() ? '' : 'Requerido') : '',
		repDocTipo: '', // No validás esto
		repDocOtro:
			tipo === 'organizacion' && repDocTipo === 'Otro' && !repDocOtro.trim()
				? 'Especifique el documento'
				: '',
		repDocNumero:
			tipo === 'organizacion' ? (repDocNumero.trim() ? '' : 'Documento obligatorio') : '',
		repNacimiento:
			tipo === 'organizacion'
				? repNacimiento && isAdult(repNacimiento)
					? ''
					: 'Debe ser mayor de 18 años'
				: '',
		// Comunes
		username: username.trim() ? '' : 'Requerido',
		email: email && isValidEmail(email) ? '' : 'Email inválido',
		password: password ? '' : 'Requerido',
		repassword: repassword && repassword === password ? '' : 'Las contraseñas no coinciden'
	};

	function handleSubmit(event: Event) {
		event.preventDefault();
		if (Object.values(errors).some(Boolean)) return;
		sending = true;
		// Procesar el formulario (ejemplo: enviar datos a backend)
		// ...
		sending = false;
	}
</script>

<form on:submit={handleSubmit} class="space-y-4">
	<div>
		<label for="tipo" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">
			Tipo de colaborador <span class="text-red-600">*</span>
		</label>
		<select
			id="tipo"
			bind:value={tipo}
			class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
		>
			<option value="persona">Persona</option>
			<option value="organizacion">Organización</option>
		</select>
	</div>

	{#if tipo === 'persona'}
		<div class="grid gap-4 md:grid-cols-2">
			<div>
				<label for="nombre" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">
					Nombre <span class="text-red-600">*</span>
				</label>
				<Input id="nombre" name="nombre" bind:value={nombre} required error={errors.nombre} />
			</div>
			<div>
				<label for="apellido" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">
					Apellido <span class="text-red-600">*</span>
				</label>
				<Input
					id="apellido"
					name="apellido"
					bind:value={apellido}
					required
					error={errors.apellido}
				/>
			</div>
			<div>
				<label for="docTipo" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">
					Tipo de documento <span class="text-red-600">*</span>
				</label>
				<select
					id="docTipo"
					bind:value={docTipo}
					class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
				>
					<option>DNI</option>
					<option>Pasaporte</option>
					<option>Otro</option>
				</select>
			</div>
			{#if docTipo === 'Otro'}
				<div>
					<label for="docOtro" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">
						Especifique <span class="text-red-600">*</span>
					</label>
					<Input id="docOtro" name="docOtro" bind:value={docOtro} required error={errors.docOtro} />
				</div>
			{/if}
			<div>
				<label for="docNumero" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">
					Número <span class="text-red-600">*</span>
				</label>
				<Input
					id="docNumero"
					name="docNumero"
					bind:value={docNumero}
					required
					error={errors.docNumero}
				/>
			</div>
			<div>
				<label
					for="nacimiento"
					class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
				>
					Fecha de nacimiento <span class="text-red-600">*</span>
				</label>
				<DatePicker
					id="nacimiento"
					name="nacimiento"
					bind:value={nacimiento}
					required
					error={errors.nacimiento}
				/>
			</div>
			<div>
				<label for="cuil" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">
					CUIL <span class="text-red-600">*</span>
				</label>
				<Input id="cuil" name="cuil" bind:value={cuil} required error={errors.cuil} />
			</div>
		</div>
	{:else}
		<div class="grid gap-4 md:grid-cols-2">
			<div class="md:col-span-2">
				<label
					for="razonSocial"
					class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
				>
					Razón social <span class="text-red-600">*</span>
				</label>
				<Input
					id="razonSocial"
					name="razonSocial"
					bind:value={razonSocial}
					required
					error={errors.razonSocial}
				/>
			</div>
			<div class="md:col-span-2">
				<label for="cuit" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">
					CUIT <span class="text-red-600">*</span>
				</label>
				<Input id="cuit" name="cuit" bind:value={cuit} required error={errors.cuit} />
			</div>
			<fieldset class="mt-4 space-y-4 md:col-span-2">
				<legend class="mb-2 text-sm font-semibold">Representante legal</legend>
				<div class="grid gap-4 md:grid-cols-2">
					<div>
						<label
							for="repNombre"
							class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
						>
							Nombre <span class="text-red-600">*</span>
						</label>
						<Input
							id="repNombre"
							name="repNombre"
							bind:value={repNombre}
							required
							error={errors.repNombre}
						/>
					</div>
					<div>
						<label
							for="repApellido"
							class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
						>
							Apellido <span class="text-red-600">*</span>
						</label>
						<Input
							id="repApellido"
							name="repApellido"
							bind:value={repApellido}
							required
							error={errors.repApellido}
						/>
					</div>
					<div>
						<label
							for="repDocTipo"
							class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
						>
							Tipo de documento <span class="text-red-600">*</span>
						</label>
						<select
							id="repDocTipo"
							bind:value={repDocTipo}
							class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
						>
							<option>DNI</option>
							<option>Pasaporte</option>
							<option>Otro</option>
						</select>
					</div>
					{#if repDocTipo === 'Otro'}
						<div>
							<label
								for="repDocOtro"
								class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
							>
								Especifique <span class="text-red-600">*</span>
							</label>
							<Input
								id="repDocOtro"
								name="repDocOtro"
								bind:value={repDocOtro}
								required
								error={errors.repDocOtro}
							/>
						</div>
					{/if}
					<div>
						<label
							for="repDocNumero"
							class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
						>
							Número <span class="text-red-600">*</span>
						</label>
						<Input
							id="repDocNumero"
							name="repDocNumero"
							bind:value={repDocNumero}
							required
							error={errors.repDocNumero}
						/>
					</div>
					<div>
						<label
							for="repNacimiento"
							class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
						>
							Fecha de nacimiento <span class="text-red-600">*</span>
						</label>
						<DatePicker
							id="repNacimiento"
							name="repNacimiento"
							bind:value={repNacimiento}
							required
							error={errors.repNacimiento}
						/>
					</div>
				</div>
			</fieldset>
		</div>
	{/if}

	<div>
		<label for="username" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">
			Nombre de usuario <span class="text-red-600">*</span>
		</label>
		<Input id="username" name="username" bind:value={username} required error={errors.username} />
	</div>
	<div>
		<label for="email" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">
			Email <span class="text-red-600">*</span>
		</label>
		<Input id="email" name="email" type="email" bind:value={email} required error={errors.email} />
	</div>
	<div class="grid gap-4 md:grid-cols-2">
		<div>
			<label for="password" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">
				Contraseña <span class="text-red-600">*</span>
			</label>
			<Input
				id="password"
				name="password"
				type="password"
				bind:value={password}
				required
				error={errors.password}
			/>
		</div>
		<div>
			<label for="repassword" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">
				Confirmar contraseña <span class="text-red-600">*</span>
			</label>
			<Input
				id="repassword"
				name="repassword"
				type="password"
				bind:value={repassword}
				required
				error={errors.repassword}
			/>
		</div>
	</div>
	<Button
		label="Continuar"
		disabled={sending || Object.values(errors).some(Boolean)}
		customClass="w-full"
	/>
</form>
