<script lang="ts">
	import type { Contacto } from '$lib/domain/types/Contacto';
	import {
		Envelope,
		Phone,
		GlobeAlt,
		Link,
		InformationCircle,
		Hashtag,
		Tag
	} from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	export let contactos: Contacto[] = [];
</script>

{#if contactos.length}
	<div
		class="animate-fade-up rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-[rgb(var(--color-primary))]/50 hover:shadow-md"
	>
		<h3 class="mb-4 flex items-center justify-center gap-2 text-base font-medium text-gray-700">
			Información de contacto
		</h3>
		{#each contactos as contacto (contacto)}
			<div class="space-y-4 divide-y divide-gray-100 text-xs sm:text-sm">
				{#if contacto.tipo_contacto}
					<div class="flex flex-col gap-2 pt-0 pb-3 sm:flex-row sm:items-start sm:pt-0">
						<div
							class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-lg text-gray-500"
						>
							{#if contacto.tipo_contacto === 'email'}
								<Icon src={Envelope} class="h-4 w-4" />
							{:else if contacto.tipo_contacto === 'telefono'}
								<Icon src={Phone} class="h-4 w-4" />
							{:else if contacto.tipo_contacto === 'web'}
								<Icon src={GlobeAlt} class="h-4 w-4" />
							{:else if contacto.tipo_contacto === 'red_social'}
								<Icon src={Link} class="h-4 w-4" />
							{:else}
								<Icon src={InformationCircle} class="h-4 w-4" />
							{/if}
						</div>
						<div class="sm:pl-2">
							<p class="mb-0.5 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
								Tipo de contacto
							</p>
							<p class="font-medium text-gray-700">{contacto.tipo_contacto}</p>
						</div>
					</div>
				{/if}

				{#if contacto.valor}
					<div class="flex flex-col gap-2 pt-3 pb-3 sm:flex-row sm:items-start">
						<div
							class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-lg text-gray-500"
						>
							<Icon src={Hashtag} class="h-4 w-4" />
						</div>
						<div class="sm:pl-2">
							<p class="mb-0.5 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
								Valor
							</p>
							{#if contacto.tipo_contacto === 'email'}
								<a
									href={`mailto:${contacto.valor}`}
									target="_blank"
									rel="noopener noreferrer"
									class="font-medium break-all text-[rgb(var(--color-primary))] transition-colors hover:text-[rgb(var(--color-primary))/80] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:ring-offset-2 focus:outline-none"
								>
									{contacto.valor}
								</a>
							{:else if contacto.tipo_contacto === 'web'}
								<a
									href={`https://${contacto.valor.replace(/^https?:\/\//, '')}`}
									target="_blank"
									rel="noopener noreferrer"
									class="font-medium break-all text-[rgb(var(--color-primary))] transition-colors hover:text-[rgb(var(--color-primary))/80] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:ring-offset-2 focus:outline-none"
								>
									{contacto.valor}
								</a>
							{:else}
								<p class="font-medium text-gray-700">{contacto.valor}</p>
							{/if}
						</div>
					</div>
				{/if}

				{#if contacto.etiqueta}
					<div class="flex flex-col gap-2 pt-3 pb-3 sm:flex-row sm:items-start">
						<div
							class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-lg text-gray-500"
						>
							<Icon src={Tag} class="h-4 w-4" />
						</div>
						<div class="sm:pl-2">
							<p class="mb-0.5 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
								Etiqueta
							</p>
							<p class="font-medium text-gray-700">{contacto.etiqueta}</p>
						</div>
					</div>
				{/if}
			</div>
		{/each}
	</div>
{/if}

<style>
	@keyframes fade-up {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-up {
		animation: fade-up 0.4s ease-out both;
	}
</style>

