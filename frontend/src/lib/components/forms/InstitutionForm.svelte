<script lang="ts">
	import Input from '../ui/Input.svelte';
	import DatePicker from '../ui/DatePicker.svelte';
	import Button from '../ui/Button.svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import {
		isValidEmail,
		isValidPassword,
		isValidUsername,
		isValidCuit,
		isAdult,
		isValidName,
		isValidLastName,
		isValidDni,
		ERROR_MESSAGES
	} from '$lib/utils/validators';

	// Estados iniciales
	let sending = false;
	let showPassword = false;
	let showRepassword = false;

	let institution = {
		nombre: '',
		tipo: 'Escuela',
		otroTipo: '',
		username: '',
		email: '',
		cuit: '',
		password: '',
		repassword: ''
	};

	let representative = {
		repNombre: '',
		repApellido: '',
		repDocTipo: 'DNI',
		repDocOtro: '',
		repDocNumero: '',
		repNacimiento: ''
	};

	// Validación reactiva de errores
	$: errors = {
		nombre: institution.nombre.trim()
			? isValidName(institution.nombre)
				? ''
				: ERROR_MESSAGES.nameInvalid
			: ERROR_MESSAGES.required,

		otroTipo:
			institution.tipo === 'Otro' && institution.otroTipo.trim() === ''
				? ERROR_MESSAGES.specifyInstitutionType
				: '',

		username: !institution.username.trim()
			? ERROR_MESSAGES.required
			: !isValidUsername(institution.username)
				? ERROR_MESSAGES.usernameInvalid
				: '',

		email: !institution.email.trim()
			? ERROR_MESSAGES.required
			: !isValidEmail(institution.email)
				? ERROR_MESSAGES.emailInvalid
				: '',

		cuit:
			institution.cuit.trim() && isValidCuit(institution.cuit) ? '' : ERROR_MESSAGES.cuitInvalid,

		password:
			institution.password.length < 8
				? ERROR_MESSAGES.passwordRequirements
				: !isValidPassword(institution.password)
					? ERROR_MESSAGES.passwordRequirements
					: '',

		repassword:
			institution.repassword !== institution.password ? ERROR_MESSAGES.passwordMismatch : '',

		repNombre: !representative.repNombre.trim()
			? ERROR_MESSAGES.required
			: !isValidName(representative.repNombre)
				? ERROR_MESSAGES.nameInvalid
				: '',

		repApellido: !representative.repApellido.trim()
			? ERROR_MESSAGES.required
			: !isValidLastName(representative.repApellido)
				? ERROR_MESSAGES.lastNameInvalid
				: '',

		repDocOtro:
			representative.repDocTipo === 'Otro' && representative.repDocOtro.trim() === ''
				? ERROR_MESSAGES.specifyDocument
				: '',

		repDocNumero: !representative.repDocNumero.trim()
			? ERROR_MESSAGES.required
			: representative.repDocTipo === 'DNI' && !isValidDni(representative.repDocNumero)
				? ERROR_MESSAGES.dniInvalid
				: '',

		repNacimiento:
			representative.repNacimiento && isAdult(representative.repNacimiento)
				? ''
				: ERROR_MESSAGES.ageRequirement
	};

	$: hasErrors = Object.values(errors).some((error) => error !== '');

	function handleSubmit(event: Event) {
		event.preventDefault();
		if (hasErrors) return;
		sending = true;

		setTimeout(() => {
			sending = false;
			dispatch('submit');
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
				bind:value={institution.nombre}
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
				bind:value={institution.tipo}
				class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-base text-black transition focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
			>
				<option value="">Selecciona tipo</option>
				<option>Escuela</option>
				<option>Hospital</option>
				<option>Comedor</option>
				<option>Fundación</option>
				<option>Asociación</option>
				<option>Parroquia</option>
				<option>Otro</option>
			</select>
		</div>

		{#if institution.tipo === 'Otro'}
			<div>
				<label for="otroTipo" class="font-semibold text-gray-800">
					Especificar tipo <span class="text-red-600">*</span>
				</label>
				<Input
					id="otroTipo"
					name="otroTipo"
					bind:value={institution.otroTipo}
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
				bind:value={institution.username}
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
				bind:value={institution.email}
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
				bind:value={institution.cuit}
				customClass="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-base text-black transition focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
				placeholder="Ej: 30-12345678-9"
				error={errors.cuit}
			/>
		</div>

		<!-- Contraseña -->
		<div class="relative">
			<label for="password" class="font-semibold text-gray-800">
				Contraseña <span class="text-red-600">*</span>
			</label>
			<Input
				id="password"
				name="password"
				type={showPassword ? 'text' : 'password'}
				bind:value={institution.password}
				customClass="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-base text-black placeholder-gray-400 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
				placeholder="********"
				error={errors.password}
			/>
			<button
				type="button"
				class="absolute right-3 top-9 flex h-6 w-6 items-center justify-center focus:outline-none"
				aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
				on:click={() => (showPassword = !showPassword)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke={showPassword ? '#007fff' : 'currentColor'}
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="h-5 w-5"
				>
					<circle cx="12" cy="12" r="3" />
					<path d="M2 12s2.5-5 10-5 10 5 10 5-2.5 5-10 5S2 12 2 12z" />
				</svg>
			</button>
		</div>

		<!-- Confirmar contraseña -->
		<div class="relative">
			<label for="repassword" class="font-semibold text-gray-800">
				Repetir contraseña <span class="text-red-600">*</span>
			</label>
			<Input
				id="repassword"
				name="repassword"
				type={showRepassword ? 'text' : 'password'}
				bind:value={institution.repassword}
				customClass="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-base text-black placeholder-gray-400 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
				placeholder="********"
				error={errors.repassword}
			/>
			<button
				type="button"
				class="absolute right-3 top-9 flex h-6 w-6 items-center justify-center focus:outline-none"
				aria-label={showRepassword
					? 'Ocultar repetición de contraseña'
					: 'Mostrar repetición de contraseña'}
				on:click={() => (showRepassword = !showRepassword)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke={showRepassword ? '#007fff' : 'currentColor'}
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="h-5 w-5"
				>
					<circle cx="12" cy="12" r="3" />
					<path d="M2 12s2.5-5 10-5 10 5 10 5-2.5 5-10 5S2 12 2 12z" />
				</svg>
			</button>
		</div>
	</fieldset>

	<!-- DATOS DEL REPRESENTANTE LEGAL -->
	<div
		class="mt-4 flex flex-col gap-6 rounded-2xl border border-blue-100 bg-blue-50/70 px-6 py-7 shadow-sm"
	>
		<legend class="mb-2 flex items-center gap-2 text-base font-semibold text-blue-800">
			<svg
				class="h-5 w-5 text-blue-800"
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
			<!-- Nombre -->
			<div>
				<label for="repNombre" class="font-medium text-[rgb(15,16,41)]">
					Nombre <span class="text-red-600">*</span>
				</label>
				<Input
					id="repNombre"
					name="repNombre"
					bind:value={representative.repNombre}
					customClass="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-lg text-black transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
					placeholder="Nombre del representante"
					error={errors.repNombre}
				/>
			</div>

			<!-- Apellido -->
			<div>
				<label for="repApellido" class="font-medium text-[rgb(15,16,41)]">
					Apellido <span class="text-red-600">*</span>
				</label>
				<Input
					id="repApellido"
					name="repApellido"
					bind:value={representative.repApellido}
					customClass="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-lg text-black transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
					placeholder="Apellido del representante"
					error={errors.repApellido}
				/>
			</div>

			<!-- Tipo de documento -->
			<div>
				<label for="repDocTipo" class="font-medium text-[rgb(15,16,41)]">
					Tipo de documento <span class="text-red-600">*</span>
				</label>
				<select
					id="repDocTipo"
					name="repDocTipo"
					bind:value={representative.repDocTipo}
					class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-lg text-black transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
				>
					<option>DNI</option>
					<option>Pasaporte</option>
					<option>Otro</option>
				</select>
			</div>

			{#if representative.repDocTipo === 'Otro'}
				<div>
					<label for="repDocOtro" class="font-medium text-[rgb(15,16,41)]">
						Especifique <span class="text-red-600">*</span>
					</label>
					<Input
						id="repDocOtro"
						name="repDocOtro"
						bind:value={representative.repDocOtro}
						customClass="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-lg text-black transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
						placeholder="Tipo de documento"
						error={errors.repDocOtro}
					/>
				</div>
			{/if}

			<!-- Número de documento -->
			<div>
				<label for="repDocNumero" class="font-medium text-[rgb(15,16,41)]">
					Número de documento <span class="text-red-600">*</span>
				</label>
				<Input
					id="repDocNumero"
					name="repDocNumero"
					bind:value={representative.repDocNumero}
					customClass="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-lg text-black transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
					placeholder="Ej: 12345678"
					error={errors.repDocNumero}
				/>
			</div>

			<!-- Fecha de nacimiento -->
			<div>
				<label for="repNacimiento" class="font-medium text-[rgb(15,16,41)]">
					Fecha de nacimiento <span class="text-red-600">*</span>
				</label>
				<DatePicker
					id="repNacimiento"
					name="repNacimiento"
					bind:value={representative.repNacimiento}
					error={errors.repNacimiento}
				/>
			</div>
		</div>
	</div>

	<!-- Botón de envío -->
	<div class="mt-10 flex justify-end">
		<Button
			type="submit"
			label={sending ? 'Enviando...' : 'Continuar'}
			disabled={sending || hasErrors}
			customClass="w-full md:w-auto rounded-xl bg-[rgb(var(--base-color))] text-white font-semibold px-8 py-3 shadow-md hover:shadow-xl transition-all duration-300 disabled:opacity-60"
		/>
	</div>
</form>
