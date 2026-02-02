<script lang="ts">
	import { page } from '$app/stores';
	import type { Chat } from '$lib/domain/types/Chat';
	import { usuario } from '$lib/stores/auth';
	import { chatStore } from '$lib/stores/chatStore';
	import EstadoProyectoBadge from '$lib/components/feature/chat/EstadoProyectoBadge.svelte';
	// Filtrar chats donde el usuario es participante
	let chatsUsuario: Chat[] = [];

	// Backend de chat no implementado
	$: if ($usuario?.id_usuario) {
		chatsUsuario = [];
	}

	// Separar chats activos y archivados
	$: activeChats = [] as Chat[];
	$: archivedChats = [] as Chat[];

	// Determinar si estamos en la vista de chat (mobile)
	$: isInChat = !!$page.params.proyecto_id;

	// Función helper para obtener proyecto
	function getProyecto(proyectoId: number): any {
		return undefined;
	}
</script>

<div class="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-gray-50">
	<aside
		class="flex-shrink-0 border-r border-gray-200 bg-white transition-all duration-300 {isInChat
			? 'hidden md:flex md:flex-col'
			: 'flex flex-col'} {$chatStore.sidebarCollapsed ? 'md:w-0 md:opacity-0' : 'w-full md:w-80'}"
	>
		<!-- Header -->
		<div class="flex-shrink-0 border-b border-gray-100 bg-white p-5">
			<div class="flex items-center justify-between gap-3">
				<div class="flex items-center gap-3">
					<div class="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="currentColor"
							class="h-6 w-6 text-white"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
							/>
						</svg>
					</div>
					<div>
						<h2 class="text-lg font-bold text-gray-900">Mensajes</h2>
						<p class="text-xs text-gray-500">
							{activeChats.length + archivedChats.length} conversaciones
						</p>
					</div>
				</div>
				<button
					on:click={() => chatStore.toggleSidebar()}
					class="hidden rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 md:block"
					aria-label={$chatStore.sidebarCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
					title={$chatStore.sidebarCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="h-5 w-5 transition-transform duration-300 {$chatStore.sidebarCollapsed
							? 'rotate-180'
							: ''}"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
						/>
					</svg>
				</button>
			</div>
		</div>

		<!-- Tabs -->
		<div class="flex border-b border-gray-200 bg-white px-2 pt-2">
			<button
				on:click={() => chatStore.toggleArchived()}
				class="relative flex-1 rounded-t-lg px-4 py-2.5 text-sm font-medium transition-all {!$chatStore.showArchived
					? 'bg-gray-50 text-blue-600'
					: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}"
			>
				{#if !$chatStore.showArchived}
					<div class="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600"></div>
				{/if}
				Activos
				{#if activeChats.length > 0}
					<span
						class="ml-1.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full {!$chatStore.showArchived
							? 'bg-blue-100 text-blue-600'
							: 'bg-gray-200 text-gray-600'} px-1.5 text-xs font-semibold"
					>
						{activeChats.length}
					</span>
				{/if}
			</button>
			<button
				on:click={() => chatStore.toggleArchived()}
				class="relative flex-1 rounded-t-lg px-4 py-2.5 text-sm font-medium transition-all {$chatStore.showArchived
					? 'bg-gray-50 text-blue-600'
					: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}"
			>
				{#if $chatStore.showArchived}
					<div class="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600"></div>
				{/if}
				Archivados
				{#if archivedChats.length > 0}
					<span
						class="ml-1.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full {$chatStore.showArchived
							? 'bg-blue-100 text-blue-600'
							: 'bg-gray-200 text-gray-600'} px-1.5 text-xs font-semibold"
					>
						{archivedChats.length}
					</span>
				{/if}
			</button>
		</div>

		<!-- Chat lista -->
		<div class="no-scrollbar flex-1 overflow-y-auto bg-gray-50">
			{#if ($chatStore.showArchived ? archivedChats : activeChats).length === 0}
				<div class="p-8 text-center">
					<div
						class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="h-8 w-8 text-gray-400"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
							/>
						</svg>
					</div>
					<p class="text-sm font-medium text-gray-700">
						{$chatStore.showArchived ? 'No tienes chats archivados' : 'No tienes chats activos'}
					</p>
					<p class="mt-1 text-xs text-gray-500">
						{$chatStore.showArchived
							? 'Los chats de proyectos completados o cancelados aparecerán aquí'
							: 'Tus conversaciones aparecerán aquí'}
					</p>
				</div>
			{:else}
				<ul class="divide-y divide-gray-100">
					{#each $chatStore.showArchived ? archivedChats : activeChats as chat}
						{@const proyecto = getProyecto(chat.proyecto_id)}
						<li>
							<a
								href="/mensajes/{chat.proyecto_id}"
								class="block px-4 py-3.5 transition-all duration-150 hover:bg-blue-50 {$page.params
									.proyecto_id === chat.proyecto_id.toString()
									? 'border-l-4 border-blue-600 bg-blue-50'
									: 'border-l-4 border-transparent'}"
							>
								<div class="mb-2 flex items-start justify-between gap-2">
									<h3 class="truncate font-semibold text-gray-900">{chat.titulo}</h3>
									<span class="text-xs whitespace-nowrap text-gray-400">
										{chat.updated_at.toLocaleDateString('es-AR', {
											day: 'numeric',
											month: 'short'
										})}
									</span>
								</div>
								<p class="mb-2.5 truncate text-sm text-gray-600">
									{#if chat.mensajes.length > 0}
										<span class="font-medium text-gray-700">
											{chat.mensajes[chat.mensajes.length - 1].remitente_id === $usuario?.id_usuario
												? 'Vos:'
												: ''}
										</span>
										{chat.mensajes[chat.mensajes.length - 1].contenido}
									{:else}
										<span class="text-gray-400 italic">Sin mensajes</span>
									{/if}
								</p>
								<div class="flex items-center justify-between gap-2">
									{#if proyecto?.estado}
										<EstadoProyectoBadge estado={proyecto.estado} />
									{/if}
									{#if chat.mensajes.length > 0}
										<span class="text-xs text-gray-400">{chat.mensajes.length} mensajes</span>
									{/if}
								</div>
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</aside>

	<main
		class="relative flex min-w-0 flex-1 flex-col bg-white {isInChat ? 'flex' : 'hidden md:flex'}"
	>
		<!-- Botón toggle cuando el sidebar está colapsado (en área de encabezado) -->
		{#if $chatStore.sidebarCollapsed}
			<div class="absolute top-0 left-0 z-10 hidden p-4 md:block">
				<button
					on:click={() => chatStore.toggleSidebar()}
					class="rounded-lg bg-white p-2.5 text-gray-600 shadow-md transition-all hover:bg-gray-50 hover:text-blue-600 hover:shadow-lg"
					aria-label="Mostrar sidebar"
					title="Mostrar sidebar"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="h-5 w-5"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
						/>
					</svg>
				</button>
			</div>
		{/if}
		<slot />
	</main>
</div>
