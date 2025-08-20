<!-- TODOs:
	- [ ] Corregir atributos cuando se resuelvan las inconsistencias con el DER 
 	- [ ] Ver si es posible combinar ambos forms y corregir las validaciones de entrada para que aparezcan solo cuando los campos tienen touched=true -->

<script lang="ts">
	import { onMount } from 'svelte';
	import InstitucionForm from '$lib/components/registro/InstitucionForm.svelte';
	import ColaboradorForm from '$lib/components/registro/ColaboradorForm.svelte';
	import RolCard from '$lib/components/registro/RolCard.svelte';
	import Loader from '$lib/components/feedback/Loader.svelte';
	import { setBreadcrumbs, BREADCRUMB_ROUTES } from '$lib/stores/breadcrumbs';
	import Stepper from '$lib/components/ui/Stepper.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import ValidacionRenaper from '$lib/components/validaciones/ValidacionRenaper.svelte';
	import ValidacionEmail from '$lib/components/validaciones/ValidacionEmail.svelte';
	import DireccionForm from '$lib/components/forms/DireccionForm.svelte';
	import MetodosContactoForm from '$lib/components/forms/MetodosContactoForm.svelte';
	import { goto } from '$app/navigation';
	import { fly, fade } from 'svelte/transition';

	let cargada = false; // para saber si la página terminó de cargar
	let etapa:
		| 'select'
		| 'form'
		| 'verificando'
		| 'email'
		| 'verificado'
		| 'direccion'
		| 'contacto'
		| 'exito'
		| 'error' = 'select';

	let rol: 'institucion' | 'colaborador' = 'institucion';

	onMount(() => {
		setBreadcrumbs([BREADCRUMB_ROUTES.home, { label: 'Registro' }]);
		cargada = true;
	});

	function elegir(r: 'institucion' | 'colaborador') {
		rol = r;
		etapa = 'form';
	}

	/**
	 * ! Los colaboradores no necesitan verificar su identidad con RENAPER, así que saltamos directamente al email
	 * */
	function onFormSubmit() {
		etapa = rol === 'colaborador' ? 'email' : 'verificando';
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
					<Stepper current={1} total={5} />
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
				<Stepper current={2} total={5} />
			</div>
			<button
				class="group mb-6 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
				type="button"
				on:click={() => (etapa = 'select')}
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

			{#if rol === 'institucion'}
				<InstitucionForm on:submit={onFormSubmit} />
			{:else}
				<ColaboradorForm on:submit={onFormSubmit} />
			{/if}
		{:else if etapa === 'verificando'}
			<ValidacionRenaper
				pasoActual={3}
				pasosTotales={5}
				on:success={() => (etapa = 'email')}
				on:retry={() => (etapa = 'verificando')}
				on:back={() => (etapa = 'form')}
			/>
		{:else if etapa === 'email'}
			<ValidacionEmail
				pasoActual={4}
				pasosTotales={5}
				on:continue={() => (etapa = 'verificado')}
				on:back={() => (etapa = 'form')}
			/>
		{:else if etapa === 'verificado'}
			<div class="mb-20">
				<Stepper current={5} total={5} />
			</div>
			<div class="flex min-h-[60vh] flex-col items-center justify-center text-center">
				<div class="rounded-full bg-green-100 p-4 shadow-xl">
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
				<h2 class="mt-8 text-4xl font-extrabold text-gray-800">¡Identidad verificada!</h2>
				<p class="mt-4 max-w-xs text-base text-gray-600">
					Tu identidad ha sido validada correctamente. Ahora necesitamos que agregues algún medio de
					contacto y la dirección de tu sede para completar el registro.
				</p>
				<div class="mt-8">
					<Button label="Continuar" variant="primary" on:click={() => (etapa = 'contacto')} />
				</div>
			</div>
		{:else if etapa === 'contacto'}
			<div class="mb-20">
				<Stepper current={5} total={5} />
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
				<Stepper current={5} total={5} />
			</div>

			<div class="mx-auto max-w-4xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
				<div class="text-center">
					<h2 class="mb-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
						Ingresá la dirección de la sede
					</h2>
					<p class="mx-auto mt-3 max-w-2xl text-lg text-gray-600">
						Completá con la dirección principal donde funciona la institución u organización. Más
						adelante podrás agregar otras direcciones si lo preferís.
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
				<Stepper current={6} total={5} />
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
					<Button
						label="Ir al Dashboard"
						variant="primary"
						on:click={() => goto('/mis-proyectos')}
					/>
				</div>
			</div>
		{/if}
	</section>

	<Loader size={80} loading={!cargada} />
</main>
