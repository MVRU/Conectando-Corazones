<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import {
		ChevronLeft,
		Plus,
		ExternalLink,
		History,
		FileText,
		ArrowUpRight,
		ChevronDown,
		ChevronUp,
		ImageIcon,
		Pencil,
		Download,
		CheckCircle,
		X,
		Upload,
		FileStack,
		Target,
		Info
	} from 'lucide-svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';

	import { usuario } from '$lib/stores/auth';
	import { fade, slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import type { Archivo } from '$lib/domain/types/Archivo';
	import { toastStore } from '$lib/stores/toast';
	import { fly } from 'svelte/transition';
	import ObjetivosProyecto from '$lib/components/feature/proyectos/ObjetivosProyecto.svelte';

	let { data } = $props();
	const projectIdUrl = $page.params.id;

	let misAportes = $state(data.aportes.map((a: any) => ({ ...a, expanded: false })));

	function toggleExpand(index: number) {
		misAportes[index].expanded = !misAportes[index].expanded;
	}

	let esEstadoPermitido = $derived(
		data.proyecto?.estado === 'en_curso' || data.proyecto?.estado === 'pendiente_solicitud_cierre'
	);

	let historialRecent = $derived(
		misAportes.length > 0
			? [
					{
						id: 1,
						accion: 'Aporte registrado',
						fecha: new Date().toLocaleDateString('es-AR'),
						detalle: 'Subiste un comprobante de transferencia'
					}
				]
			: []
	);

	function irANuevoAporte() {
		goto(`/colaborador/proyectos/${projectIdUrl}/mis-aportes/nuevo`);
	}

	function volver() {
		goto(`/proyectos/${projectIdUrl}`);
	}

	function formatoNumero(valor: number): string {
		return new Intl.NumberFormat('es-AR', {
			style: 'decimal',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(valor);
	}

	function getIconForFile(tipo: string | undefined) {
		return tipo?.includes('pdf') ? FileText : ImageIcon;
	}

	let showEditModal = $state(false);
	let currentEditingFile = $state<Archivo | null>(null);
	let newDescription = $state('');
	let newFile = $state<File | null>(null);

	function editarEvidencia(archivo: Archivo) {
		currentEditingFile = archivo;
		newDescription = archivo.descripcion || '';
		newFile = null;
		showEditModal = true;
	}

	function closeEditModal() {
		showEditModal = false;
		currentEditingFile = null;
		newDescription = '';
		newFile = null;
	}

	function handleNewFileSelection(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			newFile = input.files[0];
			if (!newDescription) {
				newDescription = newFile.name;
			}
		}
		input.value = '';
	}

	function saveEvidenceEdit() {
		console.log('Saving evidence edit:', {
			id: currentEditingFile?.id_archivo,
			newDescription,
			newFile
		});

		toastStore.show({
			variant: 'success',
			title: 'Evidencia actualizada',
			message: 'Los cambios se han guardado correctamente (simulado).'
		});

		closeEditModal();
	}
</script>

<div class="min-h-screen bg-slate-50/30 pb-10 md:pb-20">
	<div class="mx-auto max-w-7xl px-4 md:px-6" in:fade>
		<!-- Header -->
		<header class="animate-fade-in-up mb-12 pt-6 pb-6 md:mb-16 md:pt-12">
			<div class="flex flex-col items-center">
				<div class="mb-6 flex w-full justify-start md:mb-8">
					<button
						onclick={volver}
						class="rounded-full border border-slate-200 p-2 text-slate-400 shadow-sm transition-all hover:bg-white hover:text-slate-600"
						aria-label="Volver"
					>
						<ChevronLeft size={24} />
					</button>
				</div>

				<div class="text-center">
					<h1 class="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
						Mis aportes
					</h1>
					<p class="mx-auto mt-8 max-w-2xl text-lg text-gray-500">
						Gestioná tus colaboraciones en <span class="font-bold text-gray-700"
							>{data.proyecto?.titulo}</span
						>. Revisá el detalle de lo que sumaste al proyecto.
					</p>
				</div>

				{#if esEstadoPermitido}
					<div class="mt-8">
						<Button
							label="Nuevo aporte"
							icon={Plus}
							onclick={irANuevoAporte}
							size="md"
							customClass="shadow-lg shadow-blue-200"
						/>
					</div>
				{:else}
					<div
						class="mt-8 flex items-start gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 shadow-sm md:p-5"
					>
						<div class="shrink-0 rounded-lg bg-blue-100 p-2 text-blue-600">
							<Info size={24} />
						</div>
						<div class="text-left">
							<h3 class="text-sm font-bold text-blue-900 md:text-base">
								Recepción de aportes finalizada
							</h3>
							<p class="mt-1 text-sm leading-relaxed text-blue-700/80">
								El proyecto ya no acepta nuevos aportes ni modificaciones en las evidencias
								existentes debido a su estado actual (<span class="font-italic font-bold"
									>{data.proyecto?.estado}</span
								>).
							</p>
						</div>
					</div>
				{/if}
			</div>
		</header>

		<div class="space-y-4">
			<div class="flex items-center justify-between border-b border-slate-200 pb-2">
				<h2 class="text-lg font-bold tracking-tight text-slate-800 md:text-xl">
					Mis aportes registrados
				</h2>
				<span class="text-[10px] font-bold tracking-widest text-slate-400 uppercase md:text-xs">
					{misAportes.length} <span class="hidden sm:inline">Aportes realizados</span>
				</span>
			</div>

			<div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
				<!-- Main Content: Aportes List -->
				<div class="space-y-6 lg:col-span-2">
					{#if misAportes.length === 0}
						<div
							class="flex flex-col items-center rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-16 text-center"
						>
							<div
								class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50"
							>
								<ArrowUpRight size={40} class="text-slate-300" />
							</div>
							<h3 class="mb-2 text-lg font-bold text-slate-800 md:text-xl">
								Aún no realizaste aportes
							</h3>
							<p class="mx-auto mb-8 max-w-md text-slate-500">
								Tus contribuciones ayudan a cumplir los objetivos del proyecto. ¡Comenzá ahora!
							</p>
							{#if esEstadoPermitido}
								<Button
									label="Realizar mi primer aporte"
									onclick={irANuevoAporte}
									variant="secondary"
								/>
							{/if}
						</div>
					{:else}
						<div class="space-y-4">
							{#each misAportes as aporte, i}
								<div
									class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-blue-300 md:rounded-2xl"
									transition:slide={{ delay: i * 50 }}
								>
									<!-- Header del aporte (Acordeón) -->
									<button
										class="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-slate-50/80 md:gap-4 md:p-5"
										onclick={() => toggleExpand(i)}
									>
										<div
											class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 font-black text-blue-600 uppercase md:h-12 md:w-12 md:rounded-xl"
										>
											#{i + 1}
										</div>

										<div class="min-w-0 flex-1">
											<h3
												class="truncate text-sm leading-tight font-bold text-slate-900 md:text-lg"
											>
												{aporte.participacion_permitida?.tipo_participacion?.descripcion ||
													'Aporte'}
												{#if aporte.participacion_permitida?.especie}
													- {aporte.participacion_permitida.especie}
												{/if}
											</h3>
											<div class="mt-0.5 flex items-center gap-2">
												<span class="text-sm font-bold text-slate-900 md:text-base">
													{formatoNumero(aporte.cantidad)}
												</span>
												<span
													class="text-[10px] font-bold tracking-wider text-slate-500 uppercase md:text-xs"
												>
													{aporte.participacion_permitida?.unidad_medida}
												</span>
											</div>
										</div>

										<div class="text-slate-300">
											{#if aporte.expanded}
												<ChevronUp size={20} />
											{:else}
												<ChevronDown size={20} />
											{/if}
										</div>
									</button>

									<!-- Contenido expandible (Evidencias) -->
									{#if aporte.expanded}
										{@const inputEvidences = aporte.evidenciasEntrada || []}
										{@const outputEvidences = aporte.evidenciasSalida || []}
										<div
											class="space-y-6 border-t border-slate-100 bg-slate-50/50 p-4 md:p-6"
											transition:slide
										>
											<!-- Evidencias de Entrada -->
											<div>
												<h4
													class="mb-3 flex items-center gap-2 text-xs font-bold tracking-wider text-slate-400 uppercase"
												>
													<span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
													Tus evidencias (Entrada)
												</h4>
												<div class="space-y-2">
													{#if inputEvidences.length > 0}
														{#each inputEvidences as file}
															{@const Icon = getIconForFile(file.tipo_mime)}
															<div
																class="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all hover:border-blue-300"
															>
																<div class="flex items-center gap-3 overflow-hidden">
																	<div class="shrink-0 rounded-lg bg-blue-50 p-2 text-blue-500">
																		<Icon size={18} />
																	</div>
																	<div class="min-w-0">
																		<p class="truncate text-sm font-bold text-slate-800">
																			{file.descripcion || file.nombre_original}
																		</p>
																		<div
																			class="mt-0.5 flex items-center gap-2 text-[10px] text-slate-500"
																		>
																			<span
																				>{((file.tamanio_bytes || 0) / (1024 * 1024)).toFixed(2)} MB</span
																			>
																			<span>•</span>
																			<span
																				>{new Date(
																					file.created_at || new Date()
																				).toLocaleDateString('es-AR')}</span
																			>
																		</div>
																	</div>
																</div>
																<div class="flex items-center gap-1">
																	{#if esEstadoPermitido}
																		<button
																			class="rounded-lg p-2 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600"
																			title="Editar"
																			onclick={() => editarEvidencia(file)}
																		>
																			<Pencil size={16} />
																		</button>
																	{/if}
																	{#if file.url}
																		<a
																			href={file.url}
																			target="_blank"
																			class="rounded-lg p-2 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600"
																			title="Ver"
																		>
																			<ExternalLink size={16} />
																		</a>
																	{/if}
																</div>
															</div>
														{/each}
													{:else}
														<p class="pl-3 text-xs text-slate-400 italic">
															No cargaste evidencias para este aporte.
														</p>
													{/if}
												</div>
											</div>

											<!-- Evidencias de Salida -->
											<div>
												<h4
													class="mb-3 flex items-center gap-2 text-xs font-bold tracking-wider text-slate-400 uppercase"
												>
													<span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
													Evidencias de la Institución (Salida)
												</h4>
												<div class="space-y-2">
													{#if outputEvidences.length > 0}
														{#each outputEvidences as file}
															{@const Icon = getIconForFile(file.tipo_mime)}
															<div
																class="group flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/30 p-3 shadow-sm transition-all hover:border-emerald-300"
															>
																<div class="flex items-center gap-3 overflow-hidden">
																	<div
																		class="shrink-0 rounded-lg border border-emerald-50 bg-white p-2 text-emerald-500 shadow-sm"
																	>
																		<Icon size={18} />
																	</div>
																	<div class="min-w-0">
																		<p class="truncate text-sm font-bold text-slate-800">
																			{file.descripcion || file.nombre_original}
																		</p>
																		<div
																			class="mt-0.5 flex items-center gap-2 text-[10px] text-emerald-700"
																		>
																			<span>Institución</span>
																			<span>•</span>
																			<span
																				>{new Date(
																					file.created_at || new Date()
																				).toLocaleDateString('es-AR')}</span
																			>
																		</div>
																	</div>
																</div>
																<div class="flex items-center gap-1">
																	{#if file.url}
																		<a
																			href={file.url}
																			target="_blank"
																			class="rounded-lg p-2 text-emerald-400 transition-all hover:bg-emerald-100 hover:text-emerald-700"
																			title="Ver"
																		>
																			<ExternalLink size={16} />
																		</a>
																		<a
																			href={file.url}
																			download
																			class="hidden rounded-lg p-2 text-emerald-400 transition-all hover:bg-emerald-100 hover:text-emerald-700 sm:block"
																			title="Descargar"
																		>
																			<Download size={16} />
																		</a>
																	{/if}
																</div>
															</div>
														{/each}
													{:else}
														<div
															class="rounded-xl border border-dashed border-slate-200 bg-white/50 p-4 text-center"
														>
															<p class="text-xs text-slate-400">
																La institución aún no ha cargado evidencias de salida.
															</p>
														</div>
													{/if}
												</div>
											</div>
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Sidebar Objectives -->
				<div class="hidden lg:col-span-1 lg:block">
					<ObjetivosProyecto participacion_permitida={data.proyecto?.participacion_permitida} />
				</div>

				<!-- Mobile Objectives (Visible only on small screens) -->
				<div class="mt-8 lg:hidden">
					<ObjetivosProyecto participacion_permitida={data.proyecto?.participacion_permitida} />
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Modal de Edición -->
{#if showEditModal}
	<div
		class="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-0 backdrop-blur-md sm:items-center sm:p-4"
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-edit-title"
		tabindex="-1"
		transition:fade={{ duration: 200 }}
		onclick={(e) => {
			if (e.target === e.currentTarget) closeEditModal();
		}}
		onkeydown={(e) => {
			if (e.key === 'Escape') closeEditModal();
		}}
	>
		<div
			class="flex w-full max-w-lg flex-col overflow-hidden rounded-t-[2.5rem] bg-white shadow-2xl transition-all sm:rounded-[2.5rem]"
			transition:fly={{ y: 100, duration: 300 }}
		>
			<header class="relative border-b border-slate-50 bg-white p-6 pb-4 sm:p-10 sm:pb-6">
				<div class="flex items-center gap-4 sm:gap-6">
					<div
						class="shrink-0 rounded-xl bg-blue-600 p-3 text-white shadow-lg shadow-blue-100 sm:rounded-[1.25rem] sm:p-4"
					>
						<FileStack size={24} strokeWidth={2.5} />
					</div>

					<div class="min-w-0 flex-1 text-left">
						<h3
							id="modal-edit-title"
							class="truncate text-xl leading-none font-extrabold tracking-tight text-slate-900 sm:text-2xl"
						>
							Editar evidencia
						</h3>
						<p
							class="mt-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase sm:text-xs"
						>
							Colaboración verificable
						</p>
					</div>

					<button
						onclick={closeEditModal}
						class="shrink-0 rounded-full p-2 text-slate-400 transition-all hover:bg-slate-100 active:scale-90"
					>
						<X size={24} />
					</button>
				</div>
			</header>

			<div class="space-y-6 p-6 sm:p-10">
				<!-- File Display/Upload -->
				<div class="space-y-4">
					<div
						class="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-900 uppercase sm:text-[11px]"
					>
						<FileText size={16} class="text-blue-600" />
						<h3>Documento adjunto</h3>
					</div>

					{#if newFile}
						<div
							class="group flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50/50 p-4 transition-all"
						>
							<div class="flex items-center gap-3 overflow-hidden">
								<div class="shrink-0 rounded-xl bg-white p-2.5 text-blue-600 shadow-sm">
									<Upload size={20} />
								</div>
								<div class="min-w-0">
									<p class="truncate text-sm font-bold text-slate-800">{newFile.name}</p>
									<p class="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
										{(newFile.size / (1024 * 1024)).toFixed(2)} MB • Nuevo
									</p>
								</div>
							</div>
							<button
								onclick={() => (newFile = null)}
								class="p-2 text-slate-400 transition-colors hover:text-red-500"
							>
								<X size={18} />
							</button>
						</div>
					{:else}
						<div
							class="group mb-3 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all"
						>
							<div class="flex items-center gap-3 overflow-hidden">
								<div class="shrink-0 rounded-xl bg-white p-2.5 text-slate-400 shadow-sm">
									{#if currentEditingFile}
										{@const Icon = getIconForFile(currentEditingFile.tipo_mime)}
										<Icon size={20} />
									{:else}
										<FileText size={20} />
									{/if}
								</div>
								<div class="min-w-0">
									<p class="truncate text-sm font-bold text-slate-800">
										{currentEditingFile?.nombre_original}
									</p>
									<p class="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
										Archivo actual
									</p>
								</div>
							</div>
						</div>

						<label class="group block w-full cursor-pointer">
							<div
								class="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center transition-all group-hover:border-blue-300 group-hover:bg-blue-50/30"
							>
								<div
									class="rounded-lg bg-slate-50 p-2 text-blue-500 transition-transform group-hover:scale-110"
								>
									<Plus size={20} />
								</div>
								<p class="text-sm font-bold text-blue-600">Reemplazar archivo</p>
								<p class="text-[10px] font-black tracking-widest text-slate-400 uppercase">
									Imágenes o PDF hasta 10MB
								</p>
								<input
									type="file"
									class="hidden"
									accept="image/*,.pdf"
									onchange={handleNewFileSelection}
								/>
							</div>
						</label>
					{/if}
				</div>

				<!-- Description Input -->
				<div class="space-y-4">
					<div
						class="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-900 uppercase sm:text-[11px]"
					>
						<Pencil size={16} class="text-slate-400" />
						<label for="edit-desc">Descripción del aporte</label>
					</div>
					<input
						id="edit-desc"
						type="text"
						bind:value={newDescription}
						placeholder="Ej: Comprobante de transferencia..."
						class="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700 shadow-inner transition-all outline-none placeholder:text-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
					/>
				</div>
			</div>

			<footer
				class="flex flex-col-reverse items-center gap-4 border-t border-slate-100 bg-white p-6 py-5 sm:flex-row sm:justify-between sm:px-10 sm:py-6"
			>
				<button
					onclick={closeEditModal}
					class="w-full px-6 py-2 text-xs font-bold text-slate-400 transition-colors hover:text-slate-800 sm:w-auto sm:text-sm"
				>
					Cerrar ventana
				</button>

				<div class="flex w-full justify-center sm:w-auto sm:justify-end">
					<Button
						label="Guardar cambios"
						onclick={saveEvidenceEdit}
						disabled={!newDescription}
						size="md"
						customClass="w-full sm:w-auto shadow-lg shadow-blue-200/50"
					/>
				</div>
			</footer>
		</div>
	</div>
{/if}
