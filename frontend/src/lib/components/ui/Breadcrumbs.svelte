<!--
* Componente: Breadcrumbs
	-*- Descripción: Navegación de migas de pan para mostrar la ubicación actual
	-*- Funcionalidad: Muestra la ruta de navegación con enlaces clickeables

* Props:
	-*- items (array): lista de objetos con {label, href} para cada nivel de navegación

TODO:
	- [ ] Agregar truncado automático para rutas muy largas
	- [ ] Implementar separadores personalizables
-->

<script lang="ts">
	import type { BreadcrumbItem } from '$lib/stores/breadcrumbs';

	export let items: BreadcrumbItem[] = [];
</script>

{#if items.length > 0}
	<nav class="mb-6 px-8" aria-label="Breadcrumb">
		<ol class="flex items-center space-x-2 text-sm text-gray-500">
			{#each items as item, index}
				<li class="flex items-center">
					{#if index > 0}
						<span class="text-gray-300 mx-2">/</span>
					{/if}
					
					{#if item.href && index < items.length - 1}
						<a 
							href={item.href} 
							class="hover:text-[rgb(var(--color-primary))] transition-colors duration-200"
						>
							{item.label}
						</a>
					{:else}
						<span class="text-[rgb(var(--base-color))] font-medium">
							{item.label}
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