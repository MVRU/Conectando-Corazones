<!--
*- DECISIÓN DE DISEÑO: Reutilizamos un layout responsivo para preferencias de privacidad con etiquetas accesibles.
-->
<script lang="ts">
	import {
		BG_CARD,
		BG_900,
		BORDER_SUBTLE,
		GRADIENT_CTA,
		PRIMARY_500,
		TEXT_100,
		TEXT_400
	} from '../tokens';

	const privacyOptions = [
		{ label: 'Dirección de la escuela', key: 'address' },
		{ label: 'Correo electrónico (Email)', key: 'email' },
		{ label: 'Teléfono de contacto', key: 'phone' }
	];
</script>

<section
	class="flex h-full min-h-[60vh] flex-col gap-10 rounded-[28px] p-10"
	style="background: {BG_CARD}; border: 1px solid {BORDER_SUBTLE}; box-shadow: 0 8px 28px rgba(0,0,0,0.22);"
>
	<h2
		class="border-b pb-4 text-4xl font-extrabold"
		style="color: {TEXT_100}; border-color: {BORDER_SUBTLE};"
	>
		Configuración de privacidad
	</h2>
	<div class="space-y-6">
		<p class="text-2xl font-bold" style="color: {PRIMARY_500};">Visibilidad de datos de contacto</p>
		{#each privacyOptions as item (item.key)}
			<fieldset
				class="flex flex-col gap-4 rounded-[18px] p-5 md:flex-row md:items-center md:justify-between"
				style="background: {BG_900}; border: 1px solid {BORDER_SUBTLE}; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);"
			>
				<legend class="text-lg font-semibold" style="color: {TEXT_100};">{item.label}</legend>
				<div class="flex flex-wrap gap-4" role="radiogroup" aria-label={`Privacidad ${item.label}`}>
					<label class="flex items-center gap-2 text-sm" style="color: {TEXT_400};">
						<input type="radio" name={`${item.key}-privacy`} class="h-4 w-4" value="hidden" />
						Oculto para todos
					</label>
					<label class="flex items-center gap-2 text-sm" style="color: {TEXT_400};">
						<input
							type="radio"
							name={`${item.key}-privacy`}
							class="h-4 w-4"
							value="public"
							checked
						/>
						Visible para todos
					</label>
					<label class="flex items-center gap-2 text-sm" style="color: {TEXT_400};">
						<input
							type="radio"
							name={`${item.key}-privacy`}
							class="h-4 w-4"
							value="collaborators"
						/>
						Solo colaboradores activos
					</label>
				</div>
			</fieldset>
		{/each}
	</div>
	<button
		class="mt-auto flex w-full items-center justify-center gap-2 rounded-full px-7 py-3 text-base font-bold text-white transition-all duration-200 hover:scale-[1.01] focus:outline-none focus:ring-4 active:scale-[0.98]"
		style="background: {GRADIENT_CTA}; box-shadow: 0 5px 20px {PRIMARY_500}40;"
		type="button"
	>
		Guardar cambios
	</button>
</section>
