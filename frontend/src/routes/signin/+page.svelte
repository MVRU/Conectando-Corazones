<!--
* Página: Signin
        -*- Descripción: permite crear cuentas para instituciones o colaboradores.
        -*- Dependiendo del rol seleccionado se muestra un formulario u otro.
-->
<script lang="ts">
        import { onMount } from 'svelte';
import InstitutionForm from '$lib/components/forms/InstitutionForm.svelte';
import CollaboratorForm from '$lib/components/forms/CollaboratorForm.svelte';
import RoleCard from '$lib/components/auth/RoleCard.svelte';
import Loader from '$lib/components/feedback/Loader.svelte';
import { setBreadcrumbs, BREADCRUMB_ROUTES } from '$lib/stores/breadcrumbs';

       let ready = false;
       let stage: 'select' | 'form' = 'select';
       let rol: 'institucion' | 'colaborador' = 'institucion';

       onMount(() => {
               setBreadcrumbs([BREADCRUMB_ROUTES.home, { label: 'Registro' }]);
               ready = true;
       });

       function choose(r: 'institucion' | 'colaborador') {
               rol = r;
               stage = 'form';
       }
</script>

<svelte:head>
        <title>Registrarse - Conectando Corazones</title>
        <meta name="description" content="Creá tu cuenta para comenzar a colaborar o publicar proyectos solidarios." />
</svelte:head>

<main class="relative mx-auto max-w-3xl space-y-6 px-8 py-10">
        <h2 class="mb-4 text-3xl font-semibold text-[rgb(var(--base-color))]">Registrarse</h2>

       {#if stage === 'select'}
               <p class="mb-4 text-gray-600">Elegí cómo registrarte para continuar:</p>
               <div class="grid gap-6 sm:grid-cols-2">
                       <RoleCard
                               title="Institución"
                               description="Publicá y administrá proyectos solidarios."
                               icon="institution"
                               on:select={() => choose('institucion')}
                       />
                       <RoleCard
                               title="Colaborador"
                               description="Sumate a proyectos como persona u organización."
                               icon="collaborator"
                               on:select={() => choose('colaborador')}
                       />
               </div>
       {:else if ready}
               <button
                       class="mb-4 text-sm text-blue-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                       type="button"
                       on:click={() => (stage = 'select')}
               >
                       &larr; Elegir otro tipo
               </button>
               {#if rol === 'institucion'}
                       <InstitutionForm />
               {:else}
                       <CollaboratorForm />
               {/if}
       {/if}

       <Loader size={80} loading={!ready} />
</main>
