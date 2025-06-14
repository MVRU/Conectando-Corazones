<script lang="ts">
	export let contacto;
</script>

{#if contacto}
	<div class="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-100 transition hover:shadow-2xl">
		<h3 class="mb-5 flex items-center gap-2 text-xl font-bold text-[rgb(var(--base-color))]">
			Información de Contacto
		</h3>

		<div class="space-y-4 text-sm sm:text-base">
			{#if contacto.responsable}
				<div class="flex flex-col">
					<span class="text-xs font-semibold uppercase tracking-wide text-gray-500">
						Responsable
					</span>
					<span class="font-medium text-gray-800">{contacto.responsable}</span>
				</div>
			{/if}

			{#if contacto.telefono}
				<div class="flex flex-col">
					<span class="text-xs font-semibold uppercase tracking-wide text-gray-500">
						Teléfono
					</span>
					<span class="font-medium text-gray-800">{contacto.telefono}</span>
				</div>
			{/if}

			{#if contacto.email}
				<div class="flex flex-col">
					<span class="text-xs font-semibold uppercase tracking-wide text-gray-500"> Email </span>
					<a
						href="mailto:{contacto.email}"
						class="break-all font-medium text-[rgb(var(--color-primary))] hover:underline"
					>
						{contacto.email}
					</a>
				</div>
			{/if}

			{#if contacto.sitioWeb}
				<div class="flex flex-col">
					<span class="text-xs font-semibold uppercase tracking-wide text-gray-500">
						Sitio Web
					</span>
					<a
						href="https://{contacto.sitioWeb}"
						target="_blank"
						rel="noopener noreferrer"
						class="break-all font-medium text-[rgb(var(--color-primary))] hover:underline"
					>
						{contacto.sitioWeb}
					</a>
				</div>
			{/if}
		</div>
	</div>
{/if}
