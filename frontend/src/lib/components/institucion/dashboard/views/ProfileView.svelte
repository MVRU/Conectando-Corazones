<!--
*- DECISIÓN DE DISEÑO: Mantener los datos del perfil en tarjetas separadas mejora la legibilidad en móviles.
-->
<script lang="ts">
	import { profileHighlights } from '../data';
	import {
		BG_900,
		BG_CARD,
		BORDER_SUBTLE,
		ERROR_COLOR,
		PRIMARY_300,
		PRIMARY_500,
		TEXT_100,
		TEXT_300,
		TEXT_400
	} from '../tokens';
</script>

<section
	class="flex h-full min-h-[60vh] flex-col gap-10 rounded-[28px] p-10"
	style="background: {BG_CARD}; border: 1px solid {BORDER_SUBTLE}; box-shadow: 0 8px 28px rgba(0,0,0,0.22);"
>
	<h2
		class="border-b pb-4 text-4xl font-extrabold"
		style="color: {TEXT_100}; border-color: {BORDER_SUBTLE};"
	>
		Perfil de la institución
	</h2>
	<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
		<article
			class="space-y-3 rounded-[18px] p-6"
			style="background: {BG_900}; border: 2px solid {PRIMARY_500}; box-shadow: 0 0 12px {PRIMARY_500}30;"
		>
			<h3 class="flex items-center gap-3 text-2xl font-bold" style="color: {PRIMARY_300};">
				<svelte:component this={profileHighlights.verification.icon} class="h-7 w-7" />
				{profileHighlights.verification.title}
			</h3>
			<p class="text-lg font-bold" style="color: {TEXT_100};">
				Tu cuenta ha sido verificada correctamente.
			</p>
			<p class="text-base" style="color: {TEXT_300};">
				Método: verificación de documentación manual.
			</p>
			<p class="text-base font-semibold" style="color: {TEXT_100};">
				Última verificación: Octubre 2025.
			</p>
			<p class="text-base font-bold" style="color: {ERROR_COLOR};">
				Próxima verificación: Octubre 2026.
			</p>
		</article>
		<article
			class="space-y-4 rounded-[18px] p-6"
			style="background: {BG_900}; border: 1px solid {BORDER_SUBTLE}; box-shadow: 0 4px 18px rgba(0,0,32,0.18);"
		>
			<h3 class="text-2xl font-bold" style="color: {PRIMARY_500};">Datos de la institución</h3>
			<p class="text-lg leading-relaxed" style="color: {TEXT_100};">
				<span class="block text-sm font-bold" style="color: {TEXT_400};">Institución:</span>
				Escuela Esperanza
			</p>
			<p class="text-lg leading-relaxed" style="color: {TEXT_100};">
				<span class="block text-sm font-bold" style="color: {TEXT_400};">Representante Legal:</span>
				Patricia
			</p>
			<p class="text-lg leading-relaxed" style="color: {TEXT_100};">
				<span class="block text-sm font-bold" style="color: {TEXT_400};">Ubicación:</span>
				Rosario, Santa Fe, Argentina
			</p>
		</article>
	</div>
	<button
		class="mt-4 flex w-full items-center justify-center gap-2 rounded-full px-7 py-3 text-base font-bold text-white transition-all duration-200 hover:scale-[1.01] focus:outline-none focus:ring-4 active:scale-[0.98]"
		style="background: linear-gradient(135deg, {PRIMARY_300} 0%, {PRIMARY_500} 100%); box-shadow: 0 5px 20px {PRIMARY_500}40;"
		type="button"
	>
		Editar perfil
	</button>
</section>
