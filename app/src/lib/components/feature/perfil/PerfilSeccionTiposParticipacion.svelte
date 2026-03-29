<script lang="ts">
	import type { Usuario, Institucion, Organizacion } from '$lib/domain/types/Usuario';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { INFO_TIPOS_PARTICIPACION } from '$lib/utils/constants';
	import { Pencil, Plus, HandHelping } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	type UsuarioCompleto = Usuario | Institucion | Organizacion;

	let { perfilUsuario, esMiPerfil, onEditarClick } = $props<{
		perfilUsuario: UsuarioCompleto;
		esMiPerfil: boolean;
		onEditarClick: () => void;
	}>();

	let tiposParticipacion = $derived(perfilUsuario.tipos_participacion_preferidas || []);
	let tieneTipos = $derived(tiposParticipacion.length > 0);

	const coloresChip: Record<string, string> = {
		'verde':   'border-emerald-100 bg-gradient-to-r from-emerald-50 to-emerald-50/60 text-emerald-700 hover:border-emerald-200 hover:from-emerald-100',
		'azul':    'border-blue-100 bg-gradient-to-r from-blue-50 to-blue-50/60 text-[#007FFF] hover:border-[#007FFF]/30 hover:from-blue-100',
		'morado':  'border-purple-100 bg-gradient-to-r from-purple-50 to-purple-50/60 text-purple-700 hover:border-purple-200 hover:from-purple-100',
		'naranja': 'border-orange-100 bg-gradient-to-r from-orange-50 to-orange-50/60 text-orange-700 hover:border-orange-200 hover:from-orange-100',
		'rojo':    'border-red-100 bg-gradient-to-r from-red-50 to-red-50/60 text-red-700 hover:border-red-200 hover:from-red-100',
		'gray':    'border-gray-100 bg-gradient-to-r from-gray-50 to-gray-50/60 text-gray-700 hover:border-gray-200 hover:from-gray-100'
	};

	function obtenerClaseChip(color: string): string {
		return coloresChip[color] ?? coloresChip['gray'];
	}
</script>

{#if perfilUsuario.rol === 'colaborador'}
	<section>
		<div class="mb-4 flex items-center justify-between">
			<h3 class="flex items-center gap-2 text-sm font-bold text-gray-800">
				<HandHelping class="h-4 w-4 text-emerald-600" />
				{esMiPerfil ? 'Mis formas de participar' : 'Formas de participar'}
			</h3>
			{#if esMiPerfil}
				<button
					onclick={onEditarClick}
					class="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-all duration-200 hover:bg-emerald-100 hover:shadow-sm"
					aria-label="Editar tipos de participación preferidos"
				>
					<Pencil class="h-3 w-3" />
					Editar
				</button>
			{/if}
		</div>

		{#if tieneTipos}
			<div class="flex flex-wrap gap-2">
				{#each tiposParticipacion as tipo, i (tipo.descripcion)}
				{@const key = tipo.descripcion as keyof typeof INFO_TIPOS_PARTICIPACION}
				{@const info = INFO_TIPOS_PARTICIPACION[key] ?? { titulo: tipo.descripcion, color: 'gray', icon: null }}
					<div
						class="group flex cursor-default items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:shadow-sm {obtenerClaseChip(info.color)}"
						in:fly={{ y: 8, duration: 250, delay: i * 50, easing: cubicOut }}
					>
						{#if info.icon}
							<Icon src={info.icon} class="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110" />
						{/if}
						{info.titulo}
					</div>
				{/each}
			</div>
		{:else}
			<div class="group flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white/50 p-8 py-10 text-center transition-all duration-300 hover:border-emerald-200 hover:bg-white hover:shadow-sm">
				<div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-50 group-hover:text-emerald-600">
					<HandHelping class="h-7 w-7" />
				</div>
				
				<h4 class="mb-1 text-sm font-semibold text-gray-800">
					{esMiPerfil ? 'Sin formas de participar' : 'No hay preferencias de participación'}
				</h4>
				
				<p class="max-w-[200px] text-xs leading-relaxed text-gray-500">
					{esMiPerfil 
						? 'Definí cómo te gustaría colaborar para que podamos recomendarte los mejores proyectos.' 
						: 'Este colaborador aún no ha definido sus formas preferidas de participar.'}
				</p>

				{#if esMiPerfil}
					<button
						onclick={onEditarClick}
						class="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-100 transition-all duration-200 hover:bg-emerald-500 hover:shadow-lg active:scale-95"
					>
						<Plus class="h-3.5 w-3.5" />
						Configurar participación
					</button>
				{/if}
			</div>
		{/if}
	</section>
{/if}
