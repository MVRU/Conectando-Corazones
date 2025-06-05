<!--
* Componente: Breadcrumbs
	-*- Descripción: Navegación de migas de pan para mostrar la ubicación actual
	-*- Funcionalidad: Muestra la ruta de navegación con enlaces clickeables

* Props:
        -*- items (array): lista de objetos con {label, href} para cada nivel de navegación
        -*- separator (string): carácter separador entre elementos. Por defecto: '/'.
        -*- useIconSeparator (boolean): usar un ícono de flecha como separador.
        -*- maxLabelLength (number): cantidad máxima de caracteres visibles por etiqueta.
-->

<script lang="ts">
        import type { BreadcrumbItem } from '$lib/stores/breadcrumbs';

        export let items: BreadcrumbItem[] = [];
        export let separator: string = '/';
        export let useIconSeparator: boolean = true;
        export let maxLabelLength: number = 30;

        const truncate = (label: string) =>
                label.length > maxLabelLength ? label.slice(0, maxLabelLength - 1).trimEnd() + '…' : label;
</script>

{#if items.length > 0}
        <nav class="mb-6 px-8" aria-label="Breadcrumb">
                <ol class="flex flex-wrap items-center text-sm text-gray-500">
                        {#each items as item, index}
                                <li class="flex items-center">
                                        {#if index > 0}
                                                {#if useIconSeparator}
                                                        <svg
                                                                class="mx-2 h-4 w-4 text-gray-300"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                                aria-hidden="true"
                                                        >
                                                                <path
                                                                        fill-rule="evenodd"
                                                                        d="M7.293 14.707a1 1 0 01-.023-1.404L10.586 10 7.27 6.697a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.39-.01z"
                                                                        clip-rule="evenodd"
                                                                />
                                                        </svg>
                                                {:else}
                                                        <span class="mx-2 text-gray-300">{separator}</span>
                                                {/if}
                                        {/if}

                                        {#if item.href && index < items.length - 1}
                                                <a
                                                        href={item.href}
                                                        class="rounded transition-colors duration-200 hover:text-[rgb(var(--color-primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary))]"
                                                        title={item.label}
                                                >
                                                        {truncate(item.label)}
                                                </a>
                                        {:else}
                                                <span class="font-medium text-[rgb(var(--base-color))]" aria-current="page" title={item.label}>
                                                        {truncate(item.label)}
                                                </span>
                                        {/if}
				</li>
			{/each}
		</ol>
	</nav>
{/if}

<style>
	/* Agregamos estilos para responsive en caso de rutas muy largas */
	@media (max-width: 640px) {
		nav {
			padding-left: 1rem;
			padding-right: 1rem;
		}
		
		ol {
			font-size: 0.75rem;
		}
	}
</style> 