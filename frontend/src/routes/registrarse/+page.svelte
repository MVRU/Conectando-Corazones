<!-- TODOs:
 	- [ ] Ver si es posible combinar ambos forms y corregir las validaciones de entrada para que aparezcan solo cuando los campos tienen touched=true
        - [ ] Agregar registro con proveedores federados: Google, Facebook, etc., cuando auth lo soporte
         -->

<!-- * DECISIÓN DE DISEÑO: Este contenedor coordina formularios, autenticación y pasos del onboarding manteniendo la lógica de dominio fuera de los componentes de UI. -->
<script lang="ts">
	import { onMount } from 'svelte';
	import InstitucionForm from '$lib/components/registro/InstitucionForm.svelte';
	import ColaboradorForm from '$lib/components/registro/ColaboradorForm.svelte';
	import RolCard from '$lib/components/registro/RolCard.svelte';
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
	import type { Contacto } from '$lib/types/Contacto';
	import type {
		ColaboradorFormSubmitDetail,
		InstitucionFormSubmitDetail
	} from '$lib/types/forms/registro';
	import { authActions } from '$lib/stores/auth';
	import {
		mapColaboradorFormToRegisterInput,
		mapInstitucionFormToRegisterInput
	} from '$lib/services/auth/registration.mapper';

	let cargada = false; // para saber si la página terminó de cargar

	const TOTAL_PASOS = 5;
	let etapa:
		| 'select'
		| 'form'
		| 'verificando'
		| 'verificado'
		| 'contacto'
		| 'direccion'
		| 'exito'
		| 'error' = 'select';

	let rol: 'institucion' | 'colaborador' = 'institucion';
	let registrando = false;
	let autenticandoProveedor = false;
	let errorRegistro: string | null = null;

	$: procesandoFormulario = registrando || autenticandoProveedor;

	onMount(() => {
		setBreadcrumbs([BREADCRUMB_ROUTES.home, { label: 'Registro' }]);
		cargada = true;
	});

	function resetFeedback() {
		errorRegistro = null;
	}

	function elegir(r: 'institucion' | 'colaborador') {
		rol = r;
		resetFeedback();
		etapa = 'form';
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

	async function registrarColaborador(event: CustomEvent<ColaboradorFormSubmitDetail>) {
		if (procesandoFormulario) {
			return;
		}
		resetFeedback();
		let mapping;
		try {
			mapping = mapColaboradorFormToRegisterInput(event.detail);
		} catch (error) {
			errorRegistro = manejarError(error, 'Revisá los datos ingresados antes de continuar.');
			return;
		}

		registrando = true;
		try {
			await authActions.registerColaborador(mapping.input);
			etapa = 'verificado';
		} catch (error) {
			errorRegistro = manejarError(
				error,
				'No pudimos completar el registro. Intentá nuevamente en unos instantes.'
			);
		} finally {
			registrando = false;
		}
	}

	async function registrarInstitucion(event: CustomEvent<InstitucionFormSubmitDetail>) {
		if (procesandoFormulario) {
			return;
		}
		resetFeedback();
		let mapping;
		try {
			mapping = mapInstitucionFormToRegisterInput(event.detail);
		} catch (error) {
			errorRegistro = manejarError(error, 'Revisá los datos ingresados antes de continuar.');
			return;
		}

		registrando = true;
		try {
			await authActions.registerInstitucion(mapping.input);
			etapa = 'verificando';
		} catch (error) {
			errorRegistro = manejarError(
				error,
				'No pudimos completar el registro. Intentá nuevamente en unos instantes.'
			);
		} finally {
			registrando = false;
		}
	}

	async function handleGoogleSignIn() {
		if (procesandoFormulario) {
			return;
		}
		resetFeedback();
		autenticandoProveedor = true;
		try {
			await authActions.signInWithGoogle(rol);
			etapa = 'verificado';
		} catch (error) {
			errorRegistro = manejarError(
				error,
				'No pudimos iniciar sesión con Google. Intentá nuevamente.'
			);
		} finally {
			autenticandoProveedor = false;
		}
	}

	function volverASeleccion() {
		resetFeedback();
		etapa = 'select';
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
		{#if etapa === 'select'}
			<div in:fly={{ y: 20, opacity: 0, duration: 400 }} out:fade={{ duration: 200 }}>
				<div class="mb-20">
					<Stepper current={1} total={TOTAL_PASOS} />
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
		{:else if etapa === 'form'}
			<div class="mb-20">
				<Stepper current={2} total={TOTAL_PASOS} />
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

			<div
				class="mb-10 flex flex-col gap-4 rounded-2xl border border-blue-100 bg-white/80 p-4 text-center shadow-sm sm:flex-row sm:items-center sm:justify-between sm:text-left"
			>
				<p class="text-sm text-gray-600">
					También podés crear tu cuenta usando tu perfil de Google para acelerar el proceso.
				</p>
				<Button
					type="button"
					variant="secondary"
					label={autenticandoProveedor ? 'Conectando...' : 'Continuar con Google'}
					loading={autenticandoProveedor}
					disabled={registrando}
					on:click={handleGoogleSignIn}
					customAriaLabel="Registrarme utilizando Google"
					customClass="w-full sm:w-auto"
				/>
			</div>

			{#if rol === 'institucion'}
				<InstitucionForm
					on:submit={registrarInstitucion}
					procesando={procesandoFormulario}
					errorGeneral={errorRegistro}
				/>
			{:else}
				<ColaboradorForm
					on:submit={registrarColaborador}
					procesando={procesandoFormulario}
					errorGeneral={errorRegistro}
				/>
			{/if}
		{:else if etapa === 'verificando'}
			<ValidacionInstitucion
				pasoActual={3}
				pasosTotales={TOTAL_PASOS}
				on:submit={() => (etapa = 'contacto')}
				on:skip={() => (etapa = 'contacto')}
				on:cancel={() => {
					resetFeedback();
					etapa = 'form';
				}}
			/>
		{:else if etapa === 'verificado'}
			<div class="mb-20">
				<Stepper current={3} total={TOTAL_PASOS} />
			</div>
		{:else if etapa === 'contacto'}
			<div class="mb-20">
				<Stepper current={4} total={TOTAL_PASOS} />
			</div>

			<main class="relative z-10 mx-auto max-w-4xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
				<h2 class="text-center text-3xl font-extrabold text-gray-900">Agregá formas de contacto</h2>
				<p class="mx-auto max-w-2xl text-center text-base text-gray-600">
					Agregá al menos un número de teléfono. Podés incluir otros medios como redes sociales o
					emails secundarios.
				</p>

				<MetodosContactoForm
					mostrarOmitir
					on:skip={() => (etapa = 'direccion')}
					on:submit={() => (etapa = 'direccion')}
				/>
			</main>
		{:else if etapa === 'direccion'}
			<div class="mb-20">
				<Stepper current={5} total={TOTAL_PASOS} />
			</div>

			<div class="mx-auto max-w-4xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
				<div class="text-center">
					<h2 class="mb-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
						Contanos desde dónde ayudás
					</h2>
					<p class="mx-auto mt-3 max-w-2xl text-lg text-gray-600">
						Seleccioná la provincia y localidad donde funciona tu institución u organización. Esto
						nos ayuda a mostrarte proyectos y colaboradores cercanos. Más adelante podrás agregar
						otras sedes si lo necesitás.
					</p>
				</div>

				<DireccionForm
					mostrarOmitir
					on:skip={() => (etapa = 'exito')}
					on:submit={() => (etapa = 'exito')}
				/>
			</div>
		{:else if etapa === 'exito'}
			<div class="mb-20">
				<Stepper current={TOTAL_PASOS + 1} total={TOTAL_PASOS} />
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
					Tu registro está completo. Ya podés acceder a tu cuenta y empezar a colaborar o publicar
					tus proyectos solidarios.
				</p>
				<div class="mt-8">
					<!-- TODO: agregar dashboard u otro -->
					<Button label="Ir al panel" variant="primary" on:click={() => goto('/mi-panel')} />
				</div>
			</div>
		{/if}
	</section>

	<Loader size={80} loading={!cargada} />
</main>
