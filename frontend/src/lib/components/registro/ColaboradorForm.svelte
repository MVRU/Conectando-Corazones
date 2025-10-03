<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import DatePicker from '$lib/components/ui/elementos/DatePicker.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import Select from '$lib/components/ui/elementos/Select.svelte';
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
	import type {
		Usuario,
		Colaborador as ColaboradorTipo,
		Organizacion as OrganizacionTipo
	} from '$lib/types/Usuario';
	import { enfocarPrimerCampoConError } from '$lib/utils/forms';

	const dispatch = createEventDispatcher();

	type ColaboradorFormData = Pick<
		Usuario,
		'username' | 'nombre' | 'apellido' | 'fecha_nacimiento' | 'url_foto' | 'email'
	> & {
		password: string;
		passwordConfirm: string;
	} & Pick<ColaboradorTipo, 'tipo_colaborador'>;

	type OrganizacionFormData = Pick<OrganizacionTipo, 'razon_social'> & {
		con_fines_de_lucro: boolean | null;
	};

	const crearColaboradorInicial = (): ColaboradorFormData => ({
		username: '',
		email: '',
		password: '',
		passwordConfirm: '',
		nombre: '',
		apellido: '',
		fecha_nacimiento: undefined,
		url_foto: '',
		tipo_colaborador: 'unipersonal'
	});

	const crearOrganizacionInicial = (): OrganizacionFormData => ({
		razon_social: '',
		con_fines_de_lucro: null
	});

	let enviando = false;
	let intentoEnvio = false;
	let tipoColaborador: 'unipersonal' | 'organizacion' = 'unipersonal';
	let archivoFoto: File | null = null;

	let colaborador: ColaboradorFormData = crearColaboradorInicial();
	let fechaNacimiento: Date | null = null;
	let organizacion: OrganizacionFormData = crearOrganizacionInicial();
	let conFinesDeLucroSeleccion = '';

	function resetFormulario() {
		tipoColaborador = 'unipersonal';
		colaborador = crearColaboradorInicial();
		organizacion = crearOrganizacionInicial();
		fechaNacimiento = null;
		conFinesDeLucroSeleccion = '';
		archivoFoto = null;
		enviando = false;
		intentoEnvio = false;
	}

	function handleReset(event: Event) {
		event.preventDefault();
		resetFormulario();
	}

	$: colaborador.tipo_colaborador = tipoColaborador;
	$: colaborador.fecha_nacimiento = fechaNacimiento ?? undefined;
	$: organizacion.con_fines_de_lucro =
		conFinesDeLucroSeleccion === '' ? null : conFinesDeLucroSeleccion === 'true';
	$: if (tipoColaborador === 'unipersonal') {
		organizacion = crearOrganizacionInicial();
		conFinesDeLucroSeleccion = '';
	}

	$: errores = {
		username: !colaborador.username.trim()
			? MENSAJES_ERROR.obligatorio
			: !validarUsername(colaborador.username)
				? MENSAJES_ERROR.usuarioInvalido
				: '',
		email: !colaborador.email.trim()
			? MENSAJES_ERROR.obligatorio
			: !validarCorreo(colaborador.email.trim())
				? MENSAJES_ERROR.correoInvalido
				: '',
		password: !colaborador.password
			? MENSAJES_ERROR.obligatorio
			: !validarContrasena(colaborador.password)
				? MENSAJES_ERROR.requisitosContrasena
				: '',
		passwordConfirm: !colaborador.passwordConfirm
			? MENSAJES_ERROR.obligatorio
			: colaborador.passwordConfirm !== colaborador.password
				? MENSAJES_ERROR.contrasenasNoCoinciden
				: '',
		nombre: !colaborador.nombre.trim()
			? MENSAJES_ERROR.obligatorio
			: !validarNombre(colaborador.nombre)
				? MENSAJES_ERROR.nombreInvalido
				: '',
		apellido: !colaborador.apellido.trim()
			? MENSAJES_ERROR.obligatorio
			: !validarApellido(colaborador.apellido)
				? MENSAJES_ERROR.apellidoInvalido
				: '',
		fecha_nacimiento:
			fechaNacimiento && esAdulto(fechaNacimiento) ? '' : MENSAJES_ERROR.requisitoEdad,
		url_foto: archivoFoto
			? ''
			: colaborador.url_foto.trim()
				? validarUrl(colaborador.url_foto.trim())
					? ''
					: MENSAJES_ERROR.urlInvalida
				: '',
		razon_social:
			tipoColaborador === 'organizacion'
				? !organizacion.razon_social.trim()
					? MENSAJES_ERROR.obligatorio
					: ''
				: '',
		con_fines_de_lucro:
			tipoColaborador === 'organizacion'
				? organizacion.con_fines_de_lucro === null
					? MENSAJES_ERROR.obligatorio
					: ''
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
			dispatch('submit', { colaborador, organizacion, archivoFoto });
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
			Registro de colaborador/a
		</h2>
		<p class="mx-auto max-w-2xl text-base text-gray-600">
			Elegí si actuás como persona física o en representación de una organización y completá tus
			datos.
		</p>
	</header>

	<section class="space-y-4">
		<span class="font-semibold text-gray-800">
			Tipo de colaborador/a <span class="text-red-600">*</span>
		</span>
		<div class="grid gap-4 md:grid-cols-2">
			<div class="relative">
				<input
					id="tipo-colaborador-unipersonal"
					type="radio"
					class="peer sr-only"
					name="tipo_colaborador"
					value="unipersonal"
					bind:group={tipoColaborador}
					on:change={() => (intentoEnvio = false)}
				/>
				<label
					for="tipo-colaborador-unipersonal"
					class="flex h-full cursor-pointer flex-col gap-1 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-[rgb(var(--color-primary))] hover:shadow-md peer-checked:border-[rgb(var(--color-primary))] peer-checked:bg-[rgba(var(--color-primary),0.12)] peer-checked:shadow-md peer-focus-visible:outline peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[rgb(var(--color-primary))]"
				>
					<span class="text-base font-semibold text-gray-900">Unipersonal</span>
					<span class="text-sm text-gray-600">
						Sos una persona física que colabora con proyectos solidarios.
					</span>
				</label>
			</div>
			<div class="relative">
				<input
					id="tipo-colaborador-organizacion"
					type="radio"
					class="peer sr-only"
					name="tipo_colaborador"
					value="organizacion"
					bind:group={tipoColaborador}
					on:change={() => (intentoEnvio = false)}
				/>
				<label
					for="tipo-colaborador-organizacion"
					class="flex h-full cursor-pointer flex-col gap-1 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-[rgb(var(--color-primary))] hover:shadow-md peer-checked:border-[rgb(var(--color-primary))] peer-checked:bg-[rgba(var(--color-primary),0.12)] peer-checked:shadow-md peer-focus-visible:outline peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[rgb(var(--color-primary))]"
				>
					<span class="text-base font-semibold text-gray-900">Organización</span>
					<span class="text-sm text-gray-600">
						Representás a una entidad que ofrece recursos o acompañamiento.
					</span>
				</label>
			</div>
		</div>
	</section>

	<section class="grid grid-cols-1 gap-8 md:grid-cols-2">
		<div>
			<label for="username" class="font-semibold text-gray-800">
				Nombre de usuario <span class="text-red-600">*</span>
			</label>
			<Input
				id="username"
				name="username"
				bind:value={colaborador.username}
				placeholder="ej: solidario123"
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
				bind:value={colaborador.email}
				placeholder="ej: persona@correo.com"
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
				bind:value={colaborador.password}
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
				bind:value={colaborador.passwordConfirm}
				placeholder="Repetí la contraseña"
				autocomplete="new-password"
				error={intentoEnvio ? errores.passwordConfirm : ''}
			/>
		</div>
	</section>

	<section class="grid grid-cols-1 gap-8 md:grid-cols-2">
		<div class="md:col-span-2">
			<FotoPerfilUploader
				id="url_foto"
				name="url_foto"
				bind:url={colaborador.url_foto}
				bind:file={archivoFoto}
				error={intentoEnvio ? errores.url_foto : ''}
			/>
		</div>

		<div>
			<label for="nombre" class="font-semibold text-gray-800">
				Nombre {tipoColaborador === 'organizacion' ? 'del representante legal' : 'de la persona'}
				<span class="text-red-600">*</span>
			</label>
			<Input
				id="nombre"
				name="nombre"
				bind:value={colaborador.nombre}
				placeholder="Nombre"
				error={intentoEnvio ? errores.nombre : ''}
			/>
		</div>

		<div>
			<label for="apellido" class="font-semibold text-gray-800">
				Apellido {tipoColaborador === 'organizacion' ? 'del representante legal' : 'de la persona'}
				<span class="text-red-600">*</span>
			</label>
			<Input
				id="apellido"
				name="apellido"
				bind:value={colaborador.apellido}
				placeholder="Apellido"
				error={intentoEnvio ? errores.apellido : ''}
			/>
		</div>

		<div>
			<label for="fecha_nacimiento" class="font-semibold text-gray-800">
				Fecha de nacimiento {tipoColaborador === 'organizacion' ? 'del representante legal' : ''}
				<span class="text-red-600">*</span>
			</label>
			<DatePicker
				id="fecha_nacimiento"
				name="fecha_nacimiento"
				bind:value={fechaNacimiento}
				error={intentoEnvio ? errores.fecha_nacimiento : ''}
			/>
		</div>
	</section>

	{#if tipoColaborador === 'organizacion'}
		<section
			class="flex flex-col gap-6 rounded-2xl border border-blue-100 bg-blue-50/70 px-6 py-7 shadow-sm"
		>
			<legend class="text-base font-semibold text-blue-800">Datos de la organización</legend>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div class="md:col-span-2">
					<label for="razon_social" class="font-semibold text-gray-800">
						Razón social <span class="text-red-600">*</span>
					</label>
					<Input
						id="razon_social"
						name="razon_social"
						bind:value={organizacion.razon_social}
						placeholder="Nombre legal de la organización"
						error={intentoEnvio ? errores.razon_social : ''}
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
					/>
				</div>
			</div>
		</section>
	{/if}

	<div class="mt-10 flex justify-end">
		<Button
			label={enviando ? 'Enviando...' : 'Continuar'}
			disabled={enviando}
			ariaDisabled={tieneErrores}
			customAriaLabel={tieneErrores
				? 'Corregí los campos con error antes de continuar'
				: 'Continuar con el registro de colaborador o colaboradora'}
			customClass="w-full rounded-xl bg-[rgb(var(--base-color))] px-8 py-3 font-semibold text-white shadow-md transition hover:shadow-xl disabled:opacity-60 md:w-auto"
		/>
	</div>
</form>
