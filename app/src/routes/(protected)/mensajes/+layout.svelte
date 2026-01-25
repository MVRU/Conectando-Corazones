<script lang="ts">
	import { page } from '$app/stores';
	import { mockChats } from '$lib/infrastructure/mocks/mock-chats';
	import { mockUsuarios } from '$lib/infrastructure/mocks/mock-usuarios';
	import type { Chat } from '$lib/domain/types/Chat';

	import { usuario } from '$lib/stores/auth';

	// Filtrar chats donde el usuario es participante
	let userChats: Chat[] = [];

	$: if ($usuario?.id_usuario) {
		userChats = mockChats.filter((chat) => chat.participantes_ids.includes($usuario!.id_usuario!));
		// Ordenar por fecha de actualización (más reciente primero)
		userChats.sort((a, b) => b.updated_at.getTime() - a.updated_at.getTime());
	} else {
		userChats = [];
	}
</script>

<div class="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-gray-50">
	<!-- Sidebar -->
	<aside class="w-80 flex-shrink-0 border-r border-gray-200 bg-white">
		<div class="border-b border-gray-200 p-4">
			<h2 class="text-lg font-semibold text-gray-800">Mis chats</h2>
		</div>
		<div class="h-full overflow-y-auto">
			{#if userChats.length === 0}
				<div class="p-4 text-center text-gray-500">
					<p>No tienes chats activos.</p>
				</div>
			{:else}
				<ul class="divide-y divide-gray-100">
					{#each userChats as chat}
						<li>
							<a
								href="/mensajes/{chat.proyecto_id}"
								class="block p-4 transition-colors duration-200 hover:bg-gray-50 {$page.params
									.proyecto_id === chat.proyecto_id.toString()
									? 'border-l-4 border-blue-500 bg-blue-50'
									: ''}"
							>
								<div class="mb-1 flex items-start justify-between">
									<h3 class="truncate pr-2 font-medium text-gray-900">{chat.titulo}</h3>
									<span class="text-xs whitespace-nowrap text-gray-500">
										{chat.updated_at.toLocaleDateString()}
									</span>
								</div>
								<p class="truncate text-sm text-gray-500">
									{chat.mensajes.length > 0
										? chat.mensajes[chat.mensajes.length - 1].contenido
										: 'Sin mensajes'}
								</p>
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</aside>

	<!-- Main Content -->
	<main class="flex min-w-0 flex-1 flex-col bg-white">
		<slot />
	</main>
</div>
