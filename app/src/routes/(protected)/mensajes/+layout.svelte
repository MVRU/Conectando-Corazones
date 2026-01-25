<script lang="ts">
	import { page } from '$app/stores';
	import { mockChats } from '$lib/infrastructure/mocks/mock-chats';
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

	// Determinar si estamos en la vista de chat (mobile)
	$: isInChat = !!$page.params.proyecto_id;
</script>

<div class="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-gray-50">
	<aside
		class="w-full flex-shrink-0 border-r border-gray-200 bg-white md:w-80 {isInChat
			? 'hidden md:flex md:flex-col'
			: 'flex flex-col'}"
	>
		<div class="flex-shrink-0 border-b border-gray-100 bg-white p-5 shadow-sm">
			<div class="flex items-center gap-3">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="h-5 w-5 text-white"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
						/>
					</svg>
				</div>
				<div>
					<h2 class="text-lg font-bold text-gray-900">Mensajes</h2>
					<p class="text-xs text-gray-500">Tus conversaciones</p>
				</div>
			</div>
		</div>
		<div class="flex-1 overflow-y-auto bg-gray-50">
			{#if userChats.length === 0}
				<div class="p-6 text-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="mx-auto mb-3 h-12 w-12 text-gray-300"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
						/>
					</svg>
					<p class="text-sm font-medium text-gray-600">No tienes chats activos</p>
					<p class="mt-1 text-xs text-gray-400">Tus conversaciones aparecerán aquí</p>
				</div>
			{:else}
				<ul class="divide-y divide-gray-100">
					{#each userChats as chat}
						<li>
							<a
								href="/mensajes/{chat.proyecto_id}"
								class="block p-4 transition-all duration-200 hover:bg-blue-50 {$page.params
									.proyecto_id === chat.proyecto_id.toString()
									? 'border-l-4 border-blue-600 bg-blue-50'
									: 'border-l-4 border-transparent'}"
							>
								<div class="mb-1.5 flex items-start justify-between gap-2">
									<h3 class="truncate font-semibold text-gray-900">{chat.titulo}</h3>
									<span class="text-xs whitespace-nowrap text-gray-400">
										{chat.updated_at.toLocaleDateString('es-AR', {
											day: 'numeric',
											month: 'short'
										})}
									</span>
								</div>
								<p class="truncate text-sm text-gray-500">
									{#if chat.mensajes.length > 0}
										<span class="font-medium text-gray-600">
											{chat.mensajes[chat.mensajes.length - 1].remitente_id === $usuario?.id_usuario
												? 'Vos:'
												: ''}
										</span>
										{chat.mensajes[chat.mensajes.length - 1].contenido}
									{:else}
										<span class="italic">Sin mensajes</span>
									{/if}
								</p>
								{#if chat.mensajes.length > 0}
									<div class="mt-1.5 flex items-center gap-1">
										<div class="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
										<span class="text-xs text-blue-600">{chat.mensajes.length} mensajes</span>
									</div>
								{/if}
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</aside>

	<main class="flex min-w-0 flex-1 flex-col bg-white {isInChat ? 'flex' : 'hidden md:flex'}">
		<slot />
	</main>
</div>
