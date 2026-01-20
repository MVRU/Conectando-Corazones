<script lang="ts">
	import { onMount } from 'svelte';
	import RegistroCuentaForm from '$lib/components/feature/registro/RegistroCuentaForm.svelte';
	import RolCard from '$lib/components/feature/registro/RolCard.svelte';
	import Loader from '$lib/components/feedback/Loader.svelte';
	import { setBreadcrumbs, BREADCRUMB_ROUTES } from '$lib/stores/breadcrumbs';
	import Stepper from '$lib/components/ui/Stepper.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	// import ValidacionRenaper from '$lib/components/validaciones/ValidacionRenaper.svelte';
	// import ValidacionEmail from '$lib/components/validaciones/ValidacionEmail.svelte';
	import ValidacionInstitucion from '$lib/components/validaciones/ValidacionInstitucion.svelte';
	import DireccionForm from '$lib/components/forms/DireccionForm.svelte';
	import MetodosContactoForm from '$lib/components/forms/MetodosContactoForm.svelte';
	import { goto } from '$app/navigation';
	import { fly, fade } from 'svelte/transition';
	import type { RegistroCuentaSubmitDetail } from '$lib/domain/types/forms/registro';
	import { authActions, isAuthenticated } from '$lib/stores/auth';
	import {
		obtenerSiguienteEtapaCuenta,
		type RegistroEtapa,
		type RegistroRol
	} from '$lib/services/auth/registration-flow';
	import {
		mapearFormularioColaboradorAInputRegistro,
		mapearFormularioInstitucionAInputRegistro
	} from '$lib/services/auth/registration.mapper';
	import {
		REGISTRO_STORAGE_KEY,
		REGISTRO_PAGE_STORAGE_KEY,
		REGISTRO_STORAGE_TTL_MS,
		REGISTRO_STORAGE_VERSION
	} from '$lib/constants/registro';
	import { toastStore } from '$lib/stores/toast';

	let cargada = false; // para saber si la página terminó de cargar	

	const TOTAL_PASOS = 5;
	let etapa: RegistroEtapa = 'seleccion';

	let rol: RegistroRol = 'institucion';
	let registrando = false;
	let errorRegistro: string | null = null;

	type RegistroPageSnapshot = {
		version: number;
		timestamp: number;
		etapa: RegistroEtapa;
		rol: RegistroRol;
	};

	let storageRegistroDisponible = false;
	let persistenciaPaginaLista = false;
	let notificacionEtapaMostrada = false;

	$: procesandoFormulario = registrando;

	$: if ($isAuthenticated) {
		if (typeof window !== 'undefined') {
			toastStore.show({
				variant: 'info',
				message: 'Ya iniciaste sesión. Te redirigimos a tu panel.'
			});
			goto('/mi-panel');
		}
	}

	onMount(() => {
		setBreadcrumbs([BREADCRUMB_ROUTES.home, { label: 'Registro' }]);
		if (typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined') {
			storageRegistroDisponible = true;
			const snapshot = leerProgresoRegistro();
			if (snapshot) {
				rol = snapshot.rol;
				etapa = snapshot.etapa;
				guardarProgresoRegistro({
					...snapshot,
					timestamp: Date.now()
				});
			}
			persistenciaPaginaLista = true;
		}
		cargada = true;
	});

	function resetFeedback() {
		errorRegistro = null;
	}

	function elegir(r: RegistroRol) {
		rol = r;
		resetFeedback();
		setEtapaConPersistencia('formulario', { limpiarFormulario: true });
	}

	function manejarError(error: unknown, fallback: string): string {
		if (error instanceof Error) {
			const mensaje = error.message?.trim();
			if (mensaje) {
				return mensaje;
			}
		}
		return fallback;
	}

	async function manejarRegistroCuenta(event: CustomEvent<RegistroCuentaSubmitDetail>) {
		if (procesandoFormulario) {
			return;
		}
		resetFeedback();

		const detalle = event.detail;
		rol = detalle.rol;

		registrando = true;
		try {
			if (detalle.rol === 'colaborador') {
				const mapping = mapearFormularioColaboradorAInputRegistro(detalle);
				await authActions.registerColaborador(mapping.input);
			} else {
				const mapping = mapearFormularioInstitucionAInputRegistro(detalle);
				await authActions.registerInstitucion(mapping.input);
			}
			const siguienteEtapa = obtenerSiguienteEtapaCuenta(detalle.rol);
			setEtapaConPersistencia(siguienteEtapa, { limpiarFormulario: true });
		} catch (error) {
			errorRegistro = manejarError(
				error,
				'No pudimos completar el registro. Intentá nuevamente en unos instantes.'
			);
		} finally {
			registrando = false;
		}
	}

	function manejarFormularioInvalido() {
		errorRegistro = 'Revisá los campos marcados en rojo antes de continuar.';
	}

	function volverASeleccion() {
		resetFeedback();
		setEtapaConPersistencia('seleccion');
	}

	function obtenerEtapaAnterior(actual: RegistroEtapa): RegistroEtapa | null {
		switch (actual) {
			case 'formulario':
				return 'seleccion';
			case 'verificacion':
				return 'formulario';
			case 'contacto':
				return rol === 'institucion' ? 'verificacion' : 'formulario';
			case 'direccion':
				return 'contacto';
			case 'exito':
				return 'direccion';
			default:
				return null;
		}
	}

	function retrocederEtapa(actual: RegistroEtapa) {
		const anterior = obtenerEtapaAnterior(actual);
		if (!anterior) {
			return;
		}
		resetFeedback();
		setEtapaConPersistencia(anterior);
	}

	function leerProgresoRegistro(): RegistroPageSnapshot | null {
		if (!storageRegistroDisponible) {
			return null;
		}
		try {
			const raw = window.sessionStorage.getItem(REGISTRO_PAGE_STORAGE_KEY);
			if (!raw) {
				return null;
			}
			const snapshot = JSON.parse(raw) as RegistroPageSnapshot;
			if (!snapshot || snapshot.version !== REGISTRO_STORAGE_VERSION) {
				window.sessionStorage.removeItem(REGISTRO_PAGE_STORAGE_KEY);
				return null;
			}
			if (Date.now() - snapshot.timestamp > REGISTRO_STORAGE_TTL_MS) {
				window.sessionStorage.removeItem(REGISTRO_PAGE_STORAGE_KEY);
				return null;
			}
			return snapshot;
		} catch (error) {
			console.warn('No se pudo recuperar el progreso del registro', error);
			window.sessionStorage.removeItem(REGISTRO_PAGE_STORAGE_KEY);
			return null;
		}
	}

	function guardarProgresoRegistro(snapshot: RegistroPageSnapshot) {
		if (!storageRegistroDisponible) {
			return;
		}
		try {
			window.sessionStorage.setItem(REGISTRO_PAGE_STORAGE_KEY, JSON.stringify(snapshot));
		} catch (error) {
			console.warn('No se pudo guardar el progreso del registro', error);
		}
	}

	function limpiarProgresoRegistro() {
		if (!storageRegistroDisponible) {
			return;
		}
		window.sessionStorage.removeItem(REGISTRO_PAGE_STORAGE_KEY);
	}

	function limpiarFormularioPersistido() {
		if (!storageRegistroDisponible) {
			return;
		}
		window.sessionStorage.removeItem(REGISTRO_STORAGE_KEY);
	}

	function limpiarProgresoTotal() {
		limpiarProgresoRegistro();
		limpiarFormularioPersistido();
	}

	function setEtapaConPersistencia(
		nueva: RegistroEtapa,
		opciones: { limpiarFormulario?: boolean; limpiarTodo?: boolean } = {}
	) {
		etapa = nueva;

		if (!storageRegistroDisponible || !persistenciaPaginaLista) {
			if (opciones.limpiarTodo) {
				limpiarProgresoTotal();
			} else if (opciones.limpiarFormulario) {
				limpiarFormularioPersistido();
			}
			return;
		}

		if (opciones.limpiarTodo || nueva === 'exito') {
			limpiarProgresoTotal();
			notificacionEtapaMostrada = false;
			return;
		}

		if (nueva === 'seleccion') {
			limpiarProgresoRegistro();
			if (opciones.limpiarFormulario ?? true) {
				limpiarFormularioPersistido();
			}
			notificacionEtapaMostrada = false;
			return;
		}

		if (opciones.limpiarFormulario) {
			limpiarFormularioPersistido();
		}

		guardarProgresoRegistro({
			version: REGISTRO_STORAGE_VERSION,
			timestamp: Date.now(),
			rol,
			etapa: nueva
		});
		notificarProgresoGuardado();
	}

	function notificarProgresoGuardado() {
		if (notificacionEtapaMostrada || !storageRegistroDisponible) {
			return;
		}
		notificacionEtapaMostrada = true;
		toastStore.show({
			variant: 'info',
			title: 'Progreso asegurado',
			message:
				'Recordamos el paso del registro en este dispositivo. Si necesitas salir, podrás retomar desde donde quedaste.'
		});
	}

	function obtenerEtiquetaRetroceso(actual: RegistroEtapa): string {
		switch (actual) {
			case 'contacto':
				return rol === 'institucion'
					? 'Volver a validación de institución'
					: 'Volver a credenciales';
			case 'direccion':
				return 'Volver a formas de contacto';
			default:
				return 'Volver al paso anterior';
		}
	}
</script>

<svelte:head>
	<title>Registrarse - Conectando Corazones</title>
	<meta
		name="description"
		content="Creá tu cuenta para comenzar a colaborar o publicar proyectos solidarios."
	/>
</svelte:head>

<!-- ! Fondo decorativo -->
<div class="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
<div
	class="absolute bottom-0 left-0 right-0 top-[80%] -z-10 bg-gradient-to-t from-blue-50 via-white to-transparent"
	style="background-size: 100% 400px; background-repeat: repeat-y;"
></div>

<main class="relative z-10 mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
	<section class="transition-all duration-300 sm:p-12">
		{#if etapa === 'seleccion'}
			<div in:fly={{ y: 20, opacity: 0, duration: 400 }} out:fade={{ duration: 200 }}>
				<div class="mb-20">
					<Stepper pasoActual={1} pasosTotales={TOTAL_PASOS} />
				</div>
				<h1 class="mb-4 text-center text-3xl font-bold text-gray-900 sm:text-4xl">
					<span class="block">Unite a</span>
					<span
						class="mt-1 block bg-gradient-to-r from-[rgb(var(--color-primary))] via-blue-400 to-[rgb(var(--color-primary))] bg-clip-text text-transparent"
					>
						Conectando Corazones
					</span>
				</h1>
				<p class="mx-auto mb-10 max-w-2xl text-center text-lg text-gray-600">
					Creá tu cuenta para publicar proyectos solidarios o sumarte como colaborador. Juntos,
					hacemos la diferencia.
				</p>
				<p class="mb-8 text-center text-base font-medium text-gray-700">
					¿Cómo querés registrarte?
				</p>

				<div class="grid gap-8 sm:grid-cols-2">
					<RolCard
						titulo="Soy una institución"
						descripcion="Quiero publicar, administrar y visibilizar proyectos solidarios para recibir ayuda."
						icono="institucion"
						onSelect={() => elegir('institucion')}
					/>
					<RolCard
						titulo="Soy colaborador/a"
						descripcion="Quiero ayudar o participar en proyectos como organización o entidad unipersonal."
						icono="colaborador"
						onSelect={() => elegir('colaborador')}
					/>
				</div>

				<p class="mt-6 text-center text-sm text-gray-500">
					Si sos una organización —con o sin fines de lucro—, seleccioná
					<span class="font-bold text-[rgb(var(--color-primary))]">"Colaborador/a"</span> para ayudar
					a las instituciones.
				</p>
			</div>
		{:else if etapa === 'formulario'}
			<div class="mb-20">
				<Stepper pasoActual={2} pasosTotales={TOTAL_PASOS} />
			</div>
			<button
				class="group mb-6 flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
				type="button"
				on:click={volverASeleccion}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4 transition-transform group-hover:-translate-x-1"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
				Volver a elegir tipo de cuenta
			</button>

			<RegistroCuentaForm
				{rol}
				procesando={procesandoFormulario}
				errorGeneral={errorRegistro}
				on:submit={manejarRegistroCuenta}
				on:invalid={manejarFormularioInvalido}
				on:back={() => retrocederEtapa('formulario')}
			/>
		{:else if etapa === 'verificacion'}
			<ValidacionInstitucion
				pasoActual={3}
				pasosTotales={TOTAL_PASOS}
				on:submit={() => setEtapaConPersistencia('contacto')}
				on:skip={() => setEtapaConPersistencia('contacto')}
				on:cancel={() => {
					resetFeedback();
					setEtapaConPersistencia('formulario');
				}}
			/>
		{:else if etapa === 'contacto'}
			<div class="mb-8">
				<Stepper pasoActual={4} pasosTotales={TOTAL_PASOS} />
				<button
					type="button"
					class="group mt-4 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
					on:click={() => retrocederEtapa('contacto')}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4 transition-transform group-hover:-translate-x-1"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
					{obtenerEtiquetaRetroceso('contacto')}
				</button>
			</div>

			<main class="relative z-10 mx-auto max-w-4xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
				<h2 class="text-center text-3xl font-extrabold text-gray-900">
					Agregá formas de contacto
				</h2>
				<p class="mx-auto max-w-2xl text-center text-base text-gray-600">
					Agregá al menos un número de teléfono. Podés incluir otros medios como redes
					sociales o emails secundarios.
				</p>

				<MetodosContactoForm
					mostrarOmitir
					bloquearPrimerContacto={false}
					on:skip={() => setEtapaConPersistencia('direccion')}
					on:submit={() => setEtapaConPersistencia('direccion')}
				/>
			</main>
		{:else if etapa === 'direccion'}
			<div class="mb-8">
				<Stepper pasoActual={5} pasosTotales={TOTAL_PASOS} />
				<button
					type="button"
					class="group mt-4 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
					on:click={() => retrocederEtapa('direccion')}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4 transition-transform group-hover:-translate-x-1"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
					{obtenerEtiquetaRetroceso('direccion')}
				</button>
			</div>

			<div class="mx-auto max-w-4xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
				<div class="text-center">
					<h2 class="mb-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
						Contanos desde dónde ayudás
					</h2>
					<p class="mx-auto mt-3 max-w-2xl text-lg text-gray-600">
						Seleccioná la provincia y localidad donde funciona tu organización o donde te
						encontrás para colaborar. Esta información nos ayuda a conectarte con iniciativas
						cercanas. Podrás sumar más ubicaciones luego desde tu panel.
					</p>
				</div>

				<DireccionForm
					mostrarOmitir
					on:skip={() => setEtapaConPersistencia('exito', { limpiarTodo: true })}
					on:submit={() => setEtapaConPersistencia('exito', { limpiarTodo: true })}
				/>
			</div>
		{:else if etapa === 'exito'}
			<div class="mb-20">
				<Stepper pasoActual={TOTAL_PASOS + 1} pasosTotales={TOTAL_PASOS} />
			</div>

			<div class="flex min-h-[60vh] flex-col items-center justify-center text-center">
				<div class="animate-pulse rounded-full bg-green-100 p-6 shadow-xl">
					<svg
						class="h-20 w-20 text-green-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 13l4 4L19 7"
						/>
					</svg>
				</div>
				<h2 class="mt-8 text-4xl font-extrabold text-gray-800">¡Cuenta creada exitosamente!</h2>
				<p class="mt-4 max-w-md text-base text-gray-600">
					Tu registro está completo. Ya podés acceder a tu cuenta y empezar a colaborar o
					publicar tus proyectos solidarios.
				</p>
				<div class="mt-8">
					<Button label="Ir al panel" variant="primary" on:click={() => goto('/mi-panel')} />
				</div>
			</div>
		{/if}
	</section>

	<Loader size={80} loading={!cargada} />
</main>
