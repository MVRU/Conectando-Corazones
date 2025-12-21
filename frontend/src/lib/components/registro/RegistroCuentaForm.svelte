<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type { ComponentType } from 'svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import DatePicker from '$lib/components/ui/elementos/DatePicker.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
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
		esFechaFutura,
		esFechaMuyAntigua,
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
	import {
		Mail,
		KeyRound,
		Globe,
		ShieldCheck,
		Clock,
		UserRound,
		Calendar,
		Building2,
		School,
		Hospital,
		Soup,
		Church,
		Ellipsis,
		Eye,
		EyeOff,
		LockKeyhole
	} from 'lucide-svelte';
	import {
		REGISTRO_FORM_STORAGE_KEY,
		REGISTRO_STORAGE_TTL_MS,
		REGISTRO_STORAGE_VERSION
	} from '$lib/constants/registro';
	import { toastStore } from '$lib/stores/toast';
	import { mockUsuarios } from '$lib/mocks/mock-usuarios';

	const dispatch = createEventDispatcher<{
		submit: RegistroCuentaSubmitDetail;
		invalid: { campos: string[] };
		processing: { value: boolean };
		back: void;
		selectMethod: { metodo: MetodoAcceso };
	}>();

	export let rol: RegistroRol = 'institucion';
	export let procesando = false;
	export let errorGeneral: string | null = null;

	const opcionesTipoColaborador: Array<{
		value: TipoColaborador;
		label: string;
		descripcion: string;
		icon: ComponentType;
	}> = [
		{
			value: 'unipersonal',
			label: 'Unipersonal',
			descripcion: 'Sos una persona física que colabora con proyectos solidarios.',
			icon: UserRound
		},
		{
			value: 'organizacion',
			label: 'Organización',
			descripcion: 'Representás a una entidad que coordina recursos o acompañamiento.',
			icon: Building2
		}
	];

	type TipoInstitucionOpcion = {
		value: string;
		label: string;
		descripcion: string;
		icon: ComponentType;
		disabled?: boolean;
	};

	const opcionesTipoInstitucion: TipoInstitucionOpcion[] = [
		{
			value: 'escuela',
			label: 'Escuela',
			descripcion: 'Instituciones educativas, apoyo escolar o clubes de tareas.',
			icon: School
		},
		{
			value: 'hospital',
			label: 'Hospital',
			descripcion: 'Hospitales, clínicas, postas de salud y acompañamiento.',
			icon: Hospital
		},
		{
			value: 'comedor',
			label: 'Comedor comunitario',
			descripcion: 'Merenderos, ollas populares o espacios barriales.',
			icon: Soup
		},
		{
			value: 'fundacion',
			label: 'Fundación',
			descripcion: 'Fundaciones, asociaciones civiles u ONGs.',
			icon: Building2
		},
		{
			value: 'iglesia',
			label: 'Iglesia',
			descripcion: 'Parroquias, templos o comunidades de fe.',
			icon: Church
		},
		{
			value: 'otro',
			label: 'Otro',
			descripcion: 'Otra figura legal o red solidaria.',
			icon: Ellipsis
		}
	];

	type FederatedProviderId = 'google' | 'facebook' | 'microsoft' | 'apple';

	const proveedoresFederados: Array<{
		id: FederatedProviderId;
		label: string;
		descripcion: string;
		cardClass: string;
		iconClass: string;
		badgeClass: string;
	}> = [
		{
			id: 'google',
			label: 'Google',
			descripcion: 'Conectate con tu cuenta de Gmail en segundos.',
			cardClass: 'border-amber-100/70 bg-gradient-to-br from-white via-white to-amber-50/60',
			iconClass: 'bg-white',
			badgeClass: 'bg-amber-100/80 text-amber-700'
		},
		{
			id: 'facebook',
			label: 'Facebook',
			descripcion: 'Pronto vas a poder ingresar con tu perfil social.',
			cardClass: 'border-blue-100/80 bg-gradient-to-br from-white via-white to-blue-50/70',
			iconClass: 'bg-white',
			badgeClass: 'bg-blue-100/80 text-blue-700'
		},
		{
			id: 'microsoft',
			label: 'Microsoft',
			descripcion: 'Ideal si usás Outlook o Teams a diario.',
			cardClass: 'border-slate-200 bg-gradient-to-br from-white via-white to-slate-50',
			iconClass: 'bg-white',
			badgeClass: 'bg-slate-200 text-slate-700'
		},
		{
			id: 'apple',
			label: 'Apple',
			descripcion: 'Usá tu Apple ID para un acceso seguro.',
			cardClass: 'border-neutral-200 bg-gradient-to-br from-white via-white to-neutral-100',
			iconClass: 'text-white',
			badgeClass: 'bg-neutral-900 text-white'
		}
	];

	const iconosFederados: Record<FederatedProviderId, string> = {
		google: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262" id="google">
		<path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
		<path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
		<path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
		<path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
		</svg>`,
		facebook: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 1024 1024" id="facebook">
		<path fill="#1877f2" d="M1024,512C1024,229.23016,794.76978,0,512,0S0,229.23016,0,512c0,255.554,187.231,467.37012,432,505.77777V660H302V512H432V399.2C432,270.87982,508.43854,200,625.38922,200,681.40765,200,740,210,740,210V336H675.43713C611.83508,336,592,375.46667,592,415.95728V512H734L711.3,660H592v357.77777C836.769,979.37012,1024,767.554,1024,512Z"></path>
		<path fill="#fff" d="M711.3,660,734,512H592V415.95728C592,375.46667,611.83508,336,675.43713,336H740V210s-58.59235-10-114.61078-10C508.43854,200,432,270.87982,432,399.2V512H302V660H432v357.77777a517.39619,517.39619,0,0,0,160,0V660Z"></path>
		</svg>`,
		microsoft: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" xml:space="preserve" viewBox="0 0 16 16" id="microsoft">
		<path fill="#4CAF50" d="M8.5 7.5H16v-7a.5.5 0 0 0-.5-.5h-7v7.5z"></path>
		<path fill="#F44336" d="M7.5 7.5V0h-7a.5.5 0 0 0-.5.5v7h7.5z"></path>
		<path fill="#2196F3" d="M7.5 8.5H0v7a.5.5 0 0 0 .5.5h7V8.5z"></path>
		<path fill="#FFC107" d="M8.5 8.5V16h7a.5.5 0 0 0 .5-.5v-7H8.5z"></path>
		</svg>`,
		apple: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 128 128" id="apple">
		<path d="M97.905 67.885c.174 18.8 16.494 25.057 16.674 25.137-.138.44-2.607 8.916-8.597 17.669-5.178 7.568-10.553 15.108-19.018 15.266-8.318.152-10.993-4.934-20.504-4.934-9.508 0-12.479 4.776-20.354 5.086-8.172.31-14.395-8.185-19.616-15.724-10.668-15.424-18.821-43.585-7.874-62.594 5.438-9.44 15.158-15.417 25.707-15.571 8.024-.153 15.598 5.398 20.503 5.398 4.902 0 14.106-6.676 23.782-5.696 4.051.169 15.421 1.636 22.722 12.324-.587.365-13.566 7.921-13.425 23.639m-15.633-46.166c4.338-5.251 7.258-12.563 6.462-19.836-6.254.251-13.816 4.167-18.301 9.416-4.02 4.647-7.54 12.087-6.591 19.216 6.971.54 14.091-3.542 18.43-8.796"></path>
		</svg>`
	};

	type FormSnapshot = {
		version: number;
		timestamp: number;
		rol: RegistroRol;
		pasoFormulario: 'credenciales' | 'detalles';
		metodoAcceso: 'manual' | 'federado' | null;
		username: string;
		email: string;
		nombrePersona: string;
		apellidoPersona: string;
		fechaNacimiento: string | null;
		urlFoto: string;
		razonSocial: string;
		conFinesDeLucroSeleccion: '' | 'true' | 'false';
		nombreLegal: string;
		tipoInstitucionSeleccion: string;
		tipoInstitucionPersonalizado: string;
		tipoColaborador: TipoColaborador;
	};

	const FORM_SNAPSHOT_VERSION = REGISTRO_STORAGE_VERSION;

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

	type MetodoAcceso = 'manual' | 'federado';

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

	const metodosRegistro: Array<{
		id: MetodoAcceso;
		label: string;
		description: string;
		chip: string;
		disponible: boolean;
	}> = [
		{
			id: 'manual',
			label: 'Registrarme con email y contraseña segura',
			description: 'Creá tu cuenta protegida para gestionar proyectos y colaboraciones.',
			chip: 'Paso recomendado',
			disponible: true
		},
		{
			id: 'federado',
			label: 'Iniciar con Google, Microsoft, Apple o Facebook',
			description: 'Muy pronto vas a poder ingresar con tus cuentas favoritas de manera segura.',
			chip: 'Próximamente',
			disponible: false
		}
	];

	let storageDisponible = false;
	let persistenciaHabilitada = false;
	let puedeReiniciarPorCambioRol = false;
	let notificacionGuardadoMostrada = false;
	let mostrarModalPassword = false;
	let modalPassword = '';
	let modalPasswordConfirm = '';
	let modalPasswordError = '';
	let modalPasswordConfirmError = '';
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
	let pasoFormulario: 'credenciales' | 'detalles' = 'credenciales';
	let formularioRef: HTMLFormElement | null = null;
	let mostrarPassword = false;
	let mostrarPasswordConfirm = false;
	let mostrarModalPasswordTexto = false;
	let mostrarModalPasswordConfirmTexto = false;
	let metodoAcceso: MetodoAcceso | null = null;

	let rolInterno: RegistroRol = rol;

	onMount(() => {
		if (typeof window === 'undefined' || typeof window.sessionStorage === 'undefined') {
			puedeReiniciarPorCambioRol = true;
			return;
		}
		storageDisponible = true;
		const snapshot = leerFormularioPersistido();
		if (snapshot && snapshot.rol === rol) {
			aplicarSnapshot(snapshot);
		}
		puedeReiniciarPorCambioRol = true;
		persistenciaHabilitada = true;
	});

	$: if (rol !== rolInterno) {
		rolInterno = rol;
		if (puedeReiniciarPorCambioRol) {
			resetFormulario();
		}
	}

	$: if (persistenciaHabilitada) {
		if (formularioTieneDatosPersistibles()) {
			guardarFormularioPersistido({
				version: FORM_SNAPSHOT_VERSION,
				timestamp: Date.now(),
				rol: rolInterno,
				pasoFormulario,
				metodoAcceso,
				username,
				email,
				nombrePersona,
				apellidoPersona,
				fechaNacimiento: fechaNacimiento ? fechaNacimiento.toISOString() : null,
				urlFoto,
				razonSocial,
				conFinesDeLucroSeleccion,
				nombreLegal,
				tipoInstitucionSeleccion,
				tipoInstitucionPersonalizado,
				tipoColaborador
			});
			notificarGuardarTemporal();
		} else {
			limpiarFormularioPersistido();
			notificacionGuardadoMostrada = false;
		}
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
				'Ingresá los datos del representante legal y la información básica de la institución.'
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
		pasoFormulario = 'credenciales';
		metodoAcceso = null;
		notificacionGuardadoMostrada = false;
		mostrarModalPassword = false;
		modalPassword = '';
		modalPasswordConfirm = '';
		modalPasswordError = '';
		modalPasswordConfirmError = '';
		limpiarFormularioPersistido();
	}

	function aplicarSnapshot(snapshot: FormSnapshot) {
		rolInterno = snapshot.rol;
		pasoFormulario = snapshot.pasoFormulario;
		metodoAcceso = snapshot.metodoAcceso;
		username = snapshot.username ?? '';
		email = snapshot.email ?? '';
		nombrePersona = snapshot.nombrePersona ?? '';
		apellidoPersona = snapshot.apellidoPersona ?? '';
		fechaNacimiento = parseFechaPersistida(snapshot.fechaNacimiento);
		urlFoto = snapshot.urlFoto ?? '';
		razonSocial = snapshot.razonSocial ?? '';
		conFinesDeLucroSeleccion = snapshot.conFinesDeLucroSeleccion ?? '';
		nombreLegal = snapshot.nombreLegal ?? '';
		tipoInstitucionSeleccion = snapshot.tipoInstitucionSeleccion ?? TIPO_INSTITUCION_POR_DEFECTO;
		tipoInstitucionPersonalizado = snapshot.tipoInstitucionPersonalizado ?? '';
		tipoColaborador = snapshot.tipoColaborador ?? 'unipersonal';
		if (pasoFormulario === 'detalles' && requiereReingresoPassword()) {
			abrirModalPassword();
		}
	}

	function parseFechaPersistida(valor: string | null): Date | null {
		if (!valor) {
			return null;
		}
		const parsed = new Date(valor);
		return Number.isNaN(parsed.getTime()) ? null : parsed;
	}

	function leerFormularioPersistido(): FormSnapshot | null {
		if (!storageDisponible) {
			return null;
		}
		try {
			const raw = window.sessionStorage.getItem(REGISTRO_FORM_STORAGE_KEY);
			if (!raw) {
				return null;
			}
			const snapshot = JSON.parse(raw) as FormSnapshot;
			if (!snapshot || snapshot.version !== FORM_SNAPSHOT_VERSION) {
				window.sessionStorage.removeItem(REGISTRO_FORM_STORAGE_KEY);
				return null;
			}
			if (Date.now() - snapshot.timestamp > REGISTRO_STORAGE_TTL_MS) {
				window.sessionStorage.removeItem(REGISTRO_FORM_STORAGE_KEY);
				return null;
			}
			return snapshot;
		} catch (error) {
			console.warn('No se pudo recuperar el progreso del formulario de registro', error);
			window.sessionStorage.removeItem(REGISTRO_FORM_STORAGE_KEY);
			return null;
		}
	}

	function guardarFormularioPersistido(snapshot: FormSnapshot) {
		if (!storageDisponible) {
			return;
		}
		try {
			window.sessionStorage.setItem(REGISTRO_FORM_STORAGE_KEY, JSON.stringify(snapshot));
		} catch (error) {
			console.warn('No se pudo guardar el progreso del formulario de registro', error);
		}
	}

	function limpiarFormularioPersistido() {
		if (!storageDisponible) {
			return;
		}
		window.sessionStorage.removeItem(REGISTRO_FORM_STORAGE_KEY);
	}

	function formularioTieneDatosPersistibles(): boolean {
		if (metodoAcceso || pasoFormulario === 'detalles') {
			return true;
		}
		return Boolean(
			username ||
				email ||
				nombrePersona ||
				apellidoPersona ||
				fechaNacimiento ||
				urlFoto ||
				razonSocial ||
				conFinesDeLucroSeleccion ||
				nombreLegal ||
				tipoInstitucionPersonalizado ||
				tipoInstitucionSeleccion !== TIPO_INSTITUCION_POR_DEFECTO ||
				tipoColaborador !== 'unipersonal'
		);
	}

	function notificarGuardarTemporal() {
		if (!storageDisponible || notificacionGuardadoMostrada) {
			return;
		}
		notificacionGuardadoMostrada = true;
		toastStore.show({
			variant: 'success',
			title: 'Progreso guardado',
			message:
				'Guardamos temporalmente tus datos de registro en este dispositivo. Podés salir y volver más tarde para continuar sin perder tu avance.'
		});
	}

	function requiereReingresoPassword() {
		return !password || !passwordConfirm;
	}

	function abrirModalPassword() {
		modalPassword = '';
		modalPasswordConfirm = '';
		modalPasswordError = '';
		modalPasswordConfirmError = '';
		mostrarModalPassword = true;
	}

	function cerrarModalPassword({ regresarACredenciales = false } = {}) {
		mostrarModalPassword = false;
		modalPassword = '';
		modalPasswordConfirm = '';
		modalPasswordError = '';
		modalPasswordConfirmError = '';
		if (regresarACredenciales) {
			volverAPasoCredenciales();
		}
	}

	function confirmarModalPassword() {
		modalPasswordError = '';
		modalPasswordConfirmError = '';
		const nuevaPassword = modalPassword.trim();
		const nuevaConfirmacion = modalPasswordConfirm.trim();

		if (!nuevaPassword) {
			modalPasswordError = MENSAJES_ERROR.obligatorio;
		} else if (!validarContrasena(nuevaPassword)) {
			modalPasswordError = MENSAJES_ERROR.requisitosContrasena;
		}

		if (!nuevaConfirmacion) {
			modalPasswordConfirmError = MENSAJES_ERROR.obligatorio;
		} else if (nuevaPassword && nuevaPassword !== nuevaConfirmacion) {
			modalPasswordConfirmError = MENSAJES_ERROR.contrasenasNoCoinciden;
		}

		if (modalPasswordError || modalPasswordConfirmError) {
			return;
		}

		password = nuevaPassword;
		passwordConfirm = nuevaConfirmacion;
		mostrarModalPassword = false;
	}

	function manejarRegistroProveedor(proveedor: FederatedProviderId) {
		console.info(`Registro con proveedor ${proveedor} aún no está disponible.`);
	}

	function seleccionarMetodoAcceso(metodo: MetodoAcceso) {
		const metodoConfig = metodosRegistro.find((item) => item.id === metodo);
		if (!metodoConfig?.disponible) {
			return;
		}
		if (metodoAcceso === metodo) {
			return;
		}
		metodoAcceso = metodo;
		intentoEnvio = false;
		pasoFormulario = 'credenciales';
		dispatch('selectMethod', { metodo });
	}

	function manejarKeydownMetodo(event: KeyboardEvent, metodoId: MetodoAcceso, disponible: boolean) {
		if (event.key === ' ' || event.key === 'Enter') {
			event.preventDefault();
			if (disponible) {
				seleccionarMetodoAcceso(metodoId);
			}
			return;
		}
		if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
			event.preventDefault();
			moverFocoMetodo(metodoId, 1);
			return;
		}
		if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
			event.preventDefault();
			moverFocoMetodo(metodoId, -1);
		}
	}

	function moverFocoMetodo(actual: MetodoAcceso, direction: 1 | -1) {
		const interactivos = metodosRegistro.filter((metodo) => metodo.disponible);
		if (!interactivos.length) {
			return;
		}
		const index = interactivos.findIndex((item) => item.id === actual);
		const nextIndex =
			index === -1 ? 0 : (index + direction + interactivos.length) % interactivos.length;
		const nextId = interactivos[nextIndex]?.id;
		if (nextId) {
			focusMetodoButton(nextId);
		}
	}

	function obtenerTabIndexMetodo(id: MetodoAcceso, disponible: boolean) {
		if (!disponible) {
			return -1;
		}
		if (metodoAcceso === id) {
			return 0;
		}
		return metodoAcceso === null && id === 'manual' ? 0 : -1;
	}

	function focusMetodoButton(id: MetodoAcceso) {
		if (typeof document === 'undefined') {
			return;
		}
		const elemento = document.querySelector<HTMLButtonElement>(`button[data-metodo="${id}"]`);
		elemento?.focus();
	}

	function continuarConDetalles() {
		if (metodoAcceso !== 'manual') {
			seleccionarMetodoAcceso('manual');
			return;
		}

		intentoEnvio = true;
		const camposCredenciales: Array<keyof ErroresFormulario> = [
			'username',
			'email',
			'password',
			'passwordConfirm'
		];
		const camposConErrores = camposCredenciales.filter((campo) => errores[campo]);

		if (camposConErrores.length) {
			enfocarPrimerCampoConError();
			dispatch('invalid', { campos: camposConErrores });
			return;
		}

		intentoEnvio = false;
		pasoFormulario = 'detalles';
	}

	function volverAPasoCredenciales() {
		pasoFormulario = 'credenciales';
		mostrarModalPassword = false;
		if (typeof window !== 'undefined') {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	function solicitarRetroceso() {
		dispatch('back');
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
					: Object.values(mockUsuarios).some((u) => u.username === usernameNormalizado)
						? `El nombre de usuario "${usernameNormalizado}" ya está en uso`
						: '',
			email: !emailNormalizado
				? MENSAJES_ERROR.obligatorio
				: !validarCorreo(emailNormalizado)
					? MENSAJES_ERROR.correoInvalido
					: Object.values(mockUsuarios).some((u) =>
								u.contactos.some((c) => c.tipo_contacto === 'email' && c.valor === emailNormalizado)
						  )
						? `El correo electrónico "${emailNormalizado}" ya está en uso`
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
			fecha_nacimiento: !fechaNacimiento
				? MENSAJES_ERROR.obligatorio
				: esFechaFutura(fechaNacimiento)
					? MENSAJES_ERROR.fechaFutura
					: esFechaMuyAntigua(fechaNacimiento)
						? MENSAJES_ERROR.fechaMuyAntigua
						: !esAdulto(fechaNacimiento)
							? MENSAJES_ERROR.requisitoEdad
							: '',
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
			nombre_legal: !nombreLegalNormalizado
				? MENSAJES_ERROR.obligatorio
				: nombreLegalNormalizado.length < 3
					? MENSAJES_ERROR.nombreCorto
					: Object.values(mockUsuarios).some(
								(u) =>
									u.rol === 'institucion' &&
									'nombre_legal' in u &&
									u.nombre_legal?.toLowerCase() === nombreLegalNormalizado.toLowerCase()
						  )
						? MENSAJES_ERROR.nombreLegalDuplicado
						: '',
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
			if (
				campos.length &&
				campos.every((campo) => campo === 'password' || campo === 'passwordConfirm')
			) {
				abrirModalPassword();
			}
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

	function manejarTeclaForm(event: KeyboardEvent) {
		if (event.key !== 'Enter' || event.shiftKey || event.altKey || event.metaKey || event.ctrlKey) {
			return;
		}

		event.preventDefault();

		if (pasoFormulario === 'credenciales') {
			continuarConDetalles();
			return;
		}

		formularioRef?.requestSubmit();
	}
</script>

<form
	class="mx-auto max-w-4xl space-y-10"
	on:submit={manejarSubmit}
	on:keydown={manejarTeclaForm}
	bind:this={formularioRef}
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

	{#if pasoFormulario === 'credenciales'}
		<section class="rounded-2xl bg-white p-6">
			<header class="mb-6 space-y-2 text-center sm:text-left">
				<p
					class="text-xs font-semibold uppercase tracking-[0.35em] text-[rgb(var(--color-primary))]/70"
				>
					Paso 1 · Elegí cómo registrarte
				</p>
				<h3 class="text-xl font-semibold text-slate-900">Seleccioná tu método de acceso</h3>
				<p class="text-sm text-slate-500">
					Podés avanzar con email y contraseña o conectar un proveedor federado.
				</p>
			</header>

			<div
				role="radiogroup"
				aria-label="Seleccioná el método de registro"
				class="grid gap-4 md:grid-cols-2"
			>
				{#each metodosRegistro as metodo}
					<button
						type="button"
						data-metodo={metodo.id}
						role="radio"
						aria-checked={metodoAcceso === metodo.id}
						aria-disabled={!metodo.disponible}
						tabindex={obtenerTabIndexMetodo(metodo.id, metodo.disponible)}
						on:click={() => seleccionarMetodoAcceso(metodo.id)}
						on:keydown={(event) => manejarKeydownMetodo(event, metodo.id, metodo.disponible)}
						class={`group flex h-full flex-col gap-4 rounded-2xl border px-6 py-6 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7CB9FF]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
							metodo.disponible
								? 'hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]'
								: 'cursor-not-allowed opacity-70'
						} ${
							metodoAcceso === metodo.id
								? 'border-[#7CB9FF] bg-[#F5F9FF] shadow-sm ring-2 ring-[#7CB9FF]/40'
								: 'border-[#E5E7EB] bg-white hover:border-[#7CB9FF]/60 hover:ring-1 hover:ring-[#7CB9FF]/20'
						}`}
					>
						<div class="flex items-start gap-3">
							{#if metodo.id === 'manual'}
								<span
									class="relative inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#F5F9FF] text-[#3B82F6]"
								>
									<Mail class="h-6 w-6" stroke-width={1.6} />
									<span
										class="absolute -bottom-1 -right-1 rounded-full bg-white p-0.5 shadow ring-1 ring-slate-100"
									>
										<KeyRound class="h-4 w-4 text-[#2563EB]" stroke-width={1.7} />
									</span>
								</span>
							{:else}
								<span
									class="relative inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#FFE5E9] text-[#E24D5C]"
								>
									<Globe class="h-6 w-6" stroke-width={1.4} />
									<span
										class="absolute -bottom-1 -right-1 rounded-full bg-white p-0.5 shadow ring-1 ring-slate-100"
									>
										{#if metodoAcceso === 'federado' && metodo.disponible}
											<ShieldCheck class="h-4 w-4 text-emerald-500" stroke-width={1.7} />
										{:else}
											<Clock class="h-4 w-4 text-amber-500" stroke-width={1.7} />
										{/if}
									</span>
								</span>
							{/if}
							<div class="space-y-1">
								<p class="text-base font-semibold text-[#111827]">{metodo.label}</p>
								<p class="text-sm text-[#6B7280]">{metodo.description}</p>
							</div>
						</div>
						<div class="mt-auto flex items-center justify-between">
							<span
								class={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
									metodoAcceso === metodo.id
										? 'bg-[#E0EDFF] text-[#2563EB]'
										: 'bg-slate-100 text-slate-600'
								}`}
							>
								{#if !metodo.disponible}
									Próximamente
								{:else if metodoAcceso === metodo.id}
									Seleccionado
								{:else}
									{metodo.chip}
								{/if}
							</span>
						</div>
					</button>
				{/each}
			</div>
		</section>

		{#if metodoAcceso === null}
			<div class="rounded-2xl bg-slate-50/80 p-8 text-center text-slate-500">
				Seleccioná una de las opciones superiores para continuar con el formulario.
			</div>
		{:else if metodoAcceso === 'federado'}
			<section class="rounded-2xl bg-white/95 p-6 ring-1 ring-slate-100/80">
				<header class="mb-4 space-y-2 text-center sm:text-left">
					<p
						class="text-xs font-semibold uppercase tracking-[0.35em] text-[rgb(var(--color-primary))]/70"
					>
						Acceso rápido
					</p>
					<h3 class="text-xl font-semibold text-slate-900">Elegí un proveedor federado</h3>
					<p class="text-sm text-slate-500">
						En breve vas a poder usar estas cuentas para ingresar sin contraseña adicional. Mientras
						tanto, podés completar el formulario con tu email.
					</p>
				</header>

				<div class="grid gap-4 md:grid-cols-2">
					{#each proveedoresFederados as proveedor}
						<button
							type="button"
							class={`group flex flex-col gap-4 rounded-2xl border p-5 text-left transition-all duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary))]/30 focus-visible:ring-offset-2 ${proveedor.cardClass} cursor-not-allowed`}
							aria-disabled="true"
							title="Integración disponible pronto"
							on:click={() => manejarRegistroProveedor(proveedor.id)}
						>
							<div class="flex items-center gap-4">
								<span
									class={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/50  ${proveedor.iconClass}`}
									aria-hidden="true"
								>
									{@html iconosFederados[proveedor.id]}
								</span>
								<div>
									<p class="text-base font-semibold text-slate-900">
										Ingresá con {proveedor.label}
									</p>
									<p class="text-sm text-slate-500">{proveedor.descripcion}</p>
								</div>
							</div>
							<div class="flex items-center justify-between">
								<span
									class={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${proveedor.badgeClass}`}
								>
									Próximamente
								</span>
								<svg
									class="h-5 w-5 text-slate-400 transition group-hover:text-[rgb(var(--color-primary))]"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="1.5"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
								</svg>
							</div>
						</button>
					{/each}
				</div>

				<p class="mt-6 text-center text-sm text-slate-500">
					¿Preferís avanzar con email y contraseña?
					<button
						type="button"
						class="font-semibold text-[rgb(var(--color-primary))] underline-offset-2 hover:underline"
						on:click={() => seleccionarMetodoAcceso('manual')}
					>
						Crear cuenta manualmente
					</button>
				</p>
			</section>
		{:else}
			<section class="rounded-2xl bg-white/95 p-6">
				<div class="flex flex-col gap-2">
					<p
						class="text-xs font-semibold uppercase tracking-[0.35em] text-[rgb(var(--color-primary))]/70"
					>
						Credenciales
					</p>
					<h3 class="text-xl font-semibold text-slate-900">Datos de acceso</h3>
					<p class="text-sm text-slate-500">
						Definí un nombre de usuario y una contraseña robusta para mantener tu cuenta segura.
					</p>
				</div>

				<div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
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
					<div class="space-y-2">
						<label
							for="password"
							class="inline-flex items-center gap-1 text-sm font-semibold text-slate-700"
						>
							Contraseña <span class="text-red-500">*</span>
						</label>
						<div class="relative">
							<Input
								id="password"
								name="password"
								placeholder="Ingresá una contraseña segura"
								autocomplete="new-password"
								type={mostrarPassword ? 'text' : 'password'}
								bind:value={password}
								error={intentoEnvio ? errores.password : ''}
								disabled={procesando}
								customClass="pr-12"
								required
							/>
							<button
								type="button"
								class="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-200"
								on:click={() => (mostrarPassword = !mostrarPassword)}
								aria-pressed={mostrarPassword}
								aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
								disabled={procesando}
							>
								{#if mostrarPassword}
									<EyeOff class="h-4 w-4" stroke-width={1.7} />
								{:else}
									<Eye class="h-4 w-4" stroke-width={1.7} />
								{/if}
							</button>
						</div>
					</div>
					<div class="space-y-2">
						<label
							for="passwordConfirm"
							class="inline-flex items-center gap-1 text-sm font-semibold text-slate-700"
						>
							Confirmá la contraseña <span class="text-red-500">*</span>
						</label>
						<div class="relative">
							<Input
								id="passwordConfirm"
								name="passwordConfirm"
								placeholder="Repetí la contraseña"
								autocomplete="new-password"
								type={mostrarPasswordConfirm ? 'text' : 'password'}
								bind:value={passwordConfirm}
								error={intentoEnvio ? errores.passwordConfirm : ''}
								disabled={procesando}
								customClass="pr-12"
								required
							/>
							<button
								type="button"
								class="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-200"
								on:click={() => (mostrarPasswordConfirm = !mostrarPasswordConfirm)}
								aria-pressed={mostrarPasswordConfirm}
								aria-label={mostrarPasswordConfirm
									? 'Ocultar confirmación de contraseña'
									: 'Mostrar confirmación de contraseña'}
								disabled={procesando}
							>
								{#if mostrarPasswordConfirm}
									<EyeOff class="h-4 w-4" stroke-width={1.7} />
								{:else}
									<Eye class="h-4 w-4" stroke-width={1.7} />
								{/if}
							</button>
						</div>
					</div>
				</div>
			</section>

			<div class="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-end">
				<Button
					type="button"
					label="Continuar"
					variant="primary"
					customClass="w-full sm:w-auto"
					on:click={continuarConDetalles}
					disabled={procesando}
					customAriaLabel="Pasar al siguiente paso del registro"
				/>
			</div>
		{/if}
	{:else}
		<div
			class="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/70 bg-white/90 p-4 text-sm text-slate-600"
		>
			<div>
				<p class="font-semibold text-slate-900">Paso 2 · Información de la cuenta</p>
				<p>Revisá tus credenciales antes de continuar.</p>
			</div>
			<button
				type="button"
				class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
				on:click={volverAPasoCredenciales}
			>
				<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
				Editar credenciales
			</button>
		</div>

		{#if rolInterno === 'institucion'}
			<section
				class="space-y-8 rounded-2xl border border-slate-200 bg-white/95 px-6 py-8 shadow-sm"
			>
				<header class="space-y-2">
					<p
						class="text-xs font-semibold uppercase tracking-[0.35em] text-[rgb(var(--color-primary))]/70"
					>
						Paso 2 · Perfil institucional
					</p>
					<h3 class="text-2xl font-semibold text-slate-900">Datos de la institución</h3>
					<p class="text-sm text-slate-500">
						Cargá los datos que harán que tu perfil sea reconocible y transparente.
					</p>
				</header>

				<FotoPerfilUploader
					id="foto"
					name="foto"
					label="Foto o avatar"
					optionalLabel="(opcional)"
					description="Subí un logo o imagen cuadrada para que la comunidad identifique tu institución."
					helperText="Podés pegar un enlace o subir una imagen para personalizar tu cuenta."
					bind:url={urlFoto}
					bind:file={archivoFoto}
					error={intentoEnvio ? errores.url_foto : ''}
				/>

				<div class="grid gap-5 md:grid-cols-2">
					<CampoFormulario
						id="nombre"
						name="nombre"
						label={obtenerEtiquetaNombre()}
						required
						placeholder="Nombre de la persona referente"
						bind:value={nombrePersona}
						error={intentoEnvio ? errores.nombre : ''}
						disabled={procesando}
						icon={UserRound}
						iconClass="text-sky-500"
					/>

					<CampoFormulario
						id="apellido"
						name="apellido"
						label={obtenerEtiquetaApellido()}
						required
						placeholder="Apellido de la persona referente"
						bind:value={apellidoPersona}
						error={intentoEnvio ? errores.apellido : ''}
						disabled={procesando}
						icon={UserRound}
						iconClass="text-sky-500"
					/>
				</div>

				<div class="grid gap-5 md:grid-cols-2">
					<div>
						<label for="fecha_nacimiento" class="mb-2 block text-sm font-semibold text-slate-700">
							{obtenerEtiquetaFecha()} <span class="text-red-600">*</span>
						</label>
						<DatePicker
							id="fecha_nacimiento"
							name="fecha_nacimiento"
							bind:value={fechaNacimiento}
							error={intentoEnvio ? errores.fecha_nacimiento : ''}
							prefixIcon={Calendar}
							prefixIconClass="text-sky-500"
						/>
					</div>
					<p class="rounded-2xl bg-slate-50/80 p-4 text-sm text-slate-500">
						Esta fecha nos ayuda a validar la idoneidad legal y operativa de la institución en la
						red.
					</p>
				</div>

				<div class="space-y-6 rounded-2xl bg-white p-6">
					<div class="space-y-1">
						<h4 class="text-lg font-semibold text-slate-900">Tipo de institución</h4>
						<p class="text-sm text-slate-500">
							Seleccioná la categoría que mejor describe tu misión.
						</p>
					</div>

					<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
									disabled={opcion.disabled}
								/>
								<label
									for={`tipo-institucion-${opcion.value}`}
									class={`flex h-full flex-col gap-3 rounded-2xl border bg-white p-5 text-left text-sm transition ${
										opcion.disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
									} ${
										tipoInstitucionSeleccion === opcion.value
											? 'border-sky-500 shadow-[0_8px_20px_rgba(14,165,233,0.08)]'
											: 'border-slate-200 hover:border-sky-300'
									} peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-sky-200`}
								>
									<span
										class={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${
											tipoInstitucionSeleccion === opcion.value
												? 'bg-sky-50 text-sky-600'
												: 'bg-slate-50 text-slate-600'
										}`}
										aria-hidden="true"
									>
										<svelte:component this={opcion.icon} class="h-5 w-5" stroke-width={1.7} />
									</span>
									<div>
										<p class="text-base font-semibold text-slate-900">{opcion.label}</p>
										<p class="text-sm text-slate-500">{opcion.descripcion}</p>
									</div>
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
							icon={Building2}
							iconClass="text-sky-500"
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
						icon={Building2}
						iconClass="text-sky-500"
					/>
				</div>
			</section>
		{:else}
			<section
				class="space-y-8 rounded-2xl border border-slate-200 bg-white/95 px-6 py-8 shadow-sm"
			>
				<header class="space-y-2">
					<p
						class="text-xs font-semibold uppercase tracking-[0.35em] text-[rgb(var(--color-primary))]/70"
					>
						Paso 2 · Perfil de colaborador/a
					</p>
					<h3 class="text-2xl font-semibold text-slate-900">Datos personales</h3>
					<p class="text-sm text-slate-500">
						Esta información es visible para las instituciones que contactes.
					</p>
				</header>

				<FotoPerfilUploader
					id="foto"
					name="foto"
					label="Foto o avatar"
					optionalLabel="(opcional)"
					description="Mostrá quién estará en contacto con las instituciones para generar mayor confianza."
					helperText="Podés pegar un enlace o subir una imagen para personalizar tu cuenta."
					bind:url={urlFoto}
					bind:file={archivoFoto}
					error={intentoEnvio ? errores.url_foto : ''}
				/>

				<div class="grid gap-5 md:grid-cols-2">
					<CampoFormulario
						id="nombre"
						name="nombre"
						label={obtenerEtiquetaNombre()}
						required
						placeholder="Nombre"
						bind:value={nombrePersona}
						error={intentoEnvio ? errores.nombre : ''}
						disabled={procesando}
						icon={UserRound}
						iconClass="text-sky-500"
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
						icon={UserRound}
						iconClass="text-sky-500"
					/>
				</div>

				<div class="grid gap-5 md:grid-cols-2">
					<div>
						<label for="fecha_nacimiento" class="mb-2 block text-sm font-semibold text-slate-700">
							{obtenerEtiquetaFecha()} <span class="text-red-600">*</span>
						</label>
						<DatePicker
							id="fecha_nacimiento"
							name="fecha_nacimiento"
							bind:value={fechaNacimiento}
							error={intentoEnvio ? errores.fecha_nacimiento : ''}
							prefixIcon={Calendar}
							prefixIconClass="text-slate-500"
						/>
					</div>
					<p class="rounded-2xl bg-slate-50/80 p-4 text-sm text-slate-500">
						Usamos esta información únicamente para validar la edad mínima requerida por la
						plataforma.
					</p>
				</div>

				<div class="space-y-4">
					<div>
						<p class="text-sm font-semibold text-slate-800">
							Tipo de colaborador/a <span class="text-red-600">*</span>
						</p>
						<p class="text-sm text-slate-500">
							Elegí cómo vas a contribuir dentro de Conectando Corazones.
						</p>
					</div>
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
									class={`flex h-full flex-col gap-3 rounded-2xl border bg-white p-5 text-sm transition ${
										tipoColaborador === opcion.value
											? 'border-sky-500 shadow-[0_8px_20px_rgba(14,165,233,0.08)]'
											: 'border-slate-200 hover:border-sky-300'
									} cursor-pointer peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-sky-200`}
								>
									<span
										class={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${
											tipoColaborador === opcion.value
												? 'bg-sky-50 text-sky-600'
												: 'bg-slate-50 text-slate-600'
										}`}
										aria-hidden="true"
									>
										<svelte:component this={opcion.icon} class="h-5 w-5" stroke-width={1.7} />
									</span>
									<div>
										<p class="text-base font-semibold text-slate-900">{opcion.label}</p>
										<p class="text-sm text-slate-500">{opcion.descripcion}</p>
									</div>
								</label>
							</div>
						{/each}
					</div>
				</div>

				{#if tipoColaborador === 'organizacion'}
					<div class="space-y-5 rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
						<p class="text-sm font-semibold text-slate-800">Datos de la organización</p>
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
									icon={Building2}
									iconClass="text-sky-500"
								/>
							</div>

							<div class="space-y-3 md:col-span-2">
								<p class="text-sm font-semibold text-slate-800">
									¿La organización tiene fines de lucro?
									<span class="text-red-600">*</span>
								</p>
								<div class="grid gap-3 sm:grid-cols-2">
									{#each [{ value: 'true', label: 'Sí, con fines de lucro', descripcion: 'Opera como empresa o entidad mixta.', icon: Building2 }, { value: 'false', label: 'No, sin fines de lucro', descripcion: 'Asociación civil o fundación.', icon: ShieldCheck }] as opcion}
										<label
											class={`flex h-full cursor-pointer flex-col gap-2 rounded-2xl border p-4 transition ${
												conFinesDeLucroSeleccion === opcion.value
													? 'border-sky-500 bg-white shadow-sm'
													: 'border-slate-200 bg-white hover:border-sky-300'
											}`}
										>
											<input
												type="radio"
												name="con_fines_de_lucro"
												value={opcion.value}
												class="sr-only"
												bind:group={conFinesDeLucroSeleccion}
												disabled={procesando}
											/>
											<div class="flex items-center gap-3">
												<span
													class={`flex h-10 w-10 items-center justify-center rounded-xl ${
														conFinesDeLucroSeleccion === opcion.value
															? 'bg-sky-50 text-sky-600'
															: 'bg-slate-50 text-slate-500'
													}`}
													aria-hidden="true"
												>
													<svelte:component this={opcion.icon} class="h-5 w-5" stroke-width={1.7} />
												</span>
												<div>
													<p class="font-semibold text-slate-900">{opcion.label}</p>
													<p class="text-xs text-slate-500">{opcion.descripcion}</p>
												</div>
											</div>
										</label>
									{/each}
								</div>
								{#if intentoEnvio && errores.con_fines_de_lucro}
									<p class="text-sm text-red-600">{errores.con_fines_de_lucro}</p>
								{/if}
							</div>
						</div>
					</div>
				{/if}
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
				customClass="w-full rounded-xl bg-[rgb(var(--base-color))] px-8 py-3 font-semibold text-white transition hover:brightness-110 disabled:opacity-60 md:w-auto"
			/>
		</div>
	{/if}
</form>

{#if mostrarModalPassword}
	<div
		class="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/60 px-4 py-10 backdrop-blur-sm"
		aria-live="assertive"
	>
		<div
			class="w-full max-w-md rounded-3xl border border-slate-100 bg-white/95 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.25)]"
		>
			<div class=" flex items-center gap-3">
				<span class="inline-flex items-center text-[rgb(var(--color-primary))]" aria-hidden="true">
					<LockKeyhole class="h-5 w-5" stroke-width={1.6} />
				</span>
				<div class="flex-1">
					<h2 class="text-lg font-semibold text-slate-900">Reingresá tu contraseña</h2>
				</div>
			</div>
			<p class="mb-6 mt-1 text-sm text-slate-600">
				Por seguridad no almacenamos tu contraseña, te pedimos que vuelvas a ingresarla antes de
				continuar.
			</p>

			<div class="space-y-4">
				<div>
					<label for="modal_password" class="mb-1 block text-sm font-medium text-slate-700">
						Contraseña
					</label>
					<div class="relative">
						<input
							id="modal_password"
							name="modal_password"
							type={mostrarModalPasswordTexto ? 'text' : 'password'}
							class={`w-full rounded-2xl border px-4 py-3 pr-12 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary))] ${
								modalPasswordError ? 'border-red-300' : 'border-slate-200'
							}`}
							placeholder="Ingresá una contraseña segura"
							bind:value={modalPassword}
						/>
						<button
							type="button"
							class="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-200"
							on:click={() => (mostrarModalPasswordTexto = !mostrarModalPasswordTexto)}
							aria-pressed={mostrarModalPasswordTexto}
							aria-label={mostrarModalPasswordTexto ? 'Ocultar contraseña' : 'Mostrar contraseña'}
						>
							{#if mostrarModalPasswordTexto}
								<EyeOff class="h-4 w-4" stroke-width={1.7} />
							{:else}
								<Eye class="h-4 w-4" stroke-width={1.7} />
							{/if}
						</button>
					</div>
					{#if modalPasswordError}
						<p class="mt-1 text-xs text-red-600">{modalPasswordError}</p>
					{/if}
				</div>
				<div>
					<label for="modal_password_confirm" class="mb-1 block text-sm font-medium text-slate-700">
						Confirmar contraseña
					</label>
					<div class="relative">
						<input
							id="modal_password_confirm"
							name="modal_password_confirm"
							type={mostrarModalPasswordConfirmTexto ? 'text' : 'password'}
							class={`w-full rounded-2xl border px-4 py-3 pr-12 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary))] ${
								modalPasswordConfirmError ? 'border-red-300' : 'border-slate-200'
							}`}
							placeholder="Repetí la contraseña"
							bind:value={modalPasswordConfirm}
						/>
						<button
							type="button"
							class="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-200"
							on:click={() =>
								(mostrarModalPasswordConfirmTexto = !mostrarModalPasswordConfirmTexto)}
							aria-pressed={mostrarModalPasswordConfirmTexto}
							aria-label={mostrarModalPasswordConfirmTexto
								? 'Ocultar confirmación de contraseña'
								: 'Mostrar confirmación de contraseña'}
						>
							{#if mostrarModalPasswordConfirmTexto}
								<EyeOff class="h-4 w-4" stroke-width={1.7} />
							{:else}
								<Eye class="h-4 w-4" stroke-width={1.7} />
							{/if}
						</button>
					</div>
					{#if modalPasswordConfirmError}
						<p class="mt-1 text-xs text-red-600">{modalPasswordConfirmError}</p>
					{/if}
				</div>
			</div>

			<div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
				<Button
					type="button"
					label="Volver a credenciales"
					variant="secondary"
					size="sm"
					customClass="w-full sm:w-auto"
					on:click={() => cerrarModalPassword({ regresarACredenciales: true })}
				/>
				<Button
					type="button"
					label="Guardar y continuar"
					variant="primary"
					size="sm"
					customClass="w-full sm:w-auto"
					on:click={confirmarModalPassword}
				/>
			</div>
		</div>
	</div>
{/if}
