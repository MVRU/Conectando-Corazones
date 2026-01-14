<script lang="ts">
	import type { Usuario, Institucion, Organizacion } from '$lib/types/Usuario';
	import { formatearEtiquetaContacto, obtenerIconoContacto } from '$lib/utils/util-ui';

	type UsuarioCompleto = Usuario | Institucion | Organizacion;

	export let perfilUsuario: UsuarioCompleto;
	export let puedeVerContactos: boolean;


	function obtenerTextoTipoContacto(tipo: string): string {
		const tipos: Record<string, string> = {
			'email': 'Correo Electrónico',
			'telefono': 'Teléfono',
			'web': 'Sitio Web',
			'red_social': 'Red Social'
		};
		return tipos[tipo] || tipo;
	}

	
	function obtenerMensajePrivacidad(rol: string): string {
		if (rol === 'institucion') {
			return 'Para ver los contactos de esta institución, debés tener al menos una colaboración aprobada en uno de sus proyectos.';
		}
		return 'Para ver los contactos de este usuario, debés haber colaborado juntos en un mismo proyecto.';
	}

	$: contactosVisibles = (perfilUsuario.contactos ?? []).slice(0, 5);
	$: mensajePrivacidad = obtenerMensajePrivacidad(perfilUsuario.rol);
</script>

<div class="mt-8 border-t border-gray-200 pt-8">
	<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
		<!-- Columna izquierda: Información de contacto -->
		<div class="space-y-6">
			<div>
				<div class="mb-3 flex items-center gap-2">
					<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
					</svg>
					<span class="text-sm font-semibold uppercase tracking-wide text-gray-600">Información de Contacto</span>
				</div>
				
				{#if puedeVerContactos}
					<!-- Lista de contactos visible -->
					<div class="ml-7 space-y-3">
						{#each contactosVisibles as contacto}
							<div class="flex items-start gap-3 border-l-2 border-gray-100 pl-3">
								<svg class="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={obtenerIconoContacto(contacto.tipo_contacto)} />
								</svg>
								<div class="flex-1">
									<div class="text-xs font-medium uppercase tracking-wide text-gray-500">
										{obtenerTextoTipoContacto(contacto.tipo_contacto)}
										{#if contacto.etiqueta}
											<span class="ml-1 text-gray-400">({formatearEtiquetaContacto(contacto.etiqueta)})</span>
										{/if}
									</div>
									<p class="mt-0.5 text-sm font-medium text-gray-900">{contacto.valor}</p>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<!-- Mensaje de privacidad -->
					<div class="ml-7 rounded-lg bg-gray-50 p-4">
						<div class="flex items-start gap-3">
							<svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
							</svg>
							<div class="flex-1">
								<p class="text-sm font-medium text-gray-700">Información de contacto privada</p>
								<p class="mt-1 text-xs text-gray-500">{mensajePrivacidad}</p>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Columna derecha: Información de cuenta -->
		<div class="space-y-6">
			<!-- Username -->
			<div>
				<div class="mb-2 flex items-center gap-2">
					<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
					</svg>
					<span class="text-sm font-semibold uppercase tracking-wide text-gray-600">Usuario</span>
				</div>
				<p class="ml-7 text-base text-gray-900">@{perfilUsuario.username}</p>
			</div>
			
			<!-- Ubicación -->
			{#if perfilUsuario.localidad}
				<div>
					<div class="mb-2 flex items-center gap-2">
						<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
						<span class="text-sm font-semibold uppercase tracking-wide text-gray-600">Ubicación</span>
					</div>
					<p class="ml-7 text-base text-gray-900">
						{perfilUsuario.localidad.nombre}, {perfilUsuario.localidad.provincia?.nombre || 'Provincia no disponible'}
					</p>
				</div>
			{/if}

			<!-- Estado -->
			<div>
				<div class="mb-2 flex items-center gap-2">
					<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<span class="text-sm font-semibold uppercase tracking-wide text-gray-600">Estado</span>
				</div>
				<p class="ml-7 text-base capitalize text-gray-900">{perfilUsuario.estado}</p>
			</div>
			
			<!-- Fecha de registro -->
			<div>
				<div class="mb-2 flex items-center gap-2">
					<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
					</svg>
					<span class="text-sm font-semibold uppercase tracking-wide text-gray-600">Miembro desde</span>
				</div>
				<p class="ml-7 text-base text-gray-900">
					{perfilUsuario.created_at 
						? new Date(perfilUsuario.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) 
						: 'No disponible'}
				</p>
			</div>
		</div>
	</div>
</div>
