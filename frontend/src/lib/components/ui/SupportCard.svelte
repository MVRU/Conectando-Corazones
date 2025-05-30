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
	export let link = '#';
	export let linkText = '';
</script>

<div
	class="flex flex-col items-center rounded-[2rem] bg-white px-8 py-10 text-center shadow-lg transition hover:shadow-xl"
>
	<div class="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50">
		{#if icon === 'user'}
			<!-- User icon -->
			<svg
				class="h-9 w-9 text-blue-500"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				viewBox="0 0 24 24"
			>
				<circle cx="12" cy="8" r="4" />
				<path stroke-linecap="round" stroke-linejoin="round" d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6" />
			</svg>
		{:else if icon === 'support'}
			<!-- Support icon -->
			<svg
				class="h-9 w-9 text-blue-500"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				viewBox="0 0 24 24"
			>
				<circle cx="12" cy="12" r="10" />
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 16v.01M12 8a4 4 0 0 0-4 4h8a4 4 0 0 0-4-4z"
				/>
			</svg>
		{:else if icon === 'alert'}
			<!-- Alert icon -->
			<svg
				class="h-9 w-9 text-blue-500"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 9v4m0 4h.01M4.93 19h14.14a2 2 0 0 0 1.76-2.94l-7.07-12.27a2 2 0 0 0-3.46 0L3.17 16.06A2 2 0 0 0 4.93 19z"
				/>
			</svg>
		{/if}
	</div>
	<h3 class="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
	<p class="mb-4 text-gray-500">{description}</p>
	<a
		href={link}
		class="border-b border-blue-500 font-medium text-blue-600 transition hover:text-blue-800"
	>
		{linkText}
	</a>
</div>
