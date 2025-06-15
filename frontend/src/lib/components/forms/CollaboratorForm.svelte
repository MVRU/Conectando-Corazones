<!--
* Componente: CollaboratorForm
  -*- Descripción: formulario de registro de colaboradores.
  -*- Soporta registro individual u organización con representante.
  -*- Errores visibles siempre, sin necesidad de tocar campos.
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

	let sending = false;
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

	// Usuario y contraseña
	let username = '';
	let email = '';
	let password = '';
	let repassword = '';

	function isValidEmail(email: string): boolean {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	function isAdult(date: string): boolean {
		if (!date) return false;
		const birth = new Date(date);
		const today = new Date();
		const age = today.getFullYear() - birth.getFullYear();
		const m = today.getMonth() - birth.getMonth();
		return age > 18 || (age === 18 && m >= 0 && today.getDate() >= birth.getDate());
	}

	$: errors = {
		// Persona
		nombre: tipo === 'persona' ? (nombre.trim() ? '' : 'Requerido') : '',
		apellido: tipo === 'persona' ? (apellido.trim() ? '' : 'Requerido') : '',
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
		cuit: tipo === 'organizacion' ? (cuit.trim() ? '' : 'CUIT obligatorio') : '',
		repNombre: tipo === 'organizacion' ? (repNombre.trim() ? '' : 'Requerido') : '',
		repApellido: tipo === 'organizacion' ? (repApellido.trim() ? '' : 'Requerido') : '',
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

		// Credenciales
		username: username.trim() ? '' : 'Requerido',
		email: email.trim() && isValidEmail(email) ? '' : 'Email inválido',
		password: password.length >= 8 ? '' : 'Mínimo 8 caracteres',
		repassword: repassword === password ? '' : 'Las contraseñas no coinciden'
	};

	$: hasErrors = Object.values(errors).some((error) => error !== '');

	function handleSubmit(event: Event) {
		event.preventDefault();

		if (hasErrors) return;

		sending = true;

		// Simular envío
		setTimeout(() => {
			sending = false;
			alert('Formulario enviado');
		}, 1200);
	}
</script>

<form on:submit={handleSubmit} class="mx-auto max-w-4xl space-y-10">
	<h2 class="text-center text-3xl font-extrabold tracking-tight text-[rgb(var(--base-color))]">
		Registro de colaborador/a
	</h2>
	<p class="mx-auto max-w-2xl text-center text-base text-gray-600">
		Completá tus datos personales o los de tu organización para sumarte a iniciativas solidarias.
	</p>

	<!-- Tipo de colaborador -->
	<div>
		<label for="tipo" class="mb-2 block text-sm font-medium text-[rgb(var(--base-color))]">
			Tipo de colaborador <span class="text-red-600">*</span>
		</label>
		<select
			id="tipo"
			bind:value={tipo}
			class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-base text-black transition focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
		>
			<option value="persona">Persona</option>
			<option value="organizacion">Organización</option>
		</select>
	</div>

	<!-- Datos persona -->
	{#if tipo === 'persona'}
		<fieldset class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<!-- Nombre y Apellido -->
			<div>
				<label for="nombre" class="mb-2 block text-sm font-semibold text-[rgb(var(--base-color))]">
					Nombre <span class="text-red-600">*</span>
				</label>
				<Input id="nombre" bind:value={nombre} error={errors.nombre} />
			</div>
			<div>
				<label
					for="apellido"
					class="mb-2 block text-sm font-semibold text-[rgb(var(--base-color))]"
				>
					Apellido <span class="text-red-600">*</span>
				</label>
				<Input id="apellido" bind:value={apellido} error={errors.apellido} />
			</div>

			<!-- Documento -->
			<div>
				<label for="docTipo" class="mb-2 block text-sm font-semibold text-[rgb(var(--base-color))]">
					Tipo de documento <span class="text-red-600">*</span>
				</label>
				<select
					id="docTipo"
					bind:value={docTipo}
					class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-base text-black transition focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
				>
					<option>DNI</option>
					<option>Pasaporte</option>
					<option>Otro</option>
				</select>
			</div>
			{#if docTipo === 'Otro'}
				<div>
					<label
						for="docOtro"
						class="mb-2 block text-sm font-semibold text-[rgb(var(--base-color))]"
					>
						Especifique <span class="text-red-600">*</span>
					</label>
					<Input id="docOtro" bind:value={docOtro} error={errors.docOtro} />
				</div>
			{/if}
			<div>
				<label
					for="docNumero"
					class="mb-2 block text-sm font-semibold text-[rgb(var(--base-color))]"
				>
					Número <span class="text-red-600">*</span>
				</label>
				<Input id="docNumero" bind:value={docNumero} error={errors.docNumero} />
			</div>
			<div>
				<label
					for="nacimiento"
					class="mb-2 block text-sm font-semibold text-[rgb(var(--base-color))]"
				>
					Fecha de nacimiento <span class="text-red-600">*</span>
				</label>
				<DatePicker id="nacimiento" bind:value={nacimiento} error={errors.nacimiento} />
			</div>
			<div>
				<label for="cuil" class="mb-2 block text-sm font-semibold text-[rgb(var(--base-color))]">
					CUIL <span class="text-red-600">*</span>
				</label>
				<Input id="cuil" bind:value={cuil} error={errors.cuil} />
			</div>
		</fieldset>
	{:else}
		<!-- Datos organización -->
		<fieldset class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div class="md:col-span-2">
				<label
					for="razonSocial"
					class="mb-2 block text-sm font-semibold text-[rgb(var(--base-color))]"
				>
					Razón social <span class="text-red-600">*</span>
				</label>
				<Input id="razonSocial" bind:value={razonSocial} error={errors.razonSocial} />
			</div>
			<div class="md:col-span-2">
				<label for="cuit" class="mb-2 block text-sm font-semibold text-[rgb(var(--base-color))]">
					CUIT <span class="text-red-600">*</span>
				</label>
				<Input id="cuit" bind:value={cuit} error={errors.cuit} />
			</div>
		</fieldset>
	{/if}

	<!-- Usuario y contraseña -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<div>
			<label for="username" class="mb-2 block text-sm font-semibold text-[rgb(var(--base-color))]">
				Nombre de usuario <span class="text-red-600">*</span>
			</label>
			<Input id="username" bind:value={username} error={errors.username} />
		</div>
		<div>
			<label for="email" class="mb-2 block text-sm font-semibold text-[rgb(var(--base-color))]">
				Email <span class="text-red-600">*</span>
			</label>
			<Input id="email" type="email" bind:value={email} error={errors.email} />
		</div>
		<div>
			<label for="password" class="mb-2 block text-sm font-semibold text-[rgb(var(--base-color))]">
				Contraseña <span class="text-red-600">*</span>
			</label>
			<Input id="password" type="password" bind:value={password} error={errors.password} />
		</div>
		<div>
			<label
				for="repassword"
				class="mb-2 block text-sm font-semibold text-[rgb(var(--base-color))]"
			>
				Confirmar contraseña <span class="text-red-600">*</span>
			</label>
			<Input id="repassword" type="password" bind:value={repassword} error={errors.repassword} />
		</div>
	</div>

	<!-- Datos del representante legal (solo si es organización) -->
	{#if tipo === 'organizacion'}
		<div
			class="mt-4 flex flex-col gap-6 rounded-2xl border border-blue-100 bg-blue-50/70 px-6 py-7 shadow-sm"
		>
			<legend class="mb-2 flex items-center gap-2 text-base font-semibold text-blue-800">
				<svg
					class="h-5 w-5 text-blue-500"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					viewBox="0 0 24 24"
				>
					<circle cx="12" cy="7" r="4" />
					<path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2" />
				</svg>
				Datos del representante legal
			</legend>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div>
					<label
						for="repNombre"
						class="mb-2 block text-sm font-semibold text-[rgb(var(--base-color))]"
					>
						Nombre <span class="text-red-600">*</span>
					</label>
					<Input id="repNombre" bind:value={repNombre} error={errors.repNombre} />
				</div>
				<div>
					<label
						for="repApellido"
						class="mb-2 block text-sm font-semibold text-[rgb(var(--base-color))]"
					>
						Apellido <span class="text-red-600">*</span>
					</label>
					<Input id="repApellido" bind:value={repApellido} error={errors.repApellido} />
				</div>
				<div>
					<label
						for="repDocTipo"
						class="mb-2 block text-sm font-semibold text-[rgb(var(--base-color))]"
					>
						Tipo de documento <span class="text-red-600">*</span>
					</label>
					<select
						id="repDocTipo"
						bind:value={repDocTipo}
						class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-base text-black transition focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
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
							class="mb-2 block text-sm font-semibold text-[rgb(var(--base-color))]"
						>
							Especifique <span class="text-red-600">*</span>
						</label>
						<Input id="repDocOtro" bind:value={repDocOtro} error={errors.repDocOtro} />
					</div>
				{/if}
				<div>
					<label
						for="repDocNumero"
						class="mb-2 block text-sm font-semibold text-[rgb(var(--base-color))]"
					>
						Número de documento <span class="text-red-600">*</span>
					</label>
					<Input id="repDocNumero" bind:value={repDocNumero} error={errors.repDocNumero} />
				</div>
				<div>
					<label
						for="repNacimiento"
						class="mb-2 block text-sm font-semibold text-[rgb(var(--base-color))]"
					>
						Fecha de nacimiento <span class="text-red-600">*</span>
					</label>
					<DatePicker id="repNacimiento" bind:value={repNacimiento} error={errors.repNacimiento} />
				</div>
			</div>
		</div>
	{/if}

	<!-- Botón de envío -->
	<div class="mt-10 flex justify-end">
		<Button
			label={sending ? 'Enviando...' : 'Continuar'}
			disabled={sending || hasErrors}
			customClass="w-full md:w-auto rounded-xl bg-[rgb(var(--base-color))] text-white font-semibold px-8 py-3 shadow-md hover:shadow-xl transition-all duration-300 disabled:opacity-60"
		/>
	</div>
</form>
