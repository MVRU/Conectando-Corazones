<script lang="ts">
	import type { Mensaje } from '$lib/domain/types/Chat';
	import { mockUsuarios } from '$lib/infrastructure/mocks/mock-usuarios';

	export let mensaje: Mensaje;
	export let esPropio: boolean;

	// Obtener datos del remitente
	const remitente = Object.values(mockUsuarios).find((u) => u.id_usuario === mensaje.remitente_id);

	// Determinar nombre a mostrar según rol
	let nombreMostrar = 'Usuario desconocido';
	if (remitente) {
		if (remitente.rol === 'institucion') {
			nombreMostrar = (remitente as any).nombre_legal || remitente.username;
		} else if (remitente.rol === 'colaborador') {
			if ((remitente as any).tipo_colaborador === 'organizacion') {
				nombreMostrar = (remitente as any).razon_social || remitente.username;
			} else {
				nombreMostrar = `${remitente.nombre} ${remitente.apellido}`;
			}
		} else {
			nombreMostrar = remitente.username;
		}
	}

	// Formatear hora
	const hora = mensaje.created_at.toLocaleTimeString('es-AR', {
		hour: '2-digit',
		minute: '2-digit'
	});
</script>

<div class="mb-3 flex flex-col {esPropio ? 'items-end' : 'items-start'}">
	<div
		class="group relative max-w-[85%] rounded-2xl px-3 py-2 shadow-sm transition-all hover:shadow-md md:max-w-[70%] md:px-4 md:py-2.5 {esPropio
			? 'rounded-br-sm bg-gradient-to-br from-blue-600 to-blue-700 text-white'
			: 'rounded-bl-sm border border-gray-200 bg-white text-gray-800'}"
	>
		{#if !esPropio}
			<span class="mb-1 block text-xs font-bold text-blue-600">{nombreMostrar}</span>
		{/if}
		<p class="text-sm leading-relaxed break-words whitespace-pre-wrap">{mensaje.contenido}</p>
		<span
			class="mt-1.5 block text-right text-[10px] {esPropio
				? 'text-blue-100'
				: 'text-gray-400'} transition-opacity group-hover:opacity-100 {esPropio
				? 'opacity-90'
				: 'opacity-70'}"
		>
			{hora}
		</span>
		{#if esPropio}
			<div
				class="absolute right-0 -bottom-0 h-3 w-3 bg-gradient-to-br from-blue-600 to-blue-700"
				style="clip-path: polygon(100% 0, 0 100%, 100% 100%);"
			></div>
		{:else}
			<div
				class="absolute -bottom-0 left-0 h-3 w-3 border-b border-l border-gray-200 bg-white"
				style="clip-path: polygon(0 0, 0 100%, 100% 100%);"
			></div>
		{/if}
	</div>
</div>
