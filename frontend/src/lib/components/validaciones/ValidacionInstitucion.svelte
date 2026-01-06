<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Stepper from '$lib/components/ui/Stepper.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { toastStore } from '$lib/stores/toast';
	import { X } from 'lucide-svelte';

	const dispatch = createEventDispatcher<{
		submit: { files: File[] };
		skip: void;
		cancel: void;
	}>();

	export let pasoActual = 3;
	export let pasosTotales = 5;

	type MetodoVerificacion = 'manual' | 'renaper' | 'omitido';

	let metodoSeleccionado: MetodoVerificacion = 'manual';
	let archivosSeleccionados: File[] = [];
	let aceptoDeclaracion = false;
	let errorFormulario: string | null = null;
	let avisoArchivosMostrado = false;

	$: botonEnviarDeshabilitado = !aceptoDeclaracion;

	const renaperDisponible = false;

	const MAX_FILES = 5;

	function actualizarArchivos(event: Event) {
		const input = event.target as HTMLInputElement;
		const nuevosArchivos = Array.from(input.files ?? []);
		let archivosAgregados = 0;
		let duplicadosIgnorados = 0;

		if (nuevosArchivos.length) {
			const archivosValidos: File[] = [];

			nuevosArchivos.forEach((nuevo) => {
				const esDuplicado = archivosSeleccionados.some(
					(existente) => existente.name === nuevo.name && existente.size === nuevo.size
				);

				if (esDuplicado) {
					duplicadosIgnorados++;
				} else {
					archivosValidos.push(nuevo);
				}
			});

			if (archivosSeleccionados.length + archivosValidos.length > MAX_FILES) {
				const espacioDisponible = MAX_FILES - archivosSeleccionados.length;
				if (espacioDisponible > 0) {
					archivosSeleccionados = [
						...archivosSeleccionados,
						...archivosValidos.slice(0, espacioDisponible)
					];
					archivosAgregados = espacioDisponible;
				}

				toastStore.show({
					variant: 'warning',
					title: 'Límite de archivos',
					message: `Solo se permiten hasta ${MAX_FILES} archivos. Se han agregado los que cabían.`
				});
			} else {
				archivosSeleccionados = [...archivosSeleccionados, ...archivosValidos];
				archivosAgregados = archivosValidos.length;
			}

			if (duplicadosIgnorados > 0) {
				toastStore.show({
					variant: 'warning',
					title: 'Archivos duplicados',
					message: `Se ignoraron ${duplicadosIgnorados} archivo(s) que ya estaban en la lista.`
				});
			}

			// Si no se había mostrado el aviso y se agregaron archivos, mostrarlo ahora
			if (!avisoArchivosMostrado && archivosAgregados > 0) {
				toastStore.show({
					variant: 'info',
					title: 'Documentación recibida',
					message: 'Tus archivos se guardan cifrados y nuestro equipo los revisará manualmente.'
				});
				avisoArchivosMostrado = true;
			}
		}

		// Resetear el valor del input para permitir seleccionar los mismos archivos nuevamente si fuera necesario
		input.value = '';
	}

	function removerArchivo(index: number) {
		archivosSeleccionados = archivosSeleccionados.filter((_, i) => i !== index);
	}

	function enviarDocumentos() {
		if (metodoSeleccionado !== 'manual') {
			return;
		}

		if (!archivosSeleccionados.length) {
			errorFormulario = 'Debés adjuntar al menos un documento antes de continuar.';
			return;
		}

		if (!aceptoDeclaracion) {
			errorFormulario = 'Debés aceptar la declaración para continuar.';
			return;
		}

		errorFormulario = null;
		dispatch('submit', { files: archivosSeleccionados });
		toastStore.show({
			variant: 'success',
			title: 'Documentos enviados',
			message:
				'Nuestro equipo está verificando tu documentación. Te avisaremos cuando finalice la revisión.'
		});
	}

	function omitirRevision() {
		metodoSeleccionado = 'omitido';
		errorFormulario = null;
		dispatch('skip');
	}

	function cancelar() {
		errorFormulario = null;
		dispatch('cancel');
	}
</script>

<section class="flex min-h-screen flex-col bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
	<div class="mb-12 sm:mb-16">
		<Stepper {pasoActual} {pasosTotales} />
	</div>

	<div class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8">
		<header class="space-y-4 text-center">
			<h1 class="text-3xl font-bold text-gray-900 sm:text-4xl">
				Verificá la identidad de tu institución
			</h1>
			<p class="mx-auto max-w-2xl text-sm text-gray-600 sm:text-base">
				Elegí el método que prefieras para validar tu institución. Podés cargar documentos ahora o
				dejarlo para más adelante.
			</p>
		</header>

		<fieldset
			class="space-y-6 rounded-3xl bg-white p-6 shadow-xl sm:p-10"
			aria-describedby="metodo-ayuda"
		>
			<legend class="sr-only">Métodos de verificación</legend>
			<div class="grid gap-4 md:grid-cols-3" id="metodo-ayuda">
				<label
					class={`group relative flex cursor-pointer flex-col gap-3 rounded-2xl border p-5 text-left transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 sm:p-6 ${metodoSeleccionado === 'manual' ? 'border-blue-600 bg-blue-50/60 shadow-lg' : 'border-gray-200 bg-white'}`}
				>
					<div class="flex items-center justify-between">
						<div>
							<span class="text-base font-semibold text-gray-900">
								Revisión documental manual
							</span>
							<p class="mt-1 text-sm text-gray-600">
								Subí documentación respaldatoria para que nuestro equipo la revise.
							</p>
						</div>
						<input
							type="radio"
							name="metodo"
							value="manual"
							class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
							bind:group={metodoSeleccionado}
							aria-label="Seleccionar revisión documental manual"
						/>
					</div>
					<span class="text-xs font-medium uppercase tracking-wide text-blue-700">
						Recomendado
					</span>
				</label>

				<label
					class={`group relative flex cursor-not-allowed flex-col gap-3 rounded-2xl border p-5 text-left opacity-60 sm:p-6 ${metodoSeleccionado === 'renaper' ? 'border-blue-600 bg-blue-50/60 shadow-lg' : 'border-gray-200 bg-white'}`}
					aria-disabled="true"
				>
					<div class="flex items-center justify-between">
						<div>
							<span class="text-base font-semibold text-gray-900">RENAPER (próximamente)</span>
							<p class="mt-1 text-sm text-gray-600">Validación con organismos estatales.</p>
						</div>
						<input
							type="radio"
							name="metodo"
							value="renaper"
							class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
							bind:group={metodoSeleccionado}
							aria-label="RENAPER disponible próximamente"
							disabled={!renaperDisponible}
						/>
					</div>
					<span class="text-xs font-medium uppercase tracking-wide text-gray-500"> Bloqueado </span>
				</label>

				<label
					class={`group relative flex cursor-pointer flex-col gap-3 rounded-2xl border p-5 text-left transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 sm:p-6 ${metodoSeleccionado === 'omitido' ? 'border-blue-600 bg-blue-50/60 shadow-lg' : 'border-gray-200 bg-white'}`}
				>
					<div class="flex items-center justify-between">
						<div>
							<span class="text-base font-semibold text-gray-900">Omitir por ahora</span>
							<p class="mt-1 text-sm text-gray-600">
								Podrás completar la verificación cuando lo necesites.
							</p>
						</div>
						<input
							type="radio"
							name="metodo"
							value="omitido"
							class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
							bind:group={metodoSeleccionado}
							aria-label="Omitir verificación por ahora"
						/>
					</div>
					<span class="text-xs font-medium uppercase tracking-wide text-gray-500">
						Sin validación inmediata
					</span>
				</label>
			</div>

			{#if metodoSeleccionado === 'manual'}
				<div
					class="mt-10 space-y-6 rounded-2xl border border-dashed border-blue-200 bg-blue-50/70 p-6 sm:p-8"
				>
					<p class="text-sm text-gray-700 sm:text-base">
						Subí documentos que respalden la existencia y legitimidad de tu institución. Solo los
						revisará nuestro equipo de validación.
					</p>
					<div class="space-y-3 text-sm text-gray-700">
						<p class="font-semibold text-gray-900">Lista de documentos aceptados:</p>
						<ul class="list-disc space-y-1 pl-6">
							<li>Estatuto social o acta constitutiva</li>
							<li>Constancia de CUIT o registro impositivo</li>
							<li>Certificación oficial emitida por organismo estatal</li>
						</ul>
					</div>

					<div class="space-y-2">
						<label class="block text-sm font-medium text-gray-900" for="documentos">
							Documentación respaldatoria
						</label>
						<input
							id="documentos"
							name="documentos"
							type="file"
							class="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
							accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
							multiple
							on:change={actualizarArchivos}
							aria-describedby="ayuda-documentos"
						/>
						<p id="ayuda-documentos" class="text-xs text-gray-500">
							Podés adjuntar varios archivos en formatos PDF, JPG o DOC.
						</p>

						{#if archivosSeleccionados.length}
							<ul
								class="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white text-sm text-gray-700"
							>
								{#each archivosSeleccionados as archivo, i}
									<li class="flex items-center justify-between px-4 py-2">
										<span class="truncate pr-4" title={archivo.name}>{archivo.name}</span>
										<div class="flex items-center gap-4">
											<span class="whitespace-nowrap text-xs text-gray-500"
												>{Math.ceil(archivo.size / 1024)} KB</span
											>
											<button
												type="button"
												class="text-gray-400 transition hover:text-red-500 focus:text-red-500 focus:outline-none"
												on:click={() => removerArchivo(i)}
												aria-label={`Quitar archivo ${archivo.name}`}
											>
												<X class="h-4 w-4" />
											</button>
										</div>
									</li>
								{/each}
							</ul>
						{/if}
					</div>

					<div class="flex items-start gap-3">
						<input
							id="declaracion"
							type="checkbox"
							bind:checked={aceptoDeclaracion}
							class="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
						/>
						<label for="declaracion" class="text-sm text-gray-700">
							Declaro que la información es veraz y autorizo su tratamiento para la verificación de
							identidad
						</label>
					</div>

					{#if errorFormulario}
						<p
							role="alert"
							class="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700"
						>
							{errorFormulario}
						</p>
					{/if}

					<div class="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
						<Button
							type="button"
							variant="secondary"
							label="Cancelar"
							on:click={cancelar}
							customClass="w-full sm:w-auto"
						/>
						<Button
							type="button"
							label="Enviar"
							on:click={enviarDocumentos}
							customClass="w-full sm:w-auto"
							disabled={botonEnviarDeshabilitado}
							ariaDisabled={botonEnviarDeshabilitado}
						/>
					</div>
				</div>
			{:else if metodoSeleccionado === 'renaper'}
				<div
					class="mt-10 space-y-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-600 sm:p-8"
				>
					<p>
						Estamos trabajando para habilitar la verificación automática con RENAPER. Te avisaremos
						cuando esté disponible.
					</p>
				</div>
			{:else}
				<div
					class="mt-10 space-y-6 rounded-2xl border border-dashed border-yellow-200 bg-yellow-50 p-6 text-center text-sm text-gray-700 sm:p-8"
				>
					<p>
						Podés continuar sin verificar tu institución por ahora. Recordá que necesitarás
						completar este paso antes de publicar proyectos.
					</p>
					<div class="flex justify-center">
						<Button type="button" label="Omitir verificación" on:click={omitirRevision} />
					</div>
				</div>
			{/if}
		</fieldset>
	</div>
</section>
