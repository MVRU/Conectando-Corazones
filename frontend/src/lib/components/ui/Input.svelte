<!--
* Componente: Input
        -*- Descripción: campo de texto reutilizable con estilos consistentes.
        -*- Permite indicar mensajes de error para accesibilidad.
        -*- Los mensajes de error se anuncian con role="alert".
-->
<script lang="ts">
        import { clsx } from 'clsx';
        export let id = '';
        export let name = '';
        export let type: string = 'text';
        export let required = false;
        export let value = '';
        export let placeholder = '';
        export let error = '';
        export let customClass = '';
</script>

<div class="space-y-1">
        <input
                {id}
                {name}
                bind:value
                {type}
                class={clsx(
                        'w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors duration-200',
                        'focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]',
                        error && 'border-red-400 ring-red-400 focus:ring-red-400',
                        customClass
                )}
                {required}
                placeholder={placeholder}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? `${id}-error` : undefined}
        />
       {#if error}
               <p
                       id={`${id}-error`}
                       role="alert"
                       class="text-sm text-red-600"
               >{error}</p>
       {/if}
</div>
