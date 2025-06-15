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

	let tipo: 'persona' | 'organizacion' = 'persona';

	let nombre = '',
		apellido = '',
		docTipo = 'DNI',
		docOtro = '',
		docNumero = '',
		nacimiento = '',
		cuil = '';
	let razonSocial = '',
		cuit = '',
		repNombre = '',
		repApellido = '',
		repDocTipo = 'DNI',
		repDocOtro = '',
		repDocNumero = '',
		repNacimiento = '';
	let username = '',
		email = '',
		password = '',
		repassword = '';
	let sending = false;

	let errors: Record<string, string> = {};

	$: errors = {
		nombre: tipo === 'persona' ? (nombre.trim() ? '' : 'Requerido') : '',
		apellido: tipo === 'persona' ? (apellido.trim() ? '' : 'Requerido') : '',
		docTipo: '',
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
		razonSocial: tipo === 'organizacion' ? (razonSocial.trim() ? '' : 'Requerido') : '',
		cuit: tipo === 'organizacion' ? (cuit.trim() ? '' : 'CUIT obligatorio') : '',
		repNombre: tipo === 'organizacion' ? (repNombre.trim() ? '' : 'Requerido') : '',
		repApellido: tipo === 'organizacion' ? (repApellido.trim() ? '' : 'Requerido') : '',
		repDocTipo: '',
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
		username: username.trim() ? '' : 'Requerido',
		email: email && isValidEmail(email) ? '' : 'Email inválido',
		password: password ? '' : 'Requerido',
		repassword: repassword && repassword === password ? '' : 'Las contraseñas no coinciden'
	};

	function handleSubmit(event: Event) {
		event.preventDefault();
		if (Object.values(errors).some(Boolean)) return;
		sending = true;
		// Procesar datos...
		sending = false;
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
				<Input id="nombre" bind:value={nombre} required error={errors.nombre} />
			</div>
			<div>
				<label
					for="apellido"
					class="mb-2 block text-sm font-semibold text-[rgb(var(--base-color))]"
				>
					Apellido <span class="text-red-600">*</span>
				</label>
				<Input id="apellido" bind:value={apellido} required error={errors.apellido} />
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
					<Input id="docOtro" bind:value={docOtro} required error={errors.docOtro} />
				</div>
			{/if}

			<div>
				<label
					for="docNumero"
					class="mb-2 block text-sm font-semibold text-[rgb(var(--base-color))]"
				>
					Número <span class="text-red-600">*</span>
				</label>
				<Input id="docNumero" bind:value={docNumero} required error={errors.docNumero} />
			</div>
			<div>
				<label
					for="nacimiento"
					class="mb-2 block text-sm font-semibold text-[rgb(var(--base-color))]"
				>
					Fecha de nacimiento <span class="text-red-600">*</span>
				</label>
				<DatePicker id="nacimiento" bind:value={nacimiento} required error={errors.nacimiento} />
			</div>
			<div>
				<label for="cuil" class="mb-2 block text-sm font-semibold text-[rgb(var(--base-color))]">
					CUIL <span class="text-red-600">*</span>
				</label>
				<Input id="cuil" bind:value={cuil} required error={errors.cuil} />
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
				<Input id="razonSocial" bind:value={razonSocial} required error={errors.razonSocial} />
			</div>
			<div class="md:col-span-2">
				<label for="cuit" class="mb-2 block text-sm font-semibold text-[rgb(var(--base-color))]">
					CUIT <span class="text-red-600">*</span>
				</label>
				<Input id="cuit" bind:value={cuit} required error={errors.cuit} />
			</div>
		</fieldset>
	{/if}

	<!-- Usuario y contraseña -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<div>
			<label for="username" class="mb-2 block text-sm font-semibold text-[rgb(var(--base-color))]">
				Nombre de usuario <span class="text-red-600">*</span>
			</label>
			<Input id="username" bind:value={username} required error={errors.username} />
		</div>
		<div>
			<label for="email" class="mb-2 block text-sm font-semibold text-[rgb(var(--base-color))]">
				Email <span class="text-red-600">*</span>
			</label>
			<Input id="email" type="email" bind:value={email} required error={errors.email} />
		</div>
		<div>
			<label for="password" class="mb-2 block text-sm font-semibold text-[rgb(var(--base-color))]">
				Contraseña <span class="text-red-600">*</span>
			</label>
			<Input id="password" type="password" bind:value={password} required error={errors.password} />
		</div>
		<div>
			<label
				for="repassword"
				class="mb-2 block text-sm font-semibold text-[rgb(var(--base-color))]"
			>
				Confirmar contraseña <span class="text-red-600">*</span>
			</label>
			<Input
				id="repassword"
				type="password"
				bind:value={repassword}
				required
				error={errors.repassword}
			/>
		</div>
	</div>

	<!-- Datos del representante legal (solo si es organización) -->
	{#if tipo === 'organizacion'}
		<div class="rounded-2xl border border-blue-100 bg-blue-50/60 px-6 py-8 shadow-sm">
			<h3 class="mb-4 text-base font-semibold text-blue-800">Datos del representante legal</h3>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div>
					<label
						for="repNombre"
						class="mb-2 block text-sm font-semibold text-[rgb(var(--base-color))]"
					>
						Nombre <span class="text-red-600">*</span>
					</label>
					<Input id="repNombre" bind:value={repNombre} required error={errors.repNombre} />
				</div>
				<div>
					<label
						for="repApellido"
						class="mb-2 block text-sm font-semibold text-[rgb(var(--base-color))]"
					>
						Apellido <span class="text-red-600">*</span>
					</label>
					<Input id="repApellido" bind:value={repApellido} required error={errors.repApellido} />
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
						<Input id="repDocOtro" bind:value={repDocOtro} required error={errors.repDocOtro} />
					</div>
				{/if}
				<div>
					<label
						for="repDocNumero"
						class="mb-2 block text-sm font-semibold text-[rgb(var(--base-color))]"
					>
						Número de documento <span class="text-red-600">*</span>
					</label>
					<Input id="repDocNumero" bind:value={repDocNumero} required error={errors.repDocNumero} />
				</div>
				<div>
					<label
						for="repNacimiento"
						class="mb-2 block text-sm font-semibold text-[rgb(var(--base-color))]"
					>
						Fecha de nacimiento <span class="text-red-600">*</span>
					</label>
					<DatePicker
						id="repNacimiento"
						bind:value={repNacimiento}
						required
						error={errors.repNacimiento}
					/>
				</div>
			</div>
		</div>
	{/if}

	<Button
		label="Continuar"
		disabled={sending || Object.values(errors).some(Boolean)}
		customClass="w-full mt-8"
	/>
</form>
