<script lang="ts">
	export let contacto;
</script>

{#if contacto}
	<div class="rounded-2xl bg-white p-6 shadow-lg">
		<h3 class="mb-4 text-xl font-semibold text-[rgb(var(--base-color))]">
			Información de Contacto
		</h3>
		<div class="space-y-3 text-sm">
			{#if contacto.responsable}
				<div>
					<span class="font-medium text-[rgb(var(--base-color))]">Responsable:</span>
					<p class="text-gray-700">{contacto.responsable}</p>
				</div>
			{/if}
			{#if contacto.telefono}
				<div>
					<span class="font-medium text-[rgb(var(--base-color))]">Teléfono:</span>
					<p class="text-gray-700">{contacto.telefono}</p>
				</div>
			{/if}
			{#if contacto.email}
				<div>
					<span class="font-medium text-[rgb(var(--base-color))]">Email:</span>
					<p class="text-gray-700">
						<a
							href="mailto:{contacto.email}"
							class="text-[rgb(var(--color-primary))] hover:underline">{contacto.email}</a
						>
					</p>
				</div>
			{/if}
			{#if contacto.sitioWeb}
				<div>
					<span class="font-medium text-[rgb(var(--base-color))]">Sitio web:</span>
					<p class="text-gray-700">
						<a
							href="https://{contacto.sitioWeb}"
							target="_blank"
							rel="noopener noreferrer"
							class="text-[rgb(var(--color-primary))] hover:underline"
						>
							{contacto.sitioWeb}
						</a>
					</p>
				</div>
			{/if}
		</div>
	</div>
{/if}
