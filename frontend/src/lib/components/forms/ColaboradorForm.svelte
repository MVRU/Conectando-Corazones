<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import DatePicker from '$lib/components/ui/elements/DatePicker.svelte';
	import Button from '$lib/components/ui/elements/Button.svelte';
	import Select from '$lib/components/ui/elements/Select.svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import {
		isValidEmail,
		isValidPassword,
		isValidName,
		isValidLastName,
		isValidDni,
		isAdult,
		isValidUsername,
		isValidCuit,
		ERROR_MESSAGES
	} from '$lib/utils/validators';

	let sending = false;
	let tipo: 'persona' | 'organizacion' = 'persona';
	let showPassword = false;
	let showRepassword = false;
	let intentoEnvio = false;

	// Datos persona
	let nombre = '';
	let apellido = '';
	let docTipo = 'DNI';
	let docOtro = '';
	let docNumero = '';
	let nacimiento: Date | null = null;
	let cuil = '';

	// Datos organización
	let razonSocial = '';
	let cuit = '';
	let repNombre = '';
	let repApellido = '';
	let repDocTipo = 'DNI';
	let repDocOtro = '';
	let repDocNumero = '';
	let repNacimiento: Date | null = null;

	// Usuario y contraseña
	let username = '';
	let email = '';
	let password = '';
	let repassword = '';

	$: errors = {
		// Persona
		nombre:
			tipo === 'persona' && !nombre.trim()
				? ERROR_MESSAGES.required
				: tipo === 'persona' && !isValidName(nombre)
					? ERROR_MESSAGES.nameInvalid
					: '',

		apellido:
			tipo === 'persona' && !apellido.trim()
				? ERROR_MESSAGES.required
				: tipo === 'persona' && !isValidLastName(apellido)
					? ERROR_MESSAGES.lastNameInvalid
					: '',

		docOtro:
			tipo === 'persona' && docTipo === 'Otro' && !docOtro.trim()
				? ERROR_MESSAGES.specifyDocument
				: '',

		docNumero:
			tipo === 'persona' && !docNumero.trim()
				? ERROR_MESSAGES.required
				: tipo === 'persona' && docTipo === 'DNI' && !isValidDni(docNumero)
					? ERROR_MESSAGES.dniInvalid
					: '',

		nacimiento:
			tipo === 'persona' && nacimiento && isAdult(nacimiento)
				? ''
				: tipo === 'persona'
					? ERROR_MESSAGES.ageRequirement
					: '',

		cuil: tipo === 'persona' && !cuil.trim() ? ERROR_MESSAGES.required : '',

		// Organización
		razonSocial: tipo === 'organizacion' && !razonSocial.trim() ? ERROR_MESSAGES.required : '',

		cuit:
			tipo === 'organizacion' && !cuit.trim()
				? ERROR_MESSAGES.required
				: tipo === 'organizacion' && !isValidCuit(cuit)
					? ERROR_MESSAGES.cuitInvalid
					: '',

		repNombre:
			tipo === 'organizacion' && !repNombre.trim()
				? ERROR_MESSAGES.required
				: tipo === 'organizacion' && !isValidName(repNombre)
					? ERROR_MESSAGES.nameInvalid
					: '',

		repApellido:
			tipo === 'organizacion' && !repApellido.trim()
				? ERROR_MESSAGES.required
				: tipo === 'organizacion' && !isValidLastName(repApellido)
					? ERROR_MESSAGES.lastNameInvalid
					: '',

		repDocOtro:
			tipo === 'organizacion' && repDocTipo === 'Otro' && !repDocOtro.trim()
				? ERROR_MESSAGES.specifyDocument
				: '',

		repDocNumero:
			tipo === 'organizacion' && !repDocNumero.trim()
				? ERROR_MESSAGES.required
				: tipo === 'organizacion' && repDocTipo === 'DNI' && !isValidDni(repDocNumero)
					? ERROR_MESSAGES.dniInvalid
					: '',

		repNacimiento:
			tipo === 'organizacion' && repNacimiento && isAdult(repNacimiento)
				? ''
				: tipo === 'organizacion'
					? ERROR_MESSAGES.ageRequirement
					: '',

		// Credenciales
		username: !username.trim()
			? ERROR_MESSAGES.required
			: !isValidUsername(username)
				? ERROR_MESSAGES.usernameInvalid
				: '',

		email: !email.trim()
			? ERROR_MESSAGES.required
			: !isValidEmail(email)
				? ERROR_MESSAGES.emailInvalid
				: '',

		password:
			password.length < 8
				? ERROR_MESSAGES.passwordRequirements
				: !isValidPassword(password)
					? ERROR_MESSAGES.passwordRequirements
					: '',

		repassword: repassword !== password ? ERROR_MESSAGES.passwordMismatch : ''
	};

	$: hasErrors = Object.values(errors).some((error) => error !== '');

	function handleSubmit(event: Event) {
		event.preventDefault();
		intentoEnvio = true;
		if (hasErrors) {
			setTimeout(() => {
				const firstError = document.querySelector('.border-red-400, .ring-red-400');
				if (firstError && typeof firstError.scrollIntoView === 'function') {
					firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
					(firstError as HTMLElement).focus?.();
				}
			}, 50);
			return;
		}
		sending = true;

		setTimeout(() => {
			sending = false;
			dispatch('submit');
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
		<Select
			id="tipo"
			bind:value={tipo}
			required={true}
			error={intentoEnvio && !tipo ? ERROR_MESSAGES.required : ''}
			options={[
				{ value: 'persona', label: 'Persona' },
				{ value: 'organizacion', label: 'Organización' }
			]}
		/>
	</div>

	<!-- Datos persona -->
	{#if tipo === 'persona'}
		<fieldset class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<!-- Nombre -->
			<div>
				<label for="nombre" class="font-semibold text-gray-800">
					Nombre {#if intentoEnvio}<span class="text-red-600">*</span>{/if}
				</label>
				<Input
					id="nombre"
					bind:value={nombre}
					error={intentoEnvio ? errors.nombre : ''}
					maskCuil={false}
				/>
			</div>

			<!-- Apellido -->
			<div>
				<label for="apellido" class="font-semibold text-gray-800">
					Apellido {#if intentoEnvio}<span class="text-red-600">*</span>{/if}
				</label>
				<Input id="apellido" bind:value={apellido} error={intentoEnvio ? errors.apellido : ''} />
			</div>

			<!-- Tipo de documento -->
			<div>
				<label for="docTipo" class="font-semibold text-gray-800">
					Tipo de documento <span class="text-red-600">*</span>
				</label>
				<Select
					id="docTipo"
					bind:value={docTipo}
					required={true}
					error=""
					options={[
						{ value: 'DNI', label: 'DNI' },
						{ value: 'Pasaporte', label: 'Pasaporte' },
						{ value: 'Otro', label: 'Otro' }
					]}
				/>
			</div>

			<!-- Especificar documento -->
			{#if docTipo === 'Otro'}
				<div>
					<label for="docOtro" class="font-semibold text-gray-800">
						Especifique {#if intentoEnvio}<span class="text-red-600">*</span>{/if}
					</label>
					<Input id="docOtro" bind:value={docOtro} error={intentoEnvio ? errors.docOtro : ''} />
				</div>
			{/if}

			<!-- Número de documento -->
			<div>
				<label for="docNumero" class="font-semibold text-gray-800">
					Número de documento {#if intentoEnvio}<span class="text-red-600">*</span>{/if}
				</label>
				<Input id="docNumero" bind:value={docNumero} error={intentoEnvio ? errors.docNumero : ''} />
			</div>

			<!-- Fecha de nacimiento -->
			<div>
				<label for="nacimiento" class="font-semibold text-gray-800">
					Fecha de nacimiento {#if intentoEnvio}<span class="text-red-600">*</span>{/if}
				</label>
				<DatePicker
					id="nacimiento"
					bind:value={nacimiento}
					error={intentoEnvio ? errors.nacimiento : ''}
				/>
			</div>

			<!-- CUIL -->
			<div>
				<label for="cuil" class="font-semibold text-gray-800">
					CUIL {#if intentoEnvio}<span class="text-red-600">*</span>{/if}
				</label>
				<Input
					id="cuil"
					bind:value={cuil}
					error={intentoEnvio ? errors.cuil : ''}
					maskCuil={true}
				/>
			</div>
		</fieldset>
	{:else}
		<!-- Datos organización -->
		<fieldset class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div class="md:col-span-2">
				<label for="razonSocial" class="font-semibold text-gray-800">
					Razón social {#if intentoEnvio}<span class="text-red-600">*</span>{/if}
				</label>
				<Input
					id="razonSocial"
					bind:value={razonSocial}
					error={intentoEnvio ? errors.razonSocial : ''}
				/>
			</div>

			<div class="md:col-span-2">
				<label for="cuit" class="font-semibold text-gray-800">
					CUIT {#if intentoEnvio}<span class="text-red-600">*</span>{/if}
				</label>
				<Input
					id="cuit"
					bind:value={cuit}
					error={intentoEnvio ? errors.cuit : ''}
					maskCuil={true}
				/>
			</div>
		</fieldset>
	{/if}

	<!-- Usuario y contraseña -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<div>
			<label for="username" class="font-semibold text-gray-800">
				Nombre de usuario {#if intentoEnvio}<span class="text-red-600">*</span>{/if}
			</label>
			<Input id="username" bind:value={username} error={intentoEnvio ? errors.username : ''} />
		</div>

		<div>
			<label for="email" class="font-semibold text-gray-800">
				Email {#if intentoEnvio}<span class="text-red-600">*</span>{/if}
			</label>
			<Input id="email" type="email" bind:value={email} error={intentoEnvio ? errors.email : ''} />
		</div>

		<!-- Contraseña -->
		<div class="relative">
			<label for="password" class="font-semibold text-gray-800">
				Contraseña {#if intentoEnvio}<span class="text-red-600">*</span>{/if}
			</label>
			<Input
				id="password"
				name="password"
				type={showPassword ? 'text' : 'password'}
				bind:value={password}
				customClass="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-base text-black placeholder-gray-400 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
				placeholder="********"
				error={intentoEnvio ? errors.password : ''}
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
				Repetir contraseña {#if intentoEnvio}<span class="text-red-600">*</span>{/if}
			</label>
			<Input
				id="repassword"
				name="repassword"
				type={showRepassword ? 'text' : 'password'}
				bind:value={repassword}
				customClass="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-base text-black placeholder-gray-400 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
				placeholder="********"
				error={intentoEnvio ? errors.repassword : ''}
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
	</div>

	<!-- Datos del representante legal (si es organización) -->
	{#if tipo === 'organizacion'}
		<div
			class="mt-4 flex flex-col gap-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-7 shadow-sm"
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
				<div>
					<label for="repNombre" class="font-semibold text-gray-800">
						Nombre {#if intentoEnvio}<span class="text-red-600">*</span>{/if}
					</label>
					<Input
						id="repNombre"
						bind:value={repNombre}
						error={intentoEnvio ? errors.repNombre : ''}
					/>
				</div>

				<div>
					<label for="repApellido" class="font-semibold text-gray-800">
						Apellido {#if intentoEnvio}<span class="text-red-600">*</span>{/if}
					</label>
					<Input
						id="repApellido"
						bind:value={repApellido}
						error={intentoEnvio ? errors.repApellido : ''}
					/>
				</div>

				<div>
					<label for="repDocTipo" class="font-semibold text-gray-800">
						Tipo de documento <span class="text-red-600">*</span>
					</label>
					<Select
						id="repDocTipo"
						bind:value={repDocTipo}
						required={true}
						error=""
						options={[
							{ value: 'DNI', label: 'DNI' },
							{ value: 'Pasaporte', label: 'Pasaporte' },
							{ value: 'Otro', label: 'Otro' }
						]}
					/>
				</div>

				{#if repDocTipo === 'Otro'}
					<div>
						<label for="repDocOtro" class="font-semibold text-gray-800">
							Especifique {#if intentoEnvio}<span class="text-red-600">*</span>{/if}
						</label>
						<Input
							id="repDocOtro"
							bind:value={repDocOtro}
							error={intentoEnvio ? errors.repDocOtro : ''}
						/>
					</div>
				{/if}

				<div>
					<label for="repDocNumero" class="font-semibold text-gray-800">
						Número de documento {#if intentoEnvio}<span class="text-red-600">*</span>{/if}
					</label>
					<Input
						id="repDocNumero"
						bind:value={repDocNumero}
						error={intentoEnvio ? errors.repDocNumero : ''}
					/>
				</div>

				<div>
					<label for="repNacimiento" class="font-semibold text-gray-800">
						Fecha de nacimiento {#if intentoEnvio}<span class="text-red-600">*</span>{/if}
					</label>
					<DatePicker
						id="repNacimiento"
						name="repNacimiento"
						bind:value={repNacimiento}
						error={intentoEnvio ? errors.repNacimiento : ''}
					/>
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
