<script lang="ts">
	import type { Usuario, Institucion, Organizacion } from '$lib/types/Usuario';
	import { formatearEtiquetaContacto } from '$lib/utils/util-ui';
	import { Mail, Phone, Globe, Share2, MapPin, Calendar, Activity, Lock, User as UserIcon } from 'lucide-svelte';

	type UsuarioCompleto = Usuario | Institucion | Organizacion;

	export let perfilUsuario: UsuarioCompleto;
	export let puedeVerContactos: boolean;
	export let esMiPerfil: boolean;
	export let onEditarClick: () => void;

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

	function getIcon(tipo: string) {
		switch(tipo) {
			case 'email': return Mail;
			case 'telefono': return Phone;
			case 'web': return Globe;
			case 'red_social': return Share2;
			default: return Mail;
		}
	}
	
	function getIconTheme(tipo: string) {
		switch(tipo) {
			case 'email': return 'bg-purple-50 text-purple-600';
			case 'telefono': return 'bg-green-50 text-green-600';
			case 'web': return 'bg-blue-50 text-blue-600';
			case 'red_social': return 'bg-pink-50 text-pink-600';
			default: return 'bg-gray-50 text-gray-600';
		}
	}
</script>

<div class="mt-8 border-t border-gray-100 pt-8">
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 w-full">
		
		<div class="space-y-6">
			<h3 class="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2 mb-4">
				Información general
			</h3>
			
			<div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
				<!-- Usuario -->
				<div class="p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors">
					<div class="p-2 rounded-lg bg-gray-100 text-gray-600 shrink-0">
						<UserIcon class="h-5 w-5" />
					</div>
					<div>
						<p class="text-xs font-semibold uppercase text-gray-500 mb-0.5">Usuario</p>
						<p class="font-medium text-gray-900">@{perfilUsuario.username}</p>
					</div>
				</div>

				<!-- Ubicación -->
				{#if perfilUsuario.localidad}
					<div class="p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors">
						<div class="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
							<MapPin class="h-5 w-5" />
						</div>
						<div>
							<p class="text-xs font-semibold uppercase text-gray-500 mb-0.5">Ubicación</p>
							<p class="font-medium text-gray-900">
								{perfilUsuario.localidad.nombre}, {perfilUsuario.localidad.provincia?.nombre || 'Argentina'}
							</p>
						</div>
					</div>
				{/if}

				<!-- Estado -->
				<div class="p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors">
					<div class="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
						<Activity class="h-5 w-5" />
					</div>
					<div>
						<p class="text-xs font-semibold uppercase text-gray-500 mb-0.5">Estado</p>
						<p class="font-medium text-gray-900 capitalize">{perfilUsuario.estado}</p>
					</div>
				</div>

				<!-- Miembro desde -->
				<div class="p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors">
					<div class="p-2 rounded-lg bg-amber-50 text-amber-600 shrink-0">
						<Calendar class="h-5 w-5" />
					</div>
					<div>
						<p class="text-xs font-semibold uppercase text-gray-500 mb-0.5">Miembro desde</p>
						<p class="font-medium text-gray-900">
							{perfilUsuario.created_at 
								? new Date(perfilUsuario.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) 
								: 'No disponible'}
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Sección de Contacto -->
		<div class="space-y-6">
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
					Contacto
				</h3>
			</div>

			{#if puedeVerContactos}
				{#if contactosVisibles.length > 0}
					<div class="grid grid-cols-1 gap-3">
						{#each contactosVisibles as contacto}
							{@const Icon = getIcon(contacto.tipo_contacto)}
							{@const iconTheme = getIconTheme(contacto.tipo_contacto)}
							
							<div class="group relative flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 transition-all duration-200 hover:shadow-md hover:border-gray-200">
								<div class="p-2 rounded-lg {iconTheme} shrink-0 transition-colors">
									<svelte:component this={Icon} class="h-5 w-5" />
								</div>
								<div class="min-w-0 flex-1">
									<p class="text-xs font-bold uppercase text-gray-400 mb-0.5 flex items-center gap-2 transition-colors group-hover:text-gray-500">
										{obtenerTextoTipoContacto(contacto.tipo_contacto)}
										{#if contacto.etiqueta}
											<span class="inline-block w-1 h-1 rounded-full bg-gray-300"></span>
											<span class="font-normal normal-case">{formatearEtiquetaContacto(contacto.etiqueta)}</span>
										{/if}
									</p>
									<p class="text-sm font-medium text-gray-900 truncate select-all">{contacto.valor}</p>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="p-6 rounded-xl bg-gray-50 border border-gray-200 border-dashed text-center">
						<p class="text-gray-500 text-sm">Este usuario no tiene información de contacto pública cargada.</p>
					</div>
				{/if}
			{:else}
				<!-- Estado Privado -->
				<div class="relative overflow-hidden rounded-xl bg-gray-50 p-6 border border-gray-200">
					<div class="absolute -right-4 -top-4 opacity-5 pointer-events-none">
						<Lock class="h-32 w-32" />
					</div>
					
					<div class="relative z-10 flex flex-col items-center text-center sm:items-start sm:text-left gap-4">
						<div class="p-3 bg-white rounded-full shadow-sm ring-1 ring-gray-200">
							<Lock class="h-6 w-6 text-gray-400" />
						</div>
						<div>
							<h4 class="text-base font-semibold text-gray-900">Información privada</h4>
							<p class="mt-1 text-sm text-gray-500 text-pretty">{mensajePrivacidad}</p>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
