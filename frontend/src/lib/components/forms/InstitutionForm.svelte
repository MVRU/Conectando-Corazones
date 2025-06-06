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

	// Campos que el usuario ya tocó/interactuó
	let touched: Record<string, boolean> = {};

	// Para marcar el campo como "touched" cuando pierde foco
	function setTouched(field: string) {
		touched = { ...touched, [field]: true };
	}

	// Para marcar el campo como "touched" cuando el usuario escribe después de haberlo tocado
	function onInput(field: string) {
		if (!touched[field]) touched = { ...touched, [field]: true };
	}

	$: errors = {
		nombre: touched.nombre ? (nombre.trim() ? '' : 'El nombre es obligatorio') : '',
		otroTipo:
			tipo === 'Otro' && touched.otroTipo
				? otroTipo.trim()
					? ''
					: 'Debe especificar el tipo'
				: '',
		username: touched.username
			? !username.trim()
				? 'El nombre de usuario es obligatorio'
				: !isValidUsername(username)
					? 'Solo letras, números, ".", "-", "_" (3-30 caracteres)'
					: ''
			: '',
		email: touched.email
			? !email.trim()
				? 'El email es obligatorio'
				: !isValidEmail(email)
					? 'Email inválido'
					: ''
			: '',
		cuit: touched.cuit ? (cuit.trim() ? '' : 'El CUIT es obligatorio') : '',
		password: touched.password
			? password.length < 8
				? 'Debe tener al menos 8 caracteres'
				: ''
			: '',
		repassword:
			touched.repassword || (touched.password && repassword)
				? repassword !== password
					? 'Las contraseñas no coinciden'
					: ''
				: '',
		repNombre: touched.repNombre ? (repNombre.trim() ? '' : 'El nombre es obligatorio') : '',
		repApellido: touched.repApellido
			? repApellido.trim()
				? ''
				: 'El apellido es obligatorio'
			: '',
		repDocOtro:
			repDocTipo === 'Otro' && touched.repDocOtro
				? repDocOtro.trim()
					? ''
					: 'Debe especificar el documento'
				: '',
		repDocNumero: touched.repDocNumero
			? repDocNumero.trim()
				? ''
				: 'El número es obligatorio'
			: '',
		repNacimiento: touched.repNacimiento
			? repNacimiento && isAdult(repNacimiento)
				? ''
				: 'Debe ser mayor de 18 años'
			: ''
	};

	$: hasErrors = Object.values(errors).some(Boolean);

	function handleSubmit(event: Event) {
		event.preventDefault();
		// Marca todos los campos como "touched"
		for (const key in errors) touched[key] = true;
		if (hasErrors) return;
		sending = true;
		setTimeout(() => {
			sending = false;
		}, 1200);
	}
</script>

<form
	on:submit={handleSubmit}
	class="
		mx-auto
		flex
		w-full
		max-w-[1100px]
		flex-col
		gap-8
		rounded-3xl border
		border-blue-50 bg-white
		px-8 py-10
		shadow-xl md:gap-10 md:px-16
		md:py-14
	"
>
	<div class="mb-2 flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
		<h2 class="text-3xl font-bold tracking-tight text-blue-900 drop-shadow-sm md:text-4xl">
			Registro de Institución
		</h2>
	</div>

	<div class="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6">
		<!-- Nombre -->
		<div>
			<label for="nombre" class="font-medium text-[rgb(15,16,41)]"
				>Nombre de la institución <span class="text-red-600">*</span></label
			>
			<Input
				id="nombre"
				name="nombre"
				bind:value={nombre}
				customClass="mt-1 w-full rounded-xl border border-gray-200 bg-blue-50 px-4 py-2 text-lg text-black placeholder-gray-400 shadow-sm transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-300"
				placeholder="Ej: Fundación Sembrar"
				on:blur={() => setTouched('nombre')}
				on:input={() => onInput('nombre')}
				error={errors.nombre}
			/>
			{#if errors.nombre}
				<div class="mt-1 text-xs text-red-600">{errors.nombre}</div>
			{/if}
		</div>
		<!-- Tipo de institución -->
		<div>
			<label for="tipo" class="font-medium text-[rgb(15,16,41)]"
				>Tipo de institución <span class="text-red-600">*</span></label
			>
			<select
				id="tipo"
				name="tipo"
				bind:value={tipo}
				on:blur={() => setTouched('tipo')}
				class="mt-1 w-full rounded-xl border border-gray-200 bg-blue-50 px-4 py-2 text-lg text-black transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-300"
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
		<!-- Otro tipo -->
		{#if tipo === 'Otro'}
			<div>
				<label for="otroTipo" class="font-medium text-[rgb(15,16,41)]"
					>Especifique <span class="text-red-600">*</span></label
				>
				<Input
					id="otroTipo"
					name="otroTipo"
					bind:value={otroTipo}
					customClass="mt-1 w-full rounded-xl border border-gray-200 bg-blue-50 px-4 py-2 text-lg text-black transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-300"
					placeholder="Tipo de institución"
					on:blur={() => setTouched('otroTipo')}
					on:input={() => onInput('otroTipo')}
					error={errors.otroTipo}
				/>
				{#if errors.otroTipo}
					<div class="mt-1 text-xs text-red-600">{errors.otroTipo}</div>
				{/if}
			</div>
		{/if}
		<!-- Username -->
		<div>
			<label for="username" class="font-medium text-[rgb(15,16,41)]"
				>Nombre de usuario <span class="text-red-600">*</span></label
			>
			<Input
				id="username"
				name="username"
				bind:value={username}
				customClass="mt-1 w-full rounded-xl border border-gray-200 bg-blue-50 px-4 py-2 text-lg text-black placeholder-gray-400 shadow-sm transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-300"
				placeholder="Ej: fundacion123"
				on:blur={() => setTouched('username')}
				on:input={() => onInput('username')}
				error={errors.username}
			/>
			{#if errors.username}
				<div class="mt-1 text-xs text-red-600">{errors.username}</div>
			{/if}
		</div>
		<!-- Email -->
		<div>
			<label for="email" class="font-medium text-[rgb(15,16,41)]"
				>Email <span class="text-red-600">*</span></label
			>
			<Input
				id="email"
				name="email"
				type="email"
				bind:value={email}
				customClass="mt-1 w-full rounded-xl border border-gray-200 bg-blue-50 px-4 py-2 text-lg text-black placeholder-gray-400 shadow-sm transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-300"
				placeholder="institucion@email.com"
				on:blur={() => setTouched('email')}
				on:input={() => onInput('email')}
				error={errors.email}
			/>
			{#if errors.email}
				<div class="mt-1 text-xs text-red-600">{errors.email}</div>
			{/if}
		</div>
		<!-- CUIT -->
		<div>
			<label for="cuit" class="font-medium text-[rgb(15,16,41)]"
				>CUIT <span class="text-red-600">*</span></label
			>
			<Input
				id="cuit"
				name="cuit"
				bind:value={cuit}
				customClass="mt-1 w-full rounded-xl border border-gray-200 bg-blue-50 px-4 py-2 text-lg text-black transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-300"
				placeholder="Ej: 30-12345678-9"
				on:blur={() => setTouched('cuit')}
				on:input={() => onInput('cuit')}
				error={errors.cuit}
			/>
			{#if errors.cuit}
				<div class="mt-1 text-xs text-red-600">{errors.cuit}</div>
			{/if}
		</div>
		<!-- Contraseña -->
		<div>
			<label for="password" class="font-medium text-[rgb(15,16,41)]"
				>Contraseña <span class="text-red-600">*</span></label
			>
			<Input
				id="password"
				name="password"
				type="password"
				bind:value={password}
				customClass="mt-1 w-full rounded-xl border border-gray-200 bg-blue-50 px-4 py-2 text-lg text-black transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-300"
				placeholder="********"
				on:blur={() => setTouched('password')}
				on:input={() => onInput('password')}
				error={errors.password}
			/>
			{#if errors.password}
				<div class="mt-1 text-xs text-red-600">{errors.password}</div>
			{/if}
		</div>
		<!-- Confirmar contraseña -->
		<div>
			<label for="repassword" class="font-medium text-[rgb(15,16,41)]"
				>Confirmar contraseña <span class="text-red-600">*</span></label
			>
			<Input
				id="repassword"
				name="repassword"
				type="password"
				bind:value={repassword}
				customClass="mt-1 w-full rounded-xl border border-gray-200 bg-blue-50 px-4 py-2 text-lg text-black transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-300"
				placeholder="********"
				on:blur={() => setTouched('repassword')}
				on:input={() => onInput('repassword')}
				error={errors.repassword}
			/>
			{#if errors.repassword}
				<div class="mt-1 text-xs text-red-600">{errors.repassword}</div>
			{/if}
		</div>
	</div>

	<!-- REPRESENTANTE LEGAL AL FINAL -->
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
				><circle cx="12" cy="7" r="4" /><path d="M5.5 21v-2a6.5 6.5 0 0113 0v2" /></svg
			>
			Datos del representante legal
		</legend>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div>
				<label for="repNombre" class="font-medium text-[rgb(15,16,41)]"
					>Nombre <span class="text-red-600">*</span></label
				>
				<Input
					id="repNombre"
					name="repNombre"
					bind:value={repNombre}
					customClass="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-lg text-black transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
					placeholder="Nombre del representante"
					on:blur={() => setTouched('repNombre')}
					on:input={() => onInput('repNombre')}
					error={errors.repNombre}
				/>
				{#if errors.repNombre}
					<div class="mt-1 text-xs text-red-600">{errors.repNombre}</div>
				{/if}
			</div>
			<div>
				<label for="repApellido" class="font-medium text-[rgb(15,16,41)]"
					>Apellido <span class="text-red-600">*</span></label
				>
				<Input
					id="repApellido"
					name="repApellido"
					bind:value={repApellido}
					customClass="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-lg text-black transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
					placeholder="Apellido del representante"
					on:blur={() => setTouched('repApellido')}
					on:input={() => onInput('repApellido')}
					error={errors.repApellido}
				/>
				{#if errors.repApellido}
					<div class="mt-1 text-xs text-red-600">{errors.repApellido}</div>
				{/if}
			</div>
			<div>
				<label for="repDocTipo" class="font-medium text-[rgb(15,16,41)]"
					>Tipo de documento <span class="text-red-600">*</span></label
				>
				<select
					id="repDocTipo"
					name="repDocTipo"
					bind:value={repDocTipo}
					on:blur={() => setTouched('repDocTipo')}
					class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-lg text-black transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
				>
					<option>DNI</option>
					<option>Pasaporte</option>
					<option>Otro</option>
				</select>
			</div>
			{#if repDocTipo === 'Otro'}
				<div>
					<label for="repDocOtro" class="font-medium text-[rgb(15,16,41)]"
						>Especifique <span class="text-red-600">*</span></label
					>
					<Input
						id="repDocOtro"
						name="repDocOtro"
						bind:value={repDocOtro}
						customClass="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-lg text-black transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
						placeholder="Tipo de documento"
						on:blur={() => setTouched('repDocOtro')}
						on:input={() => onInput('repDocOtro')}
						error={errors.repDocOtro}
					/>
					{#if errors.repDocOtro}
						<div class="mt-1 text-xs text-red-600">{errors.repDocOtro}</div>
					{/if}
				</div>
			{/if}
			<div>
				<label for="repDocNumero" class="font-medium text-[rgb(15,16,41)]"
					>Número de documento <span class="text-red-600">*</span></label
				>
				<Input
					id="repDocNumero"
					name="repDocNumero"
					bind:value={repDocNumero}
					customClass="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-lg text-black transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
					placeholder="Ej: 12345678"
					on:blur={() => setTouched('repDocNumero')}
					on:input={() => onInput('repDocNumero')}
					error={errors.repDocNumero}
				/>
				{#if errors.repDocNumero}
					<div class="mt-1 text-xs text-red-600">{errors.repDocNumero}</div>
				{/if}
			</div>
			<div>
				<label for="repNacimiento" class="font-medium text-[rgb(15,16,41)]"
					>Fecha de nacimiento <span class="text-red-600">*</span></label
				>
				<DatePicker
					id="repNacimiento"
					name="repNacimiento"
					bind:value={repNacimiento}
					on:blur={() => setTouched('repNacimiento')}
					on:input={() => onInput('repNacimiento')}
					error={errors.repNacimiento}
				/>
				{#if errors.repNacimiento}
					<div class="mt-1 text-xs text-red-600">{errors.repNacimiento}</div>
				{/if}
			</div>
		</div>
	</div>
	<!-- Botón -->
	<div class="flex justify-end pt-6">
		<Button
			label={sending ? 'Enviando...' : 'Continuar'}
			disabled={sending || hasErrors}
			customClass="px-8 py-3 rounded-xl  shadow-lg w-full md:w-auto"
		/>
	</div>
</form>
