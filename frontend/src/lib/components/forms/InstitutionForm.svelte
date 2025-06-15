<!--
* Componente: InstitutionForm
  -*- Mejora: UX profesional y validaciones modernas.
  -*- Errores solo al interactuar/tocar campos.

TODOS:
  - [ ] Validar CUIT con regex (formato argentino)
  - [ ] Validar fecha de nacimiento (mayor de 18 años)
  - [ ] Mejorar estilos y accesibilidad -> todavía está muy fiero
  - [ ] Agregar animaciones sutiles al enviar formulario
  - [ ] Implementar lógica de envío real (API)
-->

<script lang="ts">
	import Input from '../ui/Input.svelte';
	import DatePicker from './DatePicker.svelte';
	import Button from '../ui/Button.svelte';

	// Validaciones
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

	function isValidUsername(username: string): boolean {
		return /^[a-zA-Z0-9._-]{3,30}$/.test(username);
	}

	function isValidCuit(cuit: string): boolean {
		const cuitRegex = /^(\d{2})-\d{7,8}-\d$/;
		return cuitRegex.test(cuit);
	}

	// Estados
	let sending = false;
	let nombre = '';
	let tipo = 'Escuela';
	let otroTipo = '';
	let username = '';
	let email = '';
	let cuit = '';
	let password = '';
	let repassword = '';
	let repNombre = '';
	let repApellido = '';
	let repDocTipo = 'DNI';
	let repDocOtro = '';
	let repDocNumero = '';
	let repNacimiento = '';

	// Validaciones
	$: errors = {
		nombre: nombre.trim() ? '' : 'El nombre es obligatorio',
		otroTipo: tipo === 'Otro' && otroTipo.trim() === '' ? 'Debe especificar el tipo' : '',
		username: !username.trim()
			? 'El nombre de usuario es obligatorio'
			: !isValidUsername(username)
				? 'Solo letras, números, ".", "-", "_" (3-30 caracteres)'
				: '',
		email: !email.trim() ? 'El email es obligatorio' : !isValidEmail(email) ? 'Email inválido' : '',
		cuit: cuit.trim() && isValidCuit(cuit) ? '' : 'CUIT inválido',
		password: password.length < 8 ? 'Debe tener al menos 8 caracteres' : '',
		repassword: repassword !== password ? 'Las contraseñas no coinciden' : '',
		repNombre: repNombre.trim() ? '' : 'El nombre es obligatorio',
		repApellido: repApellido.trim() ? '' : 'El apellido es obligatorio',
		repDocOtro:
			repDocTipo === 'Otro' && repDocOtro.trim() === '' ? 'Debe especificar el documento' : '',
		repDocNumero: repDocNumero.trim() ? '' : 'El número es obligatorio',
		repNacimiento: repNacimiento && isAdult(repNacimiento) ? '' : 'Debe ser mayor de 18 años'
	};

	$: hasEmptyFields = Object.values(errors).some((error) => error !== '');

	// Verificar si hay errores en los campos
	$: hasErrors = Object.values(errors).some((error) => error !== '');

	// Función de envío
	function handleSubmit(event: Event) {
		event.preventDefault();

		// Verificar si hay errores
		if (hasErrors) return;

		sending = true;

		// Lógica de envío real a API

		setTimeout(() => {
			sending = false;
			alert('Formulario enviado');
		}, 1200);
	}
</script>

<form on:submit={handleSubmit} class="mx-auto max-w-4xl space-y-10">
	<h2 class="text-center text-3xl font-extrabold tracking-tight text-[rgb(var(--base-color))]">
		Registro de institución
	</h2>
	<p class="mx-auto max-w-2xl text-center text-base text-gray-600">
		Completá los datos de tu organización para comenzar a publicar proyectos solidarios.
	</p>

	<!-- DATOS DE LA INSTITUCIÓN -->
	<fieldset class="grid grid-cols-1 gap-8 md:grid-cols-2">
		<!-- Nombre institución -->
		<div>
			<label for="nombre" class="font-semibold text-gray-800">
				Nombre de la institución <span class="text-red-600">*</span>
			</label>
			<Input
				id="nombre"
				name="nombre"
				bind:value={nombre}
				customClass="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-base text-black placeholder-gray-400 shadow-sm transition focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
				placeholder="Ej: Fundación Sembrar"
				error={errors.nombre}
			/>
		</div>

		<!-- Tipo de institución -->
		<div>
			<label for="tipo" class="font-semibold text-gray-800">
				Tipo de institución <span class="text-red-600">*</span>
			</label>
			<select
				id="tipo"
				name="tipo"
				bind:value={tipo}
				class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-base text-black transition focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
			>
				<option>Escuela</option>
				<option>Hospital</option>
				<option>Comedor</option>
				<option>Fundación</option>
				<option>Asociación</option>
				<option>Parroquia</option>
				<option>Otro</option>
			</select>
		</div>

		{#if tipo === 'Otro'}
			<div>
				<label for="otroTipo" class="font-semibold text-gray-800">
					Especificar tipo <span class="text-red-600">*</span>
				</label>
				<Input
					id="otroTipo"
					name="otroTipo"
					bind:value={otroTipo}
					customClass="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-base text-black transition focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
					placeholder="Tipo de institución"
					error={errors.otroTipo}
				/>
			</div>
		{/if}

		<!-- Username -->
		<div>
			<label for="username" class="font-semibold text-gray-800">
				Usuario <span class="text-red-600">*</span>
			</label>
			<Input
				id="username"
				name="username"
				bind:value={username}
				customClass="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-base text-black placeholder-gray-400 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
				placeholder="fundacion123"
				error={errors.username}
			/>
		</div>

		<!-- Email -->
		<div>
			<label for="email" class="font-semibold text-gray-800">
				Email <span class="text-red-600">*</span>
			</label>
			<Input
				id="email"
				name="email"
				type="email"
				bind:value={email}
				customClass="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-base text-black placeholder-gray-400 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
				placeholder="institucion@email.com"
				error={errors.email}
			/>
		</div>

		<!-- CUIT -->
		<div>
			<label for="cuit" class="font-semibold text-gray-800">
				CUIT <span class="text-red-600">*</span>
			</label>
			<Input
				id="cuit"
				name="cuit"
				bind:value={cuit}
				customClass="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-base text-black transition focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
				placeholder="Ej: 30-12345678-9"
				error={errors.cuit}
			/>
		</div>

		<!-- Contraseña -->
		<div>
			<label for="password" class="font-semibold text-gray-800">
				Contraseña <span class="text-red-600">*</span>
			</label>
			<Input
				id="password"
				name="password"
				type="password"
				bind:value={password}
				customClass="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-base text-black transition focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
				placeholder="********"
				error={errors.password}
			/>
		</div>

		<!-- Confirmar contraseña -->
		<div>
			<label for="repassword" class="font-semibold text-gray-800">
				Repetir contraseña <span class="text-red-600">*</span>
			</label>
			<Input
				id="repassword"
				name="repassword"
				type="password"
				bind:value={repassword}
				customClass="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-base text-black transition focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
				placeholder="********"
				error={errors.repassword}
			/>
		</div>
	</fieldset>

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
				<circle cx="12" cy="7" r="4" /><path d="M5.5 21v-2a6.5 6.5 0 0113 0v2" />
			</svg>
			Datos del representante legal
		</legend>

		<!-- Datos del representante -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div>
				<label for="repNombre" class="font-medium text-[rgb(15,16,41)]">
					Nombre <span class="text-red-600">*</span>
				</label>
				<Input
					id="repNombre"
					name="repNombre"
					bind:value={repNombre}
					customClass="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-lg text-black transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
					placeholder="Nombre del representante"
					error={errors.repNombre}
				/>
			</div>
			<div>
				<label for="repApellido" class="font-medium text-[rgb(15,16,41)]">
					Apellido <span class="text-red-600">*</span>
				</label>
				<Input
					id="repApellido"
					name="repApellido"
					bind:value={repApellido}
					customClass="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-lg text-black transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
					placeholder="Apellido del representante"
					error={errors.repApellido}
				/>
			</div>
			<div>
				<label for="repDocTipo" class="font-medium text-[rgb(15,16,41)]">
					Tipo de documento <span class="text-red-600">*</span>
				</label>
				<select
					id="repDocTipo"
					name="repDocTipo"
					bind:value={repDocTipo}
					class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-lg text-black transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
				>
					<option>DNI</option>
					<option>Pasaporte</option>
					<option>Otro</option>
				</select>
			</div>
			{#if repDocTipo === 'Otro'}
				<div>
					<label for="repDocOtro" class="font-medium text-[rgb(15,16,41)]">
						Especifique <span class="text-red-600">*</span>
					</label>
					<Input
						id="repDocOtro"
						name="repDocOtro"
						bind:value={repDocOtro}
						customClass="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-lg text-black transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
						placeholder="Tipo de documento"
						error={errors.repDocOtro}
					/>
				</div>
			{/if}
			<div>
				<label for="repDocNumero" class="font-medium text-[rgb(15,16,41)]">
					Número de documento <span class="text-red-600">*</span>
				</label>
				<Input
					id="repDocNumero"
					name="repDocNumero"
					bind:value={repDocNumero}
					customClass="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-lg text-black transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
					placeholder="Ej: 12345678"
					error={errors.repDocNumero}
				/>
			</div>
			<div>
				<label for="repNacimiento" class="font-medium text-[rgb(15,16,41)]">
					Fecha de nacimiento <span class="text-red-600">*</span>
				</label>
				<DatePicker
					id="repNacimiento"
					name="repNacimiento"
					bind:value={repNacimiento}
					error={errors.repNacimiento}
				/>
			</div>
		</div>
	</div>

	<!-- Botón de envío -->
	<div class="mt-10 flex justify-end">
		<Button
			label={sending ? 'Enviando...' : 'Continuar'}
			disabled={sending || hasErrors}
			customClass="w-full md:w-auto rounded-xl bg-[rgb(var(--base-color))] text-white font-semibold px-8 py-3 shadow-md hover:shadow-xl transition-all duration-300 disabled:opacity-60"
		/>
	</div>
</form>
