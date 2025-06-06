<!--
* Componente: RoleCard
        -*- Opción visual para elegir tipo de registro.
        -*- Favorece accesibilidad y consistencia visual.
-->
<script lang="ts">
        import { createEventDispatcher } from 'svelte';
        import { clsx } from 'clsx';
        export let title: string;
        export let description: string;
        export let icon: 'institution' | 'collaborator' = 'institution';
        export let selected = false;
        const dispatch = createEventDispatcher();
</script>

<button
        type="button"
        aria-pressed={selected}
        on:click={() => dispatch('select')}
        class={clsx(
                'flex flex-col items-start gap-2 rounded-2xl border border-gray-300 bg-white/70 p-6 text-left shadow-md transition-all duration-300',
                'hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]',
                selected && 'ring-2 ring-[rgb(var(--color-primary))]'
        )}
>
        {#if icon === 'institution'}
                <svg class="mb-2 h-8 w-8 text-[rgb(var(--color-primary))]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 10l9-7 9 7" />
                        <path d="M9 22V12h6v10" />
                        <path d="M2 22h20" />
                </svg>
        {:else}
                <svg class="mb-2 h-8 w-8 text-[rgb(var(--color-primary))]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 13l4 4L19 7" />
                        <path d="M12 20h9" />
                        <path d="M3 10h9" />
                </svg>
        {/if}
        <span class="text-lg font-semibold text-[rgb(var(--base-color))]">{title}</span>
        <span class="text-sm text-gray-600">{description}</span>
</button>
