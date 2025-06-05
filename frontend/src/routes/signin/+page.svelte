<!--
* Página: Signin
        -*- Descripción: permite crear cuentas para instituciones o colaboradores.
        -*- Dependiendo del rol seleccionado se muestra un formulario u otro.
-->
<script lang="ts">
        import { onMount } from 'svelte';
        import InstitutionForm from '$lib/components/forms/InstitutionForm.svelte';
        import CollaboratorForm from '$lib/components/forms/CollaboratorForm.svelte';
        import Loader from '$lib/components/feedback/Loader.svelte';
        import { setBreadcrumbs, BREADCRUMB_ROUTES } from '$lib/stores/breadcrumbs';

        let ready = false;
        let rol: 'institucion' | 'colaborador' = 'institucion';

        onMount(() => {
                setBreadcrumbs([BREADCRUMB_ROUTES.home, { label: 'Registro' }]);
                ready = true;
        });
</script>

<svelte:head>
        <title>Registrarse - Conectando Corazones</title>
        <meta name="description" content="Creá tu cuenta para comenzar a colaborar o publicar proyectos solidarios." />
</svelte:head>

<main class="relative mx-auto max-w-3xl space-y-6 px-8 py-10">
        <h2 class="mb-4 text-3xl font-semibold text-[rgb(var(--base-color))]">Registrarse</h2>

        <div class="mb-6 flex gap-4">
                <label class="flex items-center gap-2">
                        <input type="radio" name="rol" value="institucion" bind:group={rol} class="h-4 w-4" />
                        <span>Institución</span>
                </label>
                <label class="flex items-center gap-2">
                        <input type="radio" name="rol" value="colaborador" bind:group={rol} class="h-4 w-4" />
                        <span>Colaborador</span>
                </label>
        </div>

        {#if ready}
                {#if rol === 'institucion'}
                        <InstitutionForm />
                {:else}
                        <CollaboratorForm />
                {/if}
        {/if}

        <Loader size={80} loading={!ready} />
</main>
