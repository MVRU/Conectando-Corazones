<!--
*- DECISIÓN DE DISEÑO: Ofrecemos un mensaje consistente mientras se implementan nuevas vistas del panel.
-->
<script lang="ts">
	import type { ViewMode } from '../types';
	import { navItems } from '../data';
	import { BG_CARD, BORDER_SUBTLE, PRIMARY_500, TEXT_100, TEXT_300 } from '../tokens';

	export let viewMode: ViewMode = 'dashboard';
</script>

<section
	class="flex h-full min-h-[60vh] flex-col items-center justify-center gap-6 rounded-[28px] p-10 text-center"
	style="background: {BG_CARD}; border: 1px solid {BORDER_SUBTLE}; box-shadow: 0 8px 28px rgba(0,0,0,0.22);"
>
	<h2 class="text-4xl font-extrabold" style="color: {TEXT_100};">
		Sección: {navItems.find((item) => item.view === viewMode)?.label ?? 'Conectando Corazones'}
	</h2>
	<p class="text-lg font-medium" style="color: {TEXT_300};">
		Esta vista se encuentra en desarrollo. Pronto añadiremos herramientas avanzadas.
	</p>
	<button
		class="rounded-full px-6 py-2 text-sm font-semibold transition-colors duration-200 hover:text-white"
		style="color: {PRIMARY_500}; border: 1px solid {PRIMARY_500};"
		type="button"
	>
		Ir al panel principal
	</button>
</section>
