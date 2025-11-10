<script lang="ts">
	import type { Proyecto } from '$lib/types/Proyecto';
	import type { ParticipacionPermitida } from '$lib/types/ParticipacionPermitida';
	import { getEstadoCodigo } from '$lib/utils/util-estados';
	import { getParticipacionVisual } from '$lib/utils/util-proyectos';
	import { ordenarPorProgreso } from '$lib/utils/util-progreso';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import type { ComponentType } from 'svelte';
	import { HandHeart, HelpCircle } from 'lucide-svelte';

	export let proyecto: Proyecto;
	export let mostrarFormulario: () => void;

	const participaciones = ordenarPorProgreso(proyecto.participacion_permitida ?? []);
	const tieneUnSoloObjetivo = participaciones.length === 1;
	const multiplesObjetivos = participaciones.length > 1;
	const unicoObjetivo = tieneUnSoloObjetivo ? participaciones[0] : null;

	 type UnidadInfo = {
                bg: string;
                border: string;
                text: string;
                icon: ComponentType;
                iconBg: string;
                iconColor: string;
                label: string;
                button: string;
                objetivoLabel?: string;
                actualLabel?: string;
	};

	function getUnidadInfo(obj: ParticipacionPermitida | null, multiples: boolean): UnidadInfo {
		if (multiples) {
                        return {
                                bg: 'bg-sky-50',
                                border: 'border-sky-200',
                                text: 'text-sky-900',
                                icon: HandHeart,
                                iconBg: 'bg-sky-100',
                                iconColor: 'text-sky-600',
                                label: 'ayuda múltiple (donaciones, materiales o voluntariado)',
                                button: 'Colaborar ahora'
                        };
                }

                if (!obj) {
                        return {
                                bg: 'bg-gray-50',
                                border: 'border-gray-200',
                                text: 'text-gray-800',
                                icon: HelpCircle,
                                iconBg: 'bg-gray-200',
                                iconColor: 'text-gray-600',
                                label: 'colaboración',
                                button: 'Colaborar'
                        };
                }

                const { color, icono, iconColor, objetivoLabel, actualLabel } = getParticipacionVisual(obj);

                const colorMap: Record<ReturnType<typeof getParticipacionVisual>['color'], {
                        bg: string;
                        border: string;
                        text: string;
                        iconBg: string;
                        label: string;
                        button: string;
                }> = {
                        green: {
                                bg: 'bg-emerald-50',
                                border: 'border-emerald-200',
                                text: 'text-emerald-800',
                                iconBg: 'bg-emerald-100',
                                label: `donaciones monetarias (${obj.unidad_medida || 'pesos'})`,
                                button: 'Donar ahora'
                        },
                        purple: {
                                bg: 'bg-purple-50',
                                border: 'border-purple-200',
                                text: 'text-purple-800',
                                iconBg: 'bg-purple-100',
                                label: 'voluntariado',
                                button: 'Postularme como voluntario'
                        },
                        blue: {
                                bg: 'bg-blue-50',
                                border: 'border-blue-200',
                                text: 'text-blue-800',
                                iconBg: 'bg-sky-100',
                                label: obj.unidad_medida ? `donaciones de ${obj.unidad_medida}` : 'donaciones específicas',
                                button: 'Donar materiales'
                        }
                } as const;

                return {
                        ...colorMap[color],
                        icon: icono,
                        iconColor,
                        objetivoLabel,
                        actualLabel
                };
        }

	const unidadInfo = getUnidadInfo(unicoObjetivo, multiplesObjetivos);

	function ProyectoAbierto() {
		// Estado válido para colaborar: 'en_curso'
		return getEstadoCodigo(proyecto.estado, proyecto.estado_id) === 'en_curso';
	}
</script>

<div
	class="animate-fade-up rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
>
	<h3 class="mb-4 text-center text-lg font-semibold text-gray-800">¿Querés colaborar?</h3>

	{#if multiplesObjetivos}
                <div class={`mb-5 flex items-start gap-3 rounded-lg p-3 ${unidadInfo.bg} ${unidadInfo.border}`}>
                        <span class={`flex h-10 w-10 items-center justify-center rounded-full ${unidadInfo.iconBg}`}>
                                <svelte:component
                                        this={unidadInfo.icon}
                                        class={`h-5 w-5 ${unidadInfo.iconColor}`}
                                        aria-hidden="true"
                                />
                        </span>
                        <p class={`text-sm ${unidadInfo.text}`}>
                                Este proyecto necesita <strong>{unidadInfo.label}</strong>.
                        </p>
                </div>
        {:else if tieneUnSoloObjetivo}
                <div class={`mb-5 flex items-start gap-3 rounded-lg p-3 ${unidadInfo.bg} ${unidadInfo.border}`}>
                        <span class={`flex h-10 w-10 items-center justify-center rounded-full ${unidadInfo.iconBg}`}>
                                <svelte:component
                                        this={unidadInfo.icon}
                                        class={`h-5 w-5 ${unidadInfo.iconColor}`}
                                        aria-hidden="true"
                                />
                        </span>
                        <p class={`text-sm ${unidadInfo.text}`}>
                                Este proyecto necesita <strong>{unidadInfo.label}</strong>.
                                {#if unicoObjetivo}
                                        <span class="mt-1 block text-xs text-gray-500">
                                                Objetivo: {unidadInfo.objetivoLabel}
						{#if unicoObjetivo.actual !== undefined}
							&nbsp;|&nbsp; Actual: {unidadInfo.actualLabel}
						{/if}
					</span>
				{/if}
			</p>
		</div>
	{/if}

	<!-- Acción -->
	{#if ProyectoAbierto()}
		<Button
			label={unidadInfo.button}
			on:click={mostrarFormulario}
			variant="primary"
			size="sm"
			customClass="mb-4 w-full"
		/>
	{:else}
		<div class="mb-4 rounded-lg bg-gray-100 px-4 py-3 text-center text-sm text-gray-500">
			Este proyecto ya no está abierto para nuevas colaboraciones
		</div>
	{/if}

	<!-- Compartir -->
	<Button label="Compartir proyecto" variant="secondary" size="sm" customClass="w-full" />
</div>

<style>
	@keyframes fade-up {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-up {
		animation: fade-up 0.4s ease-out both;
	}
</style>
