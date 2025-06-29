<!-- TODO: ver si es posible combinar ambos forms y corregir las validaciones de entrada para que aparezcan solo cuando los campos tienen touched=true -->

<script lang="ts">
	import { onMount } from 'svelte';
	import InstitutionForm from '$lib/components/forms/InstitutionForm.svelte';
	import CollaboratorForm from '$lib/components/forms/CollaboratorForm.svelte';
	import RoleCard from '$lib/components/auth/RoleCard.svelte';
	import Loader from '$lib/components/feedback/Loader.svelte';
	import { setBreadcrumbs, BREADCRUMB_ROUTES } from '$lib/stores/breadcrumbs';
	import Stepper from '$lib/components/ui/Stepper.svelte';
	import Button from '$lib/components/ui/elements/Button.svelte';
	import ArcaValidation from '$lib/components/validation/ArcaValidation.svelte';
	import EmailValidation from '$lib/components/validation/EmailValidation.svelte';
	import AddressForm from '$lib/components/forms/AddressForm.svelte';
	import ContactMethodsForm from '$lib/components/forms/ContactMethodsForm.svelte';
	import { goto } from '$app/navigation';
	import { fly, fade } from 'svelte/transition';

	let ready = false;
	let stage:
		| 'select'
		| 'form'
		| 'verifying'
		| 'email'
		| 'verified'
		| 'address'
		| 'contact'
		| 'success'
		| 'error' = 'select';

	let rol: 'institucion' | 'colaborador' = 'institucion';

	onMount(() => {
		setBreadcrumbs([BREADCRUMB_ROUTES.home, { label: 'Registro' }]);
		ready = true;
	});

	function choose(r: 'institucion' | 'colaborador') {
		rol = r;
		stage = 'form';
	}

	function onFormSubmit() {
		stage = 'verifying';
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
		{#if stage === 'select'}
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
					<RoleCard
						title="Soy una institución"
						description="Quiero publicar, administrar y visibilizar proyectos solidarios para recibir ayuda."
						icon="institution"
						onSelect={() => choose('institucion')}
					/>
					<RoleCard
						title="Soy colaborador/a"
						description="Quiero ayudar o participar en proyectos como organización o entidad unipersonal."
						icon="collaborator"
						onSelect={() => choose('colaborador')}
					/>
				</div>

				<p class="mt-6 text-center text-sm text-gray-500">
					Si sos una organización —con o sin fines de lucro—, seleccioná
					<span class="font-bold text-[rgb(var(--color-primary))]">"Colaborador/a"</span> para ayudar
					a las instituciones.
				</p>
			</div>
		{:else if stage === 'form'}
			<div class="mb-20">
				<Stepper current={2} total={5} />
			</div>
			<button
				class="group mb-6 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
				type="button"
				on:click={() => (stage = 'select')}
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
				<InstitutionForm on:submit={onFormSubmit} />
			{:else}
				<CollaboratorForm on:submit={onFormSubmit} />
			{/if}
		{:else if stage === 'verifying'}
			<ArcaValidation
				currentStep={3}
				totalSteps={5}
				on:success={() => (stage = 'email')}
				on:retry={() => (stage = 'verifying')}
				on:back={() => (stage = 'form')}
			/>
		{:else if stage === 'email'}
			<EmailValidation
				currentStep={4}
				totalSteps={5}
				on:continue={() => (stage = 'verified')}
				on:back={() => (stage = 'form')}
			/>
		{:else if stage === 'verified'}
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
					<Button label="Continuar" variant="primary" on:click={() => (stage = 'contact')} />
				</div>
			</div>
		{:else if stage === 'contact'}
			<div class="mb-20">
				<Stepper current={5} total={5} />
			</div>

			<main class="relative z-10 mx-auto max-w-4xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
				<h2 class="text-center text-3xl font-extrabold text-gray-900">Agregá formas de contacto</h2>
				<p class="mx-auto max-w-2xl text-center text-base text-gray-600">
					Agregá al menos un número de teléfono. Podés incluir otros medios como redes sociales o
					emails secundarios.
				</p>

				<ContactMethodsForm on:submit={() => (stage = 'address')} />
			</main>
		{:else if stage === 'address'}
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

				<AddressForm on:submit={() => (stage = 'success')} />
			</div>
		{:else if stage === 'success'}
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
					<Button label="Ir al Dashboard" variant="primary" on:click={() => goto('/dashboard')} />
				</div>
			</div>
		{/if}
	</section>

	<Loader size={80} loading={!ready} />
</main>
