<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import DatePicker from '$lib/components/ui/elementos/DatePicker.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import FotoPerfilUploader from '$lib/components/registro/FotoPerfilUploader.svelte';
	import { createEventDispatcher } from 'svelte';
	import {
		validarUsername,
		validarNombre,
		validarApellido,
		validarCorreo,
		validarContrasena,
		esAdulto,
		validarUrl,
		MENSAJES_ERROR
	} from '$lib/utils/validaciones';
	import type { Usuario, Institucion as InstitucionTipo } from '$lib/types/Usuario';
	import type { Contacto } from '$lib/types/Contacto';
	import { enfocarPrimerCampoConError } from '$lib/utils/forms';

	const dispatch = createEventDispatcher();

	type InstitucionFormData = Pick<
		Usuario,
		'username' | 'nombre' | 'apellido' | 'fecha_nacimiento' | 'url_foto'
	> & {
		password: string;
		passwordConfirm: string;
		contactos: Contacto[];
	} & Pick<InstitucionTipo, 'nombre_legal' | 'tipo_institucion'>;

	const crearContactoPrincipal = (): Contacto => ({
		tipo_contacto: 'email',
		etiqueta: 'principal',
		valor: ''
	});

	const crearInstitucionInicial = (): InstitucionFormData => ({
		username: '',
		password: '',
		passwordConfirm: '',
		nombre: '',
		apellido: '',
		fecha_nacimiento: undefined,
		url_foto: '',
		contactos: [crearContactoPrincipal()],
		nombre_legal: '',
		tipo_institucion: 'escuela'
	});

	let enviando = false;
	let intentoEnvio = false;
	let archivoFoto: File | null = null;

	let institucion: InstitucionFormData = crearInstitucionInicial();
	let contactoPrincipal: Contacto = institucion.contactos[0];

	let fechaNacimiento: Date | null = null;
	const opcionesTipoInstitucion: Array<{ value: string; label: string }> = [
		{ value: 'escuela', label: 'Escuela' },
		{ value: 'hospital', label: 'Hospital' },
		{ value: 'comedor', label: 'Comedor comunitario' },
		{ value: 'fundacion', label: 'Fundación' },
		{ value: 'iglesia', label: 'Iglesia' },
		{ value: 'otro', label: 'Otro' }
	];
	let opcionTipoInstitucion: (typeof opcionesTipoInstitucion)[number]['value'] = 'escuela';
	let tipoInstitucionPersonalizado = '';

	function resetFormulario() {
		institucion = crearInstitucionInicial();
		contactoPrincipal = institucion.contactos[0];
		fechaNacimiento = null;
		opcionTipoInstitucion = 'escuela';
		tipoInstitucionPersonalizado = '';
		archivoFoto = null;
		enviando = false;
		intentoEnvio = false;
	}

	function handleReset(event: Event) {
		event.preventDefault();
		resetFormulario();
	}

	$: institucion.fecha_nacimiento = fechaNacimiento ?? undefined;
	$: institucion.tipo_institucion =
		opcionTipoInstitucion === 'otro' ? tipoInstitucionPersonalizado.trim() : opcionTipoInstitucion;

	$: if (contactoPrincipal) {
		contactoPrincipal.tipo_contacto = 'email';
		contactoPrincipal.etiqueta = 'principal';
	}

	$: errores = {
		username: !institucion.username.trim()
			? MENSAJES_ERROR.obligatorio
			: !validarUsername(institucion.username)
				? MENSAJES_ERROR.usuarioInvalido
				: '',
		email: !contactoPrincipal.valor.trim()
			? MENSAJES_ERROR.obligatorio
			: !validarCorreo(contactoPrincipal.valor.trim())
				? MENSAJES_ERROR.correoInvalido
				: '',
		password: !institucion.password
			? MENSAJES_ERROR.obligatorio
			: !validarContrasena(institucion.password)
				? MENSAJES_ERROR.requisitosContrasena
				: '',
		passwordConfirm: !institucion.passwordConfirm
			? MENSAJES_ERROR.obligatorio
			: institucion.passwordConfirm !== institucion.password
				? MENSAJES_ERROR.contrasenasNoCoinciden
				: '',
		nombre: !institucion.nombre.trim()
			? MENSAJES_ERROR.obligatorio
			: !validarNombre(institucion.nombre)
				? MENSAJES_ERROR.nombreInvalido
				: '',
		apellido: !institucion.apellido.trim()
			? MENSAJES_ERROR.obligatorio
			: !validarApellido(institucion.apellido)
				? MENSAJES_ERROR.apellidoInvalido
				: '',
		fecha_nacimiento:
			fechaNacimiento && esAdulto(fechaNacimiento) ? '' : MENSAJES_ERROR.requisitoEdad,
		url_foto: archivoFoto
			? ''
			: institucion.url_foto.trim()
				? validarUrl(institucion.url_foto.trim())
					? ''
					: MENSAJES_ERROR.urlInvalida
				: '',
		nombre_legal: !institucion.nombre_legal.trim() ? MENSAJES_ERROR.obligatorio : '',
		tipo_institucion:
			opcionTipoInstitucion === 'otro'
				? tipoInstitucionPersonalizado.trim()
					? ''
					: MENSAJES_ERROR.tipoInstitucionObligatorio
				: ''
	};

	$: tieneErrores = Object.values(errores).some((error) => error !== '');

	function handleSubmit(event: Event) {
		event.preventDefault();
		intentoEnvio = true;
		if (tieneErrores) {
			enfocarPrimerCampoConError();
			return;
		}

		enviando = true;
		setTimeout(() => {
			enviando = false;
			dispatch('submit', { institucion, archivoFoto });
		}, 800);
	}
</script>

<form
	on:submit={handleSubmit}
	on:reset={handleReset}
	class="mx-auto max-w-4xl space-y-10"
	novalidate
>
	<header class="space-y-3 text-center">
		<h2 class="text-3xl font-extrabold tracking-tight text-[rgb(var(--base-color))]">
			Registro de institución
		</h2>
		<p class="mx-auto max-w-2xl text-base text-gray-600">
			Ingresá los datos del representante legal y la información básica de la institución para
			continuar.
		</p>
	</header>

	<section class="grid grid-cols-1 gap-8 md:grid-cols-2">
		<div>
			<label for="username" class="font-semibold text-gray-800">
				Nombre de usuario <span class="text-red-600">*</span>
			</label>
			<Input
				id="username"
				name="username"
				bind:value={institucion.username}
				placeholder="ej: escuela-esperanza"
				autocomplete="username"
				error={intentoEnvio ? errores.username : ''}
			/>
		</div>

		<div>
			<label for="email" class="font-semibold text-gray-800">
				Correo electrónico <span class="text-red-600">*</span>
			</label>
			<Input
				id="email"
				name="email"
				type="email"
				bind:value={contactoPrincipal.valor}
				placeholder="ej: contacto@institucion.org"
				autocomplete="email"
				error={intentoEnvio ? errores.email : ''}
			/>
		</div>

		<div>
			<label for="password" class="font-semibold text-gray-800">
				Contraseña <span class="text-red-600">*</span>
			</label>
			<Input
				id="password"
				name="password"
				type="password"
				bind:value={institucion.password}
				placeholder="Ingresá una contraseña segura"
				autocomplete="new-password"
				error={intentoEnvio ? errores.password : ''}
			/>
		</div>

		<div>
			<label for="passwordConfirm" class="font-semibold text-gray-800">
				Confirmá la contraseña <span class="text-red-600">*</span>
			</label>
			<Input
				id="passwordConfirm"
				name="passwordConfirm"
				type="password"
				bind:value={institucion.passwordConfirm}
				placeholder="Repetí la contraseña"
				autocomplete="new-password"
				error={intentoEnvio ? errores.passwordConfirm : ''}
			/>
		</div>
	</section>

	<section class="grid grid-cols-1 gap-8 md:grid-cols-2">
		<div class="md:col-span-2">
			<div>
				<FotoPerfilUploader
					id="url_foto"
					name="url_foto"
					bind:url={institucion.url_foto}
					bind:file={archivoFoto}
					error={intentoEnvio ? errores.url_foto : ''}
				/>
			</div>

			<div>
				<label for="nombre" class="font-semibold text-gray-800">
					Nombre del representante legal <span class="text-red-600">*</span>
				</label>
				<Input
					id="nombre"
					name="nombre"
					bind:value={institucion.nombre}
					placeholder="Nombre"
					error={intentoEnvio ? errores.nombre : ''}
				/>
			</div>

			<div>
				<label for="apellido" class="font-semibold text-gray-800">
					Apellido del representante legal <span class="text-red-600">*</span>
				</label>
				<Input
					id="apellido"
					name="apellido"
					bind:value={institucion.apellido}
					placeholder="Apellido"
					error={intentoEnvio ? errores.apellido : ''}
				/>
			</div>

			<div>
				<label for="fecha_nacimiento" class="font-semibold text-gray-800">
					Fecha de nacimiento del representante legal <span class="text-red-600">*</span>
				</label>
				<DatePicker
					id="fecha_nacimiento"
					name="fecha_nacimiento"
					bind:value={fechaNacimiento}
					error={intentoEnvio ? errores.fecha_nacimiento : ''}
				/>
			</div>

			<div>
				<label for="nombre_legal" class="font-semibold text-gray-800">
					Nombre legal de la institución <span class="text-red-600">*</span>
				</label>
				<Input
					id="nombre_legal"
					name="nombre_legal"
					bind:value={institucion.nombre_legal}
					placeholder="Razón social registrada"
					error={intentoEnvio ? errores.nombre_legal : ''}
				/>
			</div>
		</div>
	</section>

	<section class="space-y-4">
		<span class="font-semibold text-gray-800">
			Tipo de institución <span class="text-red-600">*</span>
		</span>
		<div class="grid gap-4 md:grid-cols-3">
			{#each opcionesTipoInstitucion as opcion}
				{#key opcion.value}
					<div class="relative">
						<input
							id={`tipo-institucion-${opcion.value}`}
							type="radio"
							class="peer sr-only"
							name="tipo_institucion"
							value={opcion.value}
							bind:group={opcionTipoInstitucion}
						/>
						<label
							for={`tipo-institucion-${opcion.value}`}
							class="flex h-full cursor-pointer flex-col gap-1 rounded-xl border border-gray-200 bg-white p-4 text-base font-semibold text-gray-900 shadow-sm transition hover:border-[rgb(var(--color-primary))] hover:shadow-md peer-checked:border-[rgb(var(--color-primary))] peer-checked:bg-[rgba(var(--color-primary),0.12)] peer-checked:shadow-md peer-focus-visible:outline peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[rgb(var(--color-primary))]"
						>
							{opcion.label}
						</label>
					</div>
				{/key}
			{/each}
		</div>

		{#if opcionTipoInstitucion === 'otro'}
			<div>
				<label for="tipo_institucion_personalizado" class="font-semibold text-gray-800">
					Especificá el tipo de institución <span class="text-red-600">*</span>
				</label>
				<Input
					id="tipo_institucion_personalizado"
					name="tipo_institucion_personalizado"
					bind:value={tipoInstitucionPersonalizado}
					placeholder="Ej: Centro comunitario"
					error={intentoEnvio ? errores.tipo_institucion : ''}
				/>
			</div>
		{/if}
	</section>

	<div class="mt-10 flex justify-end">
		<Button
			label={enviando ? 'Enviando...' : 'Continuar'}
			disabled={enviando}
			ariaDisabled={tieneErrores}
			customAriaLabel={tieneErrores
				? 'Corregí los campos con error antes de continuar'
				: 'Continuar con el registro de la institución'}
			customClass="w-full rounded-xl bg-[rgb(var(--base-color))] px-8 py-3 font-semibold text-white shadow-md transition hover:shadow-xl disabled:opacity-60 md:w-auto"
		/>
	</div>
</form>
