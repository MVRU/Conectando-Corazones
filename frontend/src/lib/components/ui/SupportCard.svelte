<!--
* Componente: SupportCard
    -*- Descripción: tarjeta individual de contacto/soporte.
    -*- Props:
        -*- icon (string): tipo de icono a mostrar.
        -*- title (string): título de la tarjeta.
        -*- description (string): descripción breve.
        -*-- link (string): href del enlace de acción.
        -*- linkText (string): texto del enlace.
-->

<script lang="ts">
	export let icon: 'user' | 'support' | 'alert' = 'user';
	export let title = '';
	export let description = '';
	export let link = '';
	export let linkText = '';
	import Button from './Button.svelte';
</script>

<div
	class="support-card group relative flex flex-col items-center rounded-3xl border border-blue-400/10 bg-gradient-to-b from-white/10 to-[#172040] p-8 text-center shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_8px_40px_0_#7dd3fc33] hover:ring-2 hover:ring-blue-300/20"
>
	<div
		class="icon-wrapper mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-400/10 transition-all duration-500 group-hover:scale-110 group-hover:bg-blue-400/20"
	>
		{#if icon === 'user'}
			<!-- icono de usuario -->
			<svg
				class="h-8 w-8 stroke-gray-300 transition-all group-hover:stroke-gray-200"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				viewBox="0 0 24 24"
			>
				<circle cx="12" cy="8" r="4" />
				<path d="M4 20c0-3.31 3.58-6 8-6s8 2.69 8 6" />
			</svg>
		{:else if icon === 'support'}
			<!-- icono de soporte -->
			<svg
				class="h-8 w-8 stroke-blue-400 transition-all group-hover:stroke-blue-300"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path d="M4 13v-2a8 8 0 0 1 16 0v2" />
				<rect x="2" y="13" width="4" height="6" rx="2" />
				<rect x="18" y="13" width="4" height="6" rx="2" />
				<path d="M8 21h8" />
			</svg>
		{:else if icon === 'alert'}
			<!-- icono de alerta -->
			<svg
				class="h-8 w-8 stroke-red-400 transition-all group-hover:stroke-red-300"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path d="M12 3l8 4v5c0 5-4 9-8 9s-8-4-8-9V7z" />
				<path d="M12 8v4m0 4h.01" />
			</svg>
		{/if}
	</div>
	<h3 class="mb-1 text-lg font-bold text-white">{title}</h3>
	<p class="mb-4 text-sm text-blue-100">{description}</p>
	<div class="mt-6">
		<Button href={link} label={linkText} variant="ghost" />
	</div>
</div>
