<!-- * DECISIÓN DE DISEÑO: se unifica la UI de registro para ambos roles usando un estado discriminado y helpers compartidos, reduciendo duplicación y facilitando nuevas variantes en el futuro -->

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import DatePicker from '$lib/components/ui/elementos/DatePicker.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import Select from '$lib/components/ui/elementos/Select.svelte';
	import FotoPerfilUploader from '$lib/components/registro/FotoPerfilUploader.svelte';
	import CampoFormulario from './CampoFormulario.svelte';
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
	import { enfocarPrimerCampoConError } from '$lib/utils/forms';
	import type {
		RegistroCuentaSubmitDetail,
		ColaboradorFormData,
		OrganizacionFormData,
		InstitucionFormData
	} from '$lib/types/forms/registro';
	import type { RegistroRol } from '$lib/services/auth/registration-flow';
	import {
		crearContactoPrincipal,
		normalizarSeleccionBoolean,
		type TipoColaborador
	} from './form-helpers';

	const dispatch = createEventDispatcher<{
		submit: RegistroCuentaSubmitDetail;
		invalid: { campos: string[] };
		processing: { value: boolean };
	}>();

	export let rol: RegistroRol = 'institucion';
	export let procesando = false;
	export let errorGeneral: string | null = null;

	const opcionesTipoColaborador: Array<{
		value: TipoColaborador;
		label: string;
		descripcion: string;
	}> = [
		{
			value: 'unipersonal',
			label: 'Unipersonal',
			descripcion: 'Sos una persona física que colabora con proyectos solidarios.'
		},
		{
			value: 'organizacion',
			label: 'Organización',
			descripcion: 'Representás a una entidad que coordina recursos o acompañamiento.'
		}
	];

	const opcionesTipoInstitucion: Array<{ value: string; label: string }> = [
		{ value: 'escuela', label: 'Escuela' },
		{ value: 'hospital', label: 'Hospital' },
		{ value: 'comedor', label: 'Comedor comunitario' },
		{ value: 'fundacion', label: 'Fundación' },
		{ value: 'iglesia', label: 'Iglesia' },
		{ value: 'otro', label: 'Otro' }
	];

	interface ErroresFormulario {
		username: string;
		email: string;
		password: string;
		passwordConfirm: string;
		nombre: string;
		apellido: string;
		fecha_nacimiento: string;
		url_foto: string;
		razon_social: string;
		con_fines_de_lucro: string;
		nombre_legal: string;
		tipo_institucion: string;
	}

	const crearErroresIniciales = (): ErroresFormulario => ({
		username: '',
		email: '',
		password: '',
		passwordConfirm: '',
		nombre: '',
		apellido: '',
		fecha_nacimiento: '',
		url_foto: '',
		razon_social: '',
		con_fines_de_lucro: '',
		nombre_legal: '',
		tipo_institucion: ''
	});

	const TIPO_INSTITUCION_POR_DEFECTO = 'escuela';

	let username = '';
	let email = '';
	let password = '';
	let passwordConfirm = '';
	let nombrePersona = '';
	let apellidoPersona = '';
	let fechaNacimiento: Date | null = null;
	let urlFoto = '';
	let razonSocial = '';
	let conFinesDeLucroSeleccion: '' | 'true' | 'false' = '';
	let nombreLegal = '';
	let tipoInstitucionSeleccion = TIPO_INSTITUCION_POR_DEFECTO;
	let tipoInstitucionPersonalizado = '';
	let tipoColaborador: TipoColaborador = 'unipersonal';
	let archivoFoto: File | null = null;
	let intentoEnvio = false;
	let errores: ErroresFormulario = crearErroresIniciales();
	let tieneErrores = false;

	let rolInterno: RegistroRol = rol;

	$: if (rol !== rolInterno) {
		rolInterno = rol;
		resetFormulario();
	}

	let ultimoProcesando: boolean | null = null;
	$: if (ultimoProcesando !== procesando) {
		ultimoProcesando = procesando;
		dispatch('processing', { value: procesando });
	}

	const metadatosRol = {
		institucion: {
			titulo: 'Registro de institución',
			descripcion:
				'Ingresá los datos del representante legal y la información básica de la institución para continuar.'
		},
		colaborador: {
			titulo: 'Registro de colaborador/a',
			descripcion:
				'Elegí si actuás como persona física o representando a una organización y completá tus datos.'
		}
	} satisfies Record<RegistroRol, { titulo: string; descripcion: string }>;

	interface DatosBaseValidacion {
		username: string;
		email: string;
		password: string;
		passwordConfirm: string;
		nombre: string;
		apellido: string;
		fechaNacimiento: Date | null;
		urlFoto: string;
		archivoFoto: File | null;
	}

	interface DatosColaboradorValidacion extends DatosBaseValidacion {
		tipoColaborador: TipoColaborador;
		razonSocial: string;
		conFinesDeLucro: '' | 'true' | 'false';
	}

	interface DatosInstitucionValidacion extends DatosBaseValidacion {
		nombreLegal: string;
		tipoInstitucionSeleccion: string;
		tipoInstitucionPersonalizado: string;
	}

	$: errores =
		rolInterno === 'colaborador'
			? calcularErroresColaborador({
					username,
					email,
					password,
					passwordConfirm,
					nombre: nombrePersona,
					apellido: apellidoPersona,
					fechaNacimiento,
					urlFoto,
					archivoFoto,
					tipoColaborador,
					razonSocial,
					conFinesDeLucro: conFinesDeLucroSeleccion
				})
			: calcularErroresInstitucion({
					username,
					email,
					password,
					passwordConfirm,
					nombre: nombrePersona,
					apellido: apellidoPersona,
					fechaNacimiento,
					urlFoto,
					archivoFoto,
					nombreLegal,
					tipoInstitucionSeleccion,
					tipoInstitucionPersonalizado
				});
	$: tieneErrores = Object.values(errores).some((error) => error);

	function resetFormulario() {
		username = '';
		email = '';
		password = '';
		passwordConfirm = '';
		nombrePersona = '';
		apellidoPersona = '';
		fechaNacimiento = null;
		urlFoto = '';
		razonSocial = '';
		conFinesDeLucroSeleccion = '';
		nombreLegal = '';
		tipoInstitucionSeleccion = TIPO_INSTITUCION_POR_DEFECTO;
		tipoInstitucionPersonalizado = '';
		tipoColaborador = 'unipersonal';
		archivoFoto = null;
		intentoEnvio = false;
		errores = crearErroresIniciales();
	}

	function calcularErroresBase({
		username,
		email,
		password,
		passwordConfirm,
		nombre,
		apellido,
		fechaNacimiento,
		urlFoto,
		archivoFoto
	}: DatosBaseValidacion): Pick<
		ErroresFormulario,
		| 'username'
		| 'email'
		| 'password'
		| 'passwordConfirm'
		| 'nombre'
		| 'apellido'
		| 'fecha_nacimiento'
		| 'url_foto'
	> {
		const emailNormalizado = email.trim();
		const usernameNormalizado = username.trim();
		const nombreNormalizado = nombre.trim();
		const apellidoNormalizado = apellido.trim();
		const urlNormalizada = urlFoto.trim();

		return {
			username: !usernameNormalizado
				? MENSAJES_ERROR.obligatorio
				: !validarUsername(usernameNormalizado)
					? MENSAJES_ERROR.usuarioInvalido
					: '',
			email: !emailNormalizado
				? MENSAJES_ERROR.obligatorio
				: !validarCorreo(emailNormalizado)
					? MENSAJES_ERROR.correoInvalido
					: '',
			password: !password
				? MENSAJES_ERROR.obligatorio
				: !validarContrasena(password)
					? MENSAJES_ERROR.requisitosContrasena
					: '',
			passwordConfirm: !passwordConfirm
				? MENSAJES_ERROR.obligatorio
				: passwordConfirm !== password
					? MENSAJES_ERROR.contrasenasNoCoinciden
					: '',
			nombre: !nombreNormalizado
				? MENSAJES_ERROR.obligatorio
				: !validarNombre(nombreNormalizado)
					? MENSAJES_ERROR.nombreInvalido
					: '',
			apellido: !apellidoNormalizado
				? MENSAJES_ERROR.obligatorio
				: !validarApellido(apellidoNormalizado)
					? MENSAJES_ERROR.apellidoInvalido
					: '',
			fecha_nacimiento:
				fechaNacimiento && esAdulto(fechaNacimiento) ? '' : MENSAJES_ERROR.requisitoEdad,
			url_foto: archivoFoto
				? ''
				: urlNormalizada
					? validarUrl(urlNormalizada)
						? ''
						: MENSAJES_ERROR.urlInvalida
					: ''
		};
	}

	function calcularErroresColaborador(datos: DatosColaboradorValidacion): ErroresFormulario {
		const base = calcularErroresBase(datos);
		const razonSocialNormalizada = datos.razonSocial.trim();
		const conFines = datos.conFinesDeLucro;

		return {
			...crearErroresIniciales(),
			...base,
			razon_social:
				datos.tipoColaborador === 'organizacion' && !razonSocialNormalizada
					? MENSAJES_ERROR.obligatorio
					: '',
			con_fines_de_lucro:
				datos.tipoColaborador === 'organizacion' && conFines === ''
					? MENSAJES_ERROR.obligatorio
					: '',
			nombre_legal: '',
			tipo_institucion: ''
		};
	}

	function calcularErroresInstitucion(datos: DatosInstitucionValidacion): ErroresFormulario {
		const base = calcularErroresBase(datos);
		const nombreLegalNormalizado = datos.nombreLegal.trim();
		const seleccion = datos.tipoInstitucionSeleccion;
		const personalizado = datos.tipoInstitucionPersonalizado.trim();

		return {
			...crearErroresIniciales(),
			...base,
			nombre_legal: !nombreLegalNormalizado ? MENSAJES_ERROR.obligatorio : '',
			tipo_institucion:
				seleccion === 'otro' ? (personalizado ? '' : MENSAJES_ERROR.tipoInstitucionObligatorio) : ''
		};
	}

	function obtenerEtiquetaNombre(): string {
		if (rolInterno === 'institucion') {
			return 'Nombre del representante legal';
		}
		return tipoColaborador === 'organizacion'
			? 'Nombre del representante legal'
			: 'Nombre de la persona';
	}

	function obtenerEtiquetaApellido(): string {
		if (rolInterno === 'institucion') {
			return 'Apellido del representante legal';
		}
		return tipoColaborador === 'organizacion'
			? 'Apellido del representante legal'
			: 'Apellido de la persona';
	}

	function obtenerEtiquetaFecha(): string {
		if (rolInterno === 'institucion') {
			return 'Fecha de nacimiento del representante legal';
		}
		return tipoColaborador === 'organizacion'
			? 'Fecha de nacimiento del representante legal'
			: 'Fecha de nacimiento';
	}

	function manejarSubmit(event: Event) {
		event.preventDefault();
		if (procesando) {
			return;
		}
		intentoEnvio = true;
		if (tieneErrores) {
			enfocarPrimerCampoConError();
			const campos = Object.entries(errores)
				.filter(([, valor]) => valor)
				.map(([campo]) => campo);
			dispatch('invalid', { campos });
			return;
		}

		const emailNormalizado = email.trim().toLowerCase();
		const contacto = crearContactoPrincipal(emailNormalizado);

		if (rolInterno === 'colaborador') {
			const colaborador: ColaboradorFormData = {
				username: username.trim(),
				password,
				passwordConfirm,
				nombre: nombrePersona.trim(),
				apellido: apellidoPersona.trim(),
				fecha_nacimiento: fechaNacimiento ?? undefined,
				url_foto: urlFoto.trim(),
				contactos: [contacto],
				tipo_colaborador: tipoColaborador
			};

			const organizacion: OrganizacionFormData = {
				razon_social: razonSocial.trim(),
				con_fines_de_lucro: normalizarSeleccionBoolean(conFinesDeLucroSeleccion)
			};

			dispatch('submit', {
				rol: 'colaborador',
				payload: {
					colaborador,
					organizacion
				},
				archivoFoto
			});
			return;
		}

		const tipoInstitucion =
			tipoInstitucionSeleccion === 'otro'
				? tipoInstitucionPersonalizado.trim()
				: tipoInstitucionSeleccion;

		const institucion: InstitucionFormData = {
			username: username.trim(),
			password,
			passwordConfirm,
			nombre: nombrePersona.trim(),
			apellido: apellidoPersona.trim(),
			fecha_nacimiento: fechaNacimiento ?? undefined,
			url_foto: urlFoto.trim(),
			contactos: [contacto],
			nombre_legal: nombreLegal.trim(),
			tipo_institucion: tipoInstitucion
		};

		dispatch('submit', {
			rol: 'institucion',
			payload: { institucion },
			archivoFoto
		});
	}

	function alternarTipoColaborador(nuevo: TipoColaborador) {
		tipoColaborador = nuevo;
		intentoEnvio = false;
		if (nuevo === 'unipersonal') {
			razonSocial = '';
			conFinesDeLucroSeleccion = '';
		}
	}

	function actualizarTipoInstitucion(valor: string) {
		tipoInstitucionSeleccion = valor;
		if (valor !== 'otro') {
			tipoInstitucionPersonalizado = '';
		}
	}
</script>

<form
	class="mx-auto max-w-4xl space-y-10 rounded-3xl border border-blue-100 bg-white/90 p-6 shadow-lg backdrop-blur"
	on:submit={manejarSubmit}
	novalidate
>
	<header class="space-y-3 text-center">
		<h2 class="text-3xl font-extrabold tracking-tight text-[rgb(var(--base-color))]">
			{metadatosRol[rolInterno].titulo}
		</h2>
		<p class="mx-auto max-w-2xl text-base text-gray-600">{metadatosRol[rolInterno].descripcion}</p>
	</header>

	{#if errorGeneral}
		<div
			class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
			role="alert"
			aria-live="assertive"
		>
			{errorGeneral}
		</div>
	{/if}

	<section class="grid grid-cols-1 gap-8 md:grid-cols-2">
		<CampoFormulario
			id="username"
			name="username"
			label="Nombre de usuario"
			required
			placeholder="ej: solidario123"
			autocomplete="username"
			bind:value={username}
			error={intentoEnvio ? errores.username : ''}
			disabled={procesando}
		/>
		<CampoFormulario
			id="email"
			name="email"
			label="Correo electrónico"
			required
			placeholder={rolInterno === 'institucion'
				? 'ej: contacto@institucion.org'
				: 'ej: persona@correo.com'}
			type="email"
			autocomplete="email"
			bind:value={email}
			error={intentoEnvio ? errores.email : ''}
			disabled={procesando}
		/>
		<CampoFormulario
			id="password"
			name="password"
			label="Contraseña"
			required
			placeholder="Ingresá una contraseña segura"
			type="password"
			autocomplete="new-password"
			bind:value={password}
			error={intentoEnvio ? errores.password : ''}
			disabled={procesando}
		/>
		<CampoFormulario
			id="passwordConfirm"
			name="passwordConfirm"
			label="Confirmá la contraseña"
			required
			placeholder="Repetí la contraseña"
			type="password"
			autocomplete="new-password"
			bind:value={passwordConfirm}
			error={intentoEnvio ? errores.passwordConfirm : ''}
			disabled={procesando}
		/>
	</section>

	<section class="grid grid-cols-1 gap-8 md:grid-cols-2">
		<div class="md:col-span-2">
			<FotoPerfilUploader
				id="foto"
				name="foto"
				label="Foto de perfil"
				optionalLabel="(opcional)"
				helperText="Podés pegar un enlace o subir una imagen para personalizar tu cuenta."
				bind:url={urlFoto}
				bind:file={archivoFoto}
				error={intentoEnvio ? errores.url_foto : ''}
			/>
		</div>

		<CampoFormulario
			id="nombre"
			name="nombre"
			label={obtenerEtiquetaNombre()}
			required
			placeholder="Nombre"
			bind:value={nombrePersona}
			error={intentoEnvio ? errores.nombre : ''}
			disabled={procesando}
		/>

		<CampoFormulario
			id="apellido"
			name="apellido"
			label={obtenerEtiquetaApellido()}
			required
			placeholder="Apellido"
			bind:value={apellidoPersona}
			error={intentoEnvio ? errores.apellido : ''}
			disabled={procesando}
		/>

		<div>
			<label for="fecha_nacimiento" class="font-semibold text-gray-800">
				{obtenerEtiquetaFecha()} <span class="text-red-600">*</span>
			</label>
			<DatePicker
				id="fecha_nacimiento"
				name="fecha_nacimiento"
				bind:value={fechaNacimiento}
				error={intentoEnvio ? errores.fecha_nacimiento : ''}
			/>
		</div>
	</section>

	{#if rolInterno === 'colaborador'}
		<section class="space-y-4">
			<span class="font-semibold text-gray-800">
				Tipo de colaborador/a <span class="text-red-600">*</span>
			</span>
			<div class="grid gap-4 md:grid-cols-2">
				{#each opcionesTipoColaborador as opcion}
					<div class="relative">
						<input
							id={`tipo-colaborador-${opcion.value}`}
							type="radio"
							class="peer sr-only"
							name="tipo_colaborador"
							value={opcion.value}
							checked={tipoColaborador === opcion.value}
							on:change={() => alternarTipoColaborador(opcion.value)}
						/>
						<label
							for={`tipo-colaborador-${opcion.value}`}
							class="flex h-full cursor-pointer flex-col gap-1 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-[rgb(var(--color-primary))] hover:shadow-md peer-checked:border-[rgb(var(--color-primary))] peer-checked:bg-[rgba(var(--color-primary),0.12)] peer-checked:shadow-md peer-focus-visible:outline peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[rgb(var(--color-primary))]"
						>
							<span class="text-base font-semibold text-gray-900">{opcion.label}</span>
							<span class="text-sm text-gray-600">{opcion.descripcion}</span>
						</label>
					</div>
				{/each}
			</div>

			{#if tipoColaborador === 'organizacion'}
				<div
					class="flex flex-col gap-6 rounded-2xl border border-blue-100 bg-blue-50/70 px-6 py-7 shadow-sm"
				>
					<legend class="text-base font-semibold text-blue-800">Datos de la organización</legend>
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div class="md:col-span-2">
							<CampoFormulario
								id="razon_social"
								name="razon_social"
								label="Razón social"
								required
								placeholder="Nombre legal de la organización"
								bind:value={razonSocial}
								error={intentoEnvio ? errores.razon_social : ''}
								disabled={procesando}
							/>
						</div>

						<div class="md:col-span-2">
							<Select
								id="con_fines_de_lucro"
								name="con_fines_de_lucro"
								bind:value={conFinesDeLucroSeleccion}
								placeholder="Seleccioná una opción"
								options={[
									{ value: 'true', label: 'Sí, con fines de lucro' },
									{ value: 'false', label: 'No, sin fines de lucro' }
								]}
								error={intentoEnvio ? errores.con_fines_de_lucro : ''}
								label="¿La organización tiene fines de lucro?"
								searchable={false}
								disabled={procesando}
							/>
						</div>
					</div>
				</div>
			{/if}
		</section>
	{:else}
		<section class="space-y-4">
			<span class="font-semibold text-gray-800">
				Tipo de institución <span class="text-red-600">*</span>
			</span>
			<div class="grid gap-4 md:grid-cols-3">
				{#each opcionesTipoInstitucion as opcion}
					<div class="relative">
						<input
							id={`tipo-institucion-${opcion.value}`}
							type="radio"
							class="peer sr-only"
							name="tipo_institucion"
							value={opcion.value}
							checked={tipoInstitucionSeleccion === opcion.value}
							on:change={() => actualizarTipoInstitucion(opcion.value)}
						/>
						<label
							for={`tipo-institucion-${opcion.value}`}
							class="flex h-full cursor-pointer flex-col gap-1 rounded-xl border border-gray-200 bg-white p-4 text-base font-semibold text-gray-900 shadow-sm transition hover:border-[rgb(var(--color-primary))] hover:shadow-md peer-checked:border-[rgb(var(--color-primary))] peer-checked:bg-[rgba(var(--color-primary),0.12)] peer-checked:shadow-md peer-focus-visible:outline peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[rgb(var(--color-primary))]"
						>
							{opcion.label}
						</label>
					</div>
				{/each}
			</div>

			{#if tipoInstitucionSeleccion === 'otro'}
				<CampoFormulario
					id="tipo_institucion_personalizado"
					name="tipo_institucion_personalizado"
					label="Especificá el tipo de institución"
					required
					placeholder="Ej: Centro comunitario"
					bind:value={tipoInstitucionPersonalizado}
					error={intentoEnvio ? errores.tipo_institucion : ''}
					disabled={procesando}
				/>
			{/if}

			<CampoFormulario
				id="nombre_legal"
				name="nombre_legal"
				label="Nombre legal de la institución"
				required
				placeholder="Razón social registrada"
				bind:value={nombreLegal}
				error={intentoEnvio ? errores.nombre_legal : ''}
				disabled={procesando}
			/>
		</section>
	{/if}

	<div class="mt-10 flex justify-end">
		<Button
			type="submit"
			label={procesando ? 'Registrando...' : 'Continuar'}
			disabled={procesando}
			ariaDisabled={tieneErrores || procesando}
			customAriaLabel={procesando
				? 'Estamos registrando tu cuenta, aguardá un instante'
				: tieneErrores
					? 'Corregí los campos con error antes de continuar'
					: 'Continuar con el registro'}
			customClass="w-full rounded-xl bg-[rgb(var(--base-color))] px-8 py-3 font-semibold text-white shadow-md transition hover:shadow-xl disabled:opacity-60 md:w-auto"
		/>
	</div>
</form>
