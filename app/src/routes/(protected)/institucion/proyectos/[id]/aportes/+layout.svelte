<script lang="ts">
	import Button from "$lib/components/ui/elementos/Button.svelte";
	import Badge from "$lib/components/ui/elementos/Badge.svelte";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { 
		User, 
		ChevronDown, 
		ChevronUp, 
		Eye, 
		AlertCircle, 
		Package, 
		CircleDollarSign,
		ShieldCheck,
		Info
	} from "lucide-svelte";
	import { slide, fade } from "svelte/transition";

	let { children } = $props();

	let colaboradores = $state([
		{ 
			id_usuario: 1, 
			nombre: 'Rotaract Club Arrecifes', 
			tipo_colaborador: 'Colaborador - ONG',
			aportes: [{ cosa: 'Tubos de ensayo', cantidad: '50 unidades' }]
		},
		{ 
			id_usuario: 2, 
			nombre: 'Abril Rodriguez', 
			tipo_colaborador: 'Colaborador - Voluntario/a',
			aportes: [{ cosa: 'Donación monetaria', cantidad: '$15.000' }]
		},
		{ 
			id_usuario: 3, 
			nombre: 'Somos docentes', 
			tipo_colaborador: 'Colaborador - ONG',
			aportes: [{ cosa: 'Material didáctico', cantidad: '12 kits' }]
		},
		{ 
			id_usuario: 4, 
			nombre: 'Antonio Abatedaga', 
			tipo_colaborador: 'Colaborador - Voluntario/a',
			aportes: [{ cosa: 'Insumos médicos', cantidad: '100 barbijos' }]
		}
	]);

	let expandedId = $state<number | null>(null);
	const projectId = $page.params.id;

	function toggleColaborador(id: number) {
		expandedId = expandedId === id ? null : id;
	}

	function abrirEvidencias(colaboradorId: number) {
		goto(`/institucion/proyectos/${projectId}/aportes/${colaboradorId}`, { noScroll: true });
	}
</script>

<div class="min-h-screen bg-slate-50/30 pb-10 md:pb-20">
	<div class="max-w-5xl mx-auto px-4 md:px-6" in:fade>
		
		<header class="animate-fade-in-up mb-16 text-center">
			<h1 class="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl pt-12 md:pt-12 pb-6 space-y-2 md:space-y-4">
				Revisar aportes
			</h1>
			<p class="mx-auto mt-8 max-w-2xl text-lg text-gray-500">
				Revisá el detalle de lo que cada colaborador sumó al proyecto. 
				Es fundamental verificar esto antes de rendir cuentas a tu comunidad.
			</p>
		</header>

		<section class="space-y-4">
			<div class="flex items-center justify-between pb-2 border-b border-slate-200">
				<h2 class="text-lg md:text-xl font-bold text-slate-800 tracking-tight">Comunidad</h2>
				<span class="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
					{colaboradores.length} <span class="hidden sm:inline">Colaboradores</span>
				</span>
			</div>
			
			<div class="grid gap-2 md:gap-3">
				{#each colaboradores as colab}
					<div class="border border-slate-200 rounded-xl md:rounded-2xl overflow-hidden bg-white hover:border-blue-300 transition-all shadow-sm">
						<button 
							class="w-full flex items-center gap-3 md:gap-4 p-4 md:p-5 text-left transition-colors hover:bg-slate-50/80"
							onclick={() => toggleColaborador(colab.id_usuario)}
						>
							<div class="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
								<User size={20} class="md:hidden" />
								<User size={24} class="hidden md:block" />
							</div>
							
							<div class="flex-1 min-w-0">
								<h3 class="font-bold text-slate-900 text-sm md:text-lg leading-tight truncate">{colab.nombre}</h3>
								<p class="text-[11px] md:text-sm text-slate-500 truncate">{colab.tipo_colaborador}</p>
							</div>

							<div class="text-slate-300">
								{#if expandedId === colab.id_usuario}
									<ChevronUp size={20} />
								{:else}
									<ChevronDown size={20} />
								{/if}
							</div>
						</button>

						{#if expandedId === colab.id_usuario}
							<div transition:slide={{ duration: 300 }} class="bg-slate-50/50 border-t border-slate-100 p-4 md:p-6">
								<div class="space-y-3 md:space-y-4">
									{#each colab.aportes as aporte}
										<div class="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm">
											<div class="flex items-center gap-3">
												<div class="p-2 md:p-3 bg-blue-50 text-blue-600 rounded-lg md:rounded-xl">
													{#if aporte.cosa.toLowerCase().includes('donación') || aporte.cosa.includes('$')}
														<CircleDollarSign size={18} />
													{:else}
														<Package size={18} />
													{/if}
												</div>
												<div class="min-w-0">
													<p class="font-bold text-slate-800 text-sm md:text-base truncate">{aporte.cosa}</p>
													<p class="text-[11px] md:text-sm text-slate-500 font-medium">Cant: {aporte.cantidad}</p>
												</div>
											</div>
											
											<button 
												class="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-slate-900	 text-white rounded-lg text-xs md:text-sm font-bold active:scale-95"
												onclick={() => abrirEvidencias(colab.id_usuario)}
											>
												<Eye size={14} />
												<span>Ver evidencias</span>
											</button>
										</div>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</section>

		<section class="mt-10 md:mt-16 bg-slate-900 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5">
			<div class="grid md:grid-cols-2 items-center">
				<div class="p-6 md:p-14 space-y-6 md:space-y-8">
					<div class="space-y-3 md:space-y-5">
						<div class="hidden md:flex">
							<Badge text="Rendición de cuentas" />
						</div>

						<h2 class="text-2xl md:text-5xl font-bold text-white leading-tight tracking-tight">
							Rendí cuentas y <br class="hidden md:block" /> generá confianza.
						</h2>
						<p class="text-slate-400 text-sm md:text-lg leading-relaxed">
							Subí fotos o recibos. Ayudá a que los colaboradores vean el impacto de su generosidad.
						</p>
					</div>

					<div class="flex flex-col items-stretch md:items-start gap-4 md:gap-6">
						<Button 
							label="Subir evidencias ahora" 
							variant="ghost" 
						/>

						<div class="flex items-center gap-2 text-slate-500 text-[10px] md:text-sm italic border-t border-slate-800 pt-4 w-full leading-snug">
							<AlertCircle size={14} class="text-blue-500/50 flex-shrink-0" />
							<span>Validación necesaria para el cierre oficial.</span>
						</div>
					</div>
				</div>

				<div class="relative h-48 md:h-full md:min-h-[400px] p-4 md:p-10">
					<div class="relative h-full w-full rounded-2xl md:rounded-3xl overflow-hidden border border-white/10">
						<img 
							src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800" 
							alt="Impacto comunitario" 
							class="object-cover w-full h-full grayscale-[10%] opacity-60 md:opacity-100"
						/>
						<div class="absolute inset-0 bg-gradient-to-t from-slate-900 md:from-[#0f1029]/80 via-transparent to-transparent"></div>
					</div>
				</div>
			</div>
		</section>
	</div>
</div>

<style>
	@keyframes fade-in-up {
		from {
			opacity: 0;
			transform: translateY(24px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fade-in-up {
		animation: fade-in-up 0.5s ease-out forwards;
	}
</style>

{@render children()}
