<script lang="ts">
	import type { Usuario, Institucion, Organizacion } from '$lib/domain/types/Usuario';
	import { formatearEtiquetaContacto } from '$lib/utils/util-ui';
	import {
		Mail,
		Phone,
		Globe,
		Share2,
		MapPin,
		Calendar,
		Activity,
		Lock,
		User as UserIcon
	} from 'lucide-svelte';

	type UsuarioCompleto = Usuario | Institucion | Organizacion;

	export let perfilUsuario: UsuarioCompleto;
	export let puedeVerContactos: boolean;

	function obtenerTextoTipoContacto(tipo: string): string {
		const tipos: Record<string, string> = {
			email: 'Correo Electrónico',
			telefono: 'Teléfono',
			web: 'Sitio Web',
			red_social: 'Red Social'
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
		switch (tipo) {
			case 'email':
				return Mail;
			case 'telefono':
				return Phone;
			case 'web':
				return Globe;
			case 'red_social':
				return Share2;
			default:
				return Mail;
		}
	}

	function getIconTheme(tipo: string) {
		switch (tipo) {
			case 'email':
				return 'bg-purple-50 text-purple-600';
			case 'telefono':
				return 'bg-green-50 text-green-600';
			case 'web':
				return 'bg-blue-50 text-blue-600';
			case 'red_social':
				return 'bg-pink-50 text-pink-600';
			default:
				return 'bg-gray-50 text-gray-600';
		}
	}
</script>

<div class="mt-8 border-t border-gray-100 pt-8">
	<div class="grid w-full grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
		<div class="space-y-6">
			<h3
				class="mb-4 flex items-center gap-2 text-sm font-bold tracking-wider text-gray-500 uppercase"
			>
				Información general
			</h3>

			<div
				class="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
			>
				<!-- Usuario -->
				<div class="flex items-start gap-4 p-4 transition-colors hover:bg-gray-50">
					<div class="shrink-0 rounded-lg bg-gray-100 p-2 text-gray-600">
						<UserIcon class="h-5 w-5" />
					</div>
					<div>
						<p class="mb-0.5 text-xs font-semibold text-gray-500 uppercase">Usuario</p>
						<p class="font-medium text-gray-900">@{perfilUsuario.username}</p>
					</div>
				</div>

				<!-- Ubicación -->
				{#if perfilUsuario.localidad}
					<div class="flex items-start gap-4 p-4 transition-colors hover:bg-gray-50">
						<div class="shrink-0 rounded-lg bg-blue-50 p-2 text-blue-600">
							<MapPin class="h-5 w-5" />
						</div>
						<div>
							<p class="mb-0.5 text-xs font-semibold text-gray-500 uppercase">Ubicación</p>
							<p class="font-medium text-gray-900">
								{perfilUsuario.localidad.nombre}, {perfilUsuario.localidad.provincia?.nombre ||
									'Argentina'}
							</p>
						</div>
					</div>
				{/if}

				<!-- Estado -->
				<div class="flex items-start gap-4 p-4 transition-colors hover:bg-gray-50">
					<div class="shrink-0 rounded-lg bg-emerald-50 p-2 text-emerald-600">
						<Activity class="h-5 w-5" />
					</div>
					<div>
						<p class="mb-0.5 text-xs font-semibold text-gray-500 uppercase">Estado</p>
						<p class="font-medium text-gray-900 capitalize">{perfilUsuario.estado}</p>
					</div>
				</div>

				<!-- Miembro desde -->
				<div class="flex items-start gap-4 p-4 transition-colors hover:bg-gray-50">
					<div class="shrink-0 rounded-lg bg-amber-50 p-2 text-amber-600">
						<Calendar class="h-5 w-5" />
					</div>
					<div>
						<p class="mb-0.5 text-xs font-semibold text-gray-500 uppercase">Miembro desde</p>
						<p class="font-medium text-gray-900">
							{perfilUsuario.created_at
								? new Date(perfilUsuario.created_at).toLocaleDateString('es-ES', {
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									})
								: 'No disponible'}
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Sección de Contacto -->
		<div class="space-y-6">
			<div class="mb-4 flex items-center justify-between">
				<h3
					class="flex items-center gap-2 text-sm font-bold tracking-wider text-gray-500 uppercase"
				>
					Contacto
				</h3>
			</div>

			{#if puedeVerContactos}
				{#if contactosVisibles.length > 0}
					<div class="grid grid-cols-1 gap-3">
						{#each contactosVisibles as contacto}
							{@const Icon = getIcon(contacto.tipo_contacto)}
							{@const iconTheme = getIconTheme(contacto.tipo_contacto)}

							<div
								class="group relative flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 transition-all duration-200 hover:border-gray-200 hover:shadow-md"
							>
								<div class="rounded-lg p-2 {iconTheme} shrink-0 transition-colors">
									<svelte:component this={Icon} class="h-5 w-5" />
								</div>
								<div class="min-w-0 flex-1">
									<p
										class="mb-0.5 flex items-center gap-2 text-xs font-bold text-gray-400 uppercase transition-colors group-hover:text-gray-500"
									>
										{obtenerTextoTipoContacto(contacto.tipo_contacto)}
										{#if contacto.etiqueta}
											<span class="inline-block h-1 w-1 rounded-full bg-gray-300"></span>
											<span class="font-normal normal-case"
												>{formatearEtiquetaContacto(contacto.etiqueta)}</span
											>
										{/if}
									</p>
									<p class="truncate text-sm font-medium text-gray-900 select-all">
										{contacto.valor}
									</p>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
						<p class="text-sm text-gray-500">
							Este usuario no tiene información de contacto pública cargada.
						</p>
					</div>
				{/if}
			{:else}
				<!-- Estado Privado -->
				<div class="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-6">
					<div class="pointer-events-none absolute -top-4 -right-4 opacity-5">
						<Lock class="h-32 w-32" />
					</div>

					<div
						class="relative z-10 flex flex-col items-center gap-4 text-center sm:items-start sm:text-left"
					>
						<div class="rounded-full bg-white p-3 shadow-sm ring-1 ring-gray-200">
							<Lock class="h-6 w-6 text-gray-400" />
						</div>
						<div>
							<h4 class="text-base font-semibold text-gray-900">Información privada</h4>
							<p class="mt-1 text-sm text-pretty text-gray-500">{mensajePrivacidad}</p>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
