<script lang="ts">
	import type { Mensaje } from '$lib/domain/types/Chat';
	import { mockUsuarios } from '$lib/infrastructure/mocks/mock-usuarios';

	export let mensaje: Mensaje;
	export let isOwn: boolean;

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
	const hora = mensaje.created_at.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
</script>

<div class="mb-4 flex flex-col {isOwn ? 'items-end' : 'items-start'}">
	<div
		class="max-w-[70%] rounded-lg px-4 py-2 shadow-sm {isOwn
			? 'rounded-br-none bg-blue-600 text-white'
			: 'rounded-bl-none border border-gray-200 bg-white text-gray-800'}"
	>
		{#if !isOwn}
			<span class="mb-1 block text-xs font-bold text-blue-600">{nombreMostrar}</span>
		{/if}
		<p class="text-sm break-words whitespace-pre-wrap">{mensaje.contenido}</p>
		<span class="mt-1 block text-[10px] {isOwn ? 'text-blue-100' : 'text-gray-400'} text-right">
			{hora}
		</span>
	</div>
</div>
