<!-- FIX:
 	- [ ] Corregir atributos cuando se resuelvan las inconsistencias con el DER -->

<script lang="ts">
	export let contacto: {
		responsable?: string;
		telefono?: string;
		email?: string;
		sitioWeb?: string;
	};
</script>

{#if contacto}
	<div
		class="animate-fade-up rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-[rgb(var(--color-primary))]/50 hover:shadow-md"
	>
		<!-- Título más pequeño -->
		<h3 class="mb-4 flex items-center justify-center gap-2 text-base font-medium text-gray-700">
			Información de Contacto
		</h3>

		<!-- Datos de contacto -->
		<div class="space-y-4 divide-y divide-gray-100 text-xs sm:text-sm">
			{#if contacto.responsable}
				<div class="flex flex-col gap-2 pb-3 pt-0 sm:flex-row sm:items-start sm:pt-0">
					<div
						class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-lg text-gray-500"
					>
						👤
					</div>
					<div class="sm:pl-2">
						<p class="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
							Responsable
						</p>
						<p class="font-medium text-gray-700">{contacto.responsable}</p>
					</div>
				</div>
			{/if}

			{#if contacto.telefono}
				<div class="flex flex-col gap-2 pb-3 pt-3 sm:flex-row sm:items-start">
					<div
						class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-lg text-gray-500"
					>
						📱
					</div>
					<div class="sm:pl-2">
						<p class="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
							Teléfono
						</p>
						<p class="font-medium text-gray-700">{contacto.telefono}</p>
					</div>
				</div>
			{/if}

			{#if contacto.email}
				<div class="flex flex-col gap-2 pb-3 pt-3 sm:flex-row sm:items-start">
					<div
						class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-lg text-gray-500"
					>
						✉️
					</div>
					<div class="sm:pl-2">
						<p class="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
							Email
						</p>
						<a
							href={`mailto:${contacto.email}`}
							target="_blank"
							rel="noopener noreferrer"
							class="break-all font-medium text-[rgb(var(--color-primary))] transition-colors hover:text-[rgb(var(--color-primary))/80] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:ring-offset-2"
						>
							{contacto.email}
						</a>
					</div>
				</div>
			{/if}

			{#if contacto.sitioWeb}
				<div class="flex flex-col gap-2 pb-3 pt-3 sm:flex-row sm:items-start">
					<div
						class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-lg text-gray-500"
					>
						🌐
					</div>
					<div class="sm:pl-2">
						<p class="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
							Sitio Web
						</p>
						<a
							href={`https://${contacto.sitioWeb.replace(/^https?:\/\//, '')}`}
							target="_blank"
							rel="noopener noreferrer"
							class="break-all font-medium text-[rgb(var(--color-primary))] transition-colors hover:text-[rgb(var(--color-primary))/80] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:ring-offset-2"
						>
							{contacto.sitioWeb}
						</a>
					</div>
				</div>
			{/if}
		</div>
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
