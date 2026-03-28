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
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	type UsuarioCompleto = Usuario | Institucion | Organizacion;

	let { perfilUsuario, puedeVerContactos } = $props<{
		perfilUsuario: UsuarioCompleto;
		puedeVerContactos: boolean;
	}>();

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
			return 'Para ver los contactos de esta institución, necesitás tener al menos una colaboración aprobada en uno de sus proyectos.';
		}
		return 'Para ver los contactos de este usuario, debés haber colaborado juntos en un mismo proyecto.';
	}

	function getIcon(tipo: string) {
		switch (tipo) {
			case 'email': return Mail;
			case 'telefono': return Phone;
			case 'web': return Globe;
			case 'red_social': return Share2;
			default: return Mail;
		}
	}

	function getIconTheme(tipo: string): string {
		switch (tipo) {
			case 'email': return 'bg-purple-50 text-purple-600';
			case 'telefono': return 'bg-green-50 text-green-600';
			case 'web': return 'bg-blue-50 text-[#007FFF]';
			case 'red_social': return 'bg-pink-50 text-pink-600';
			default: return 'bg-gray-50 text-gray-600';
		}
	}

	let contactosVisibles = $derived((perfilUsuario.contactos ?? []).slice(0, 5));
	let mensajePrivacidad = $derived(obtenerMensajePrivacidad(perfilUsuario.rol));

	const infoItems = $derived([
		{ icon: UserIcon, theme: 'bg-gray-100 text-gray-600', label: 'Usuario', valor: `@${perfilUsuario.username}`, mostrar: true },
		{
			icon: MapPin, theme: 'bg-blue-50 text-[#007FFF]', label: 'Ubicación',
			valor: perfilUsuario.localidad ? `${perfilUsuario.localidad.nombre}, ${perfilUsuario.localidad.provincia?.nombre || 'Argentina'}` : null,
			mostrar: !!perfilUsuario.localidad
		},
		{ icon: Activity, theme: 'bg-emerald-50 text-emerald-600', label: 'Estado', valor: perfilUsuario.estado, mostrar: true, capitalize: true },
		{
			icon: Calendar, theme: 'bg-amber-50 text-amber-600', label: 'Miembro desde',
			valor: perfilUsuario.created_at
				? new Date(perfilUsuario.created_at).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })
				: 'No disponible',
			mostrar: true
		}
	].filter((i) => i.mostrar));
</script>

<div class="mt-6 border-t border-gray-100 pt-6 sm:mt-8 sm:pt-8">
	<div class="grid w-full grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">

		<!-- Información general -->
		<div>
			<h3 class="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">Información general</h3>
			<div class="divide-y divide-gray-50 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
				{#each infoItems as item, i (item.label)}
					<div
						class="flex items-center gap-4 p-4 transition-colors duration-150 hover:bg-gray-50/80"
						in:fly={{ x: -10, duration: 300, delay: i * 60, easing: cubicOut }}
					>
						<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl {item.theme}">
							<item.icon class="h-4 w-4" />
						</div>
						<div class="min-w-0 flex-1">
							<p class="text-xs font-semibold tracking-wide text-gray-400 uppercase">{item.label}</p>
							<p class="mt-0.5 truncate text-sm font-medium text-gray-900 {item.capitalize ? 'capitalize' : ''}">{item.valor}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Contacto -->
		<div>
			<h3 class="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">Contacto</h3>

			{#if puedeVerContactos}
				{#if contactosVisibles.length > 0}
					<div class="flex flex-col gap-2.5">
						{#each contactosVisibles as contacto, i (contacto.tipo_contacto + contacto.valor)}
							{@const IconComp = getIcon(contacto.tipo_contacto)}
							{@const iconTheme = getIconTheme(contacto.tipo_contacto)}
							<div
								class="group flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3.5 transition-all duration-200 hover:border-gray-200 hover:shadow-md"
								in:fly={{ x: 10, duration: 300, delay: i * 70, easing: cubicOut }}
							>
								<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl {iconTheme} transition-transform duration-200 group-hover:scale-105">
									<IconComp class="h-4 w-4" />
								</div>
								<div class="min-w-0 flex-1">
									<p class="text-xs font-semibold tracking-wide text-gray-400 uppercase">
										{obtenerTextoTipoContacto(contacto.tipo_contacto)}
										{#if contacto.etiqueta}
											<span class="ml-1.5 font-normal normal-case text-gray-400">· {formatearEtiquetaContacto(contacto.etiqueta)}</span>
										{/if}
									</p>
									<p class="mt-0.5 truncate text-sm font-medium text-gray-900 select-all">{contacto.valor}</p>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 p-6 text-center">
						<p class="text-sm text-gray-500">Este usuario no tiene información de contacto pública cargada.</p>
					</div>
				{/if}
			{:else}
				<!-- Estado privado -->
				<div class="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100/60 p-6">
					<div class="pointer-events-none absolute -top-6 -right-6 opacity-[0.04]">
						<Lock class="h-36 w-36" />
					</div>
					<div class="relative z-10 flex flex-col items-center gap-3 text-center">
						<div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
							<Lock class="h-5 w-5 text-gray-400" />
						</div>
						<div>
							<h4 class="text-sm font-semibold text-gray-800">Información privada</h4>
							<p class="mt-1 text-xs leading-relaxed text-pretty text-gray-500">{mensajePrivacidad}</p>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
