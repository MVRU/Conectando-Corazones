<script lang="ts">
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import Image from '$lib/components/ui/elementos/Image.svelte';
	import type {
		Usuario,
		Institucion,
		Organizacion,
		Unipersonal,
		Administrador
	} from '$lib/types/Usuario';
	import { mockUsuarios } from '$lib/mocks/mock-usuarios';
	import { mockCategorias } from '$lib/mocks/mock-categorias';

	// Usamos un usuario real de los mocks
	let usuario: Usuario | Institucion | Organizacion | Unipersonal | Administrador =
		mockUsuarios.maria_gonzalez;

	// --- Información personal ---
	let nombre = `${usuario.nombre} ${usuario.apellido}`;
	let email = usuario.contactos?.find((c) => c.tipo_contacto === 'email')?.valor || '';
	let telefono = usuario.contactos?.find((c) => c.tipo_contacto === 'telefono')?.valor || '';
	let perfil = usuario.url_foto || '';
	let nuevaFoto: File | null = null;

	function handleFotoChange(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (file) {
			nuevaFoto = file;
			// Preview de la nueva foto
			const reader = new FileReader();
			reader.onload = (e) => {
				perfil = e.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	// --- Preferencias de categorías
	let preferencias: number[] = usuario.categorias_preferidas?.map((cat) => cat.id_categoria!) || [];

	function toggleCategoria(categoriaId: number) {
		if (preferencias.includes(categoriaId)) {
			preferencias = preferencias.filter((id) => id !== categoriaId);
		} else {
			preferencias = [...preferencias, categoriaId];
		}
	}

	// --- Preferencias de notificaciones ---
	let notificacionesPush = true;
	let notificacionesMail = true;

	// --- Seguridad ---
	let passActual = '';
	let passNueva = '';
	let passConfirm = '';

	function guardarCambios() {
		console.log('=== GUARDANDO CAMBIOS ===');
		console.log('Usuario ID:', usuario.id_usuario);
		console.log('Teléfono actualizado:', telefono);
		console.log('URL foto actualizada:', perfil);
		console.log('Notificaciones Push:', notificacionesPush);
		console.log('Notificaciones Mail:', notificacionesMail);
		console.log('Preferencias de categorías:', preferencias);
		console.log(
			'Categorías seleccionadas:',
			mockCategorias
				.filter((cat) => preferencias.includes(cat.id_categoria!))
				.map((cat) => cat.descripcion)
		);

		// Simular persistencia
		alert('Cambios guardados exitosamente');
	}

	function cambiarPassword() {
		// Validar que las contraseñas coincidan
		if (passNueva !== passConfirm) {
			console.error('Error: Las contraseñas no coinciden');
			alert('Error: Las contraseñas no coinciden');
			return;
		}

		// Validar que se ingresó una contraseña
		if (!passNueva.trim()) {
			console.error('Error: La nueva contraseña no puede estar vacía');
			alert('Error: La nueva contraseña no puede estar vacía');
			return;
		}

		// Validar contraseña actual (simulado)
		if (!passActual.trim()) {
			console.error('Error: Debe ingresar la contraseña actual');
			alert('Error: Debe ingresar la contraseña actual');
			return;
		}

		console.log('=== CAMBIO DE CONTRASEÑA ===');
		console.log('Usuario ID:', usuario.id_usuario);
		console.log('Contraseña actual verificada:', '✓');
		console.log('Nueva contraseña validada:', '✓');
		console.log('Contraseñas coinciden:', '✓');

		// Limpiar campos
		passActual = '';
		passNueva = '';
		passConfirm = '';

		alert('Contraseña cambiada exitosamente');
	}

	// --- Iconos para categorías ---
	const categoriaIconos: Record<string, string> = {
		Medioambiente: '🌱',
		Educación: '📚',
		Salud: '➕',
		'Desarrollo económico': '💼',
		'Promoción de la paz': '☮️',
		Seguridad: '�️',
		Entretenimiento: '🎭',
		Liderazgo: '👑',
		'Personas con discapacidades': '♿',
		Tecnología: '�',
		Política: '🏛️',
		Religión: '🙏',
		'LGTBQ+': '🏳️‍🌈',
		'Apoyo ante una crisis': '🆘',
		Empleo: '💼',
		'Inmigrantes y refugiados': '�',
		Otro: '🔧'
	};

	let showDeleteModal = false;
	function eliminarCuenta() {
		showDeleteModal = true;
	}
	function confirmarEliminarCuenta() {
		console.log('=== ELIMINAR CUENTA ===');
		console.log('Usuario eliminado:', usuario.id_usuario);
		showDeleteModal = false;
		alert('Cuenta eliminada (simulación)');
	}
	function cancelarEliminarCuenta() {
		showDeleteModal = false;
	}
</script>

<div class="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
	<!-- Información personal -->
	<section class="mb-12 rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl">
		<h2
			class="mb-8 bg-gradient-to-r from-[#007fff] via-[#68b4ff] to-[#007fff] bg-clip-text text-2xl font-bold text-transparent"
		>
			Información personal
		</h2>
		<form class="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
			<div class="flex flex-col items-center gap-4 md:col-span-1">
				<div
					class="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-blue-100 bg-gray-100 shadow"
				>
					<Image
						src={perfil || '/users/escuela-esperanza.jpg'}
						alt="Foto de perfil"
						variant="circle"
					/>
				</div>
				<label class="mt-2 block">
					<span class="text-sm text-gray-500">Cambiar foto</span>
					<input
						type="file"
						accept="image/*"
						class="mt-1 block w-full text-sm file:rounded-2xl file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700"
						on:change={handleFotoChange}
					/>
				</label>
			</div>
			<div class="grid grid-cols-1 gap-6 md:col-span-2">
				<label class="block">
					<span class="font-medium text-gray-700">Nombre completo</span>
					<input
						type="text"
						bind:value={nombre}
						class="mt-1 block w-full cursor-not-allowed rounded-3xl border border-gray-200 bg-gray-100 px-5 py-3 text-gray-400 shadow-sm"
						readonly
						disabled
					/>
				</label>
				<label class="block">
					<span class="font-medium text-gray-700">Email</span>
					<input
						type="email"
						bind:value={email}
						class="mt-1 block w-full cursor-not-allowed rounded-3xl border border-gray-200 bg-gray-100 px-5 py-3 text-gray-400 shadow-sm"
						readonly
						disabled
					/>
				</label>
				<label class="block">
					<span class="font-medium text-gray-700"
						>Teléfono <span class="font-normal text-gray-400">(opcional)</span></span
					>
					<input
						type="tel"
						bind:value={telefono}
						class="mt-1 block w-full rounded-3xl border border-gray-200 px-5 py-3 shadow-sm focus:ring-2 focus:ring-blue-200"
					/>
				</label>
			</div>
		</form>
		<div class="mt-8 flex justify-end">
			<Button label="Guardar cambios" variant="primary" on:click={guardarCambios} />
		</div>
	</section>

	<!-- Preferencias de categorías (solo colaborador) -->
	{#if usuario.rol === 'colaborador'}
		<section class="mb-12 rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl">
			<h2
				class="mb-8 bg-gradient-to-r from-[#007fff] via-[#68b4ff] to-[#007fff] bg-clip-text text-2xl font-bold text-transparent"
			>
				Preferencias de categorías de proyecto
			</h2>
			<div class="mb-6 flex flex-wrap gap-4">
				{#each mockCategorias as categoria}
					<label class="flex cursor-pointer select-none items-center gap-2">
						<input
							type="checkbox"
							checked={preferencias.includes(categoria.id_categoria!)}
							on:change={() => toggleCategoria(categoria.id_categoria!)}
							class="h-5 w-5 rounded-2xl border-gray-300 accent-blue-500 focus:ring-2 focus:ring-blue-200"
						/>
						<span class="text-2xl">{categoriaIconos[categoria.descripcion] || '🔧'}</span>
						<span
							class={preferencias.includes(categoria.id_categoria!)
								? 'font-semibold text-blue-700'
								: 'text-gray-400'}>{categoria.descripcion}</span
						>
					</label>
				{/each}
			</div>
			<!-- Barra de progreso -->
			<div class="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-blue-100">
				<div
					class="h-full rounded-full bg-gradient-to-r from-[#68b4ff] to-[#007fff] transition-all duration-300"
					style="width: {Math.round((preferencias.length / mockCategorias.length) * 100)}%;"
				></div>
			</div>
			<p class="text-sm text-gray-500">
				{preferencias.length} de {mockCategorias.length} categorías seleccionadas
			</p>
		</section>
	{/if}

	<!-- Preferencias de notificaciones -->
	<section class="mb-12 rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl">
		<h2
			class="mb-8 bg-gradient-to-r from-[#007fff] via-[#68b4ff] to-[#007fff] bg-clip-text text-2xl font-bold text-transparent"
		>
			Preferencias de notificaciones
		</h2>
		<div class="flex flex-col gap-4 md:flex-row md:gap-10">
			<label class="flex cursor-pointer select-none items-center gap-3">
				<span class="text-gray-700">Push</span>
				<input type="checkbox" bind:checked={notificacionesPush} class="sr-only" />
				<div
					class="relative h-6 w-11 rounded-full transition-colors duration-300"
					class:bg-blue-500={notificacionesPush}
					class:bg-gray-200={!notificacionesPush}
				>
					<div
						class="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-300"
						class:translate-x-0={!notificacionesPush}
						class:translate-x-5={notificacionesPush}
					></div>
				</div>
				<span class="ml-2 text-sm text-gray-500"
					>{notificacionesPush ? 'Activado' : 'Desactivado'}</span
				>
			</label>
			<label class="flex cursor-pointer select-none items-center gap-3">
				<span class="text-gray-700">Mail</span>
				<input type="checkbox" bind:checked={notificacionesMail} class="sr-only" />
				<div
					class="relative h-6 w-11 rounded-full transition-colors duration-300"
					class:bg-blue-500={notificacionesMail}
					class:bg-gray-200={!notificacionesMail}
				>
					<div
						class="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-300"
						class:translate-x-0={!notificacionesMail}
						class:translate-x-5={notificacionesMail}
					></div>
				</div>
				<span class="ml-2 text-sm text-gray-500"
					>{notificacionesMail ? 'Activado' : 'Desactivado'}</span
				>
			</label>
		</div>
	</section>

	<!-- Seguridad -->
	<section class="mb-12 rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl">
		<h2
			class="mb-8 bg-gradient-to-r from-[#007fff] via-[#68b4ff] to-[#007fff] bg-clip-text text-2xl font-bold text-transparent"
		>
			Seguridad
		</h2>
		<form class="grid grid-cols-1 items-end gap-8 md:grid-cols-3">
			<label class="block md:col-span-1">
				<span class="font-medium text-gray-700">Contraseña actual</span>
				<input
					type="password"
					bind:value={passActual}
					class="mt-1 block w-full rounded-3xl border border-gray-200 px-5 py-3 shadow-sm focus:ring-2 focus:ring-blue-200"
				/>
			</label>
			<label class="block md:col-span-1">
				<span class="font-medium text-gray-700">Nueva contraseña</span>
				<input
					type="password"
					bind:value={passNueva}
					class="mt-1 block w-full rounded-3xl border border-gray-200 px-5 py-3 shadow-sm focus:ring-2 focus:ring-blue-200"
				/>
			</label>
			<label class="block md:col-span-1">
				<span class="font-medium text-gray-700">Confirmar nueva contraseña</span>
				<input
					type="password"
					bind:value={passConfirm}
					class="mt-1 block w-full rounded-3xl border border-gray-200 px-5 py-3 shadow-sm focus:ring-2 focus:ring-blue-200"
				/>
			</label>
		</form>
		<div class="mt-8 flex justify-end">
			<Button label="Cambiar contraseña" variant="secondary" on:click={cambiarPassword} />
		</div>
		<div
			class="mt-12 flex flex-col gap-6 border-t pt-8 md:flex-row md:items-center md:justify-between"
		>
			<div class="flex items-center gap-3">
				<svg class="h-7 w-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16zm-4-4a4 4 0 118 0 4 4 0 01-8 0z"
					/></svg
				>
				<span class="font-semibold text-red-500">Eliminar cuenta</span>
			</div>
			<Button
				label="Eliminar cuenta"
				variant="ghost"
				customClass="border border-red-300 text-red-500 hover:bg-red-50"
				on:click={eliminarCuenta}
			/>
		</div>
	</section>

	{#if showDeleteModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
			<div class="flex w-full max-w-sm flex-col items-center rounded-2xl bg-white p-8 shadow-xl">
				<svg
					class="mb-4 h-12 w-12 text-red-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16zm-4-4a4 4 0 118 0 4 4 0 01-8 0z"
					/></svg
				>
				<p class="mb-4 text-center text-lg font-semibold text-red-600">
					¿Está seguro de eliminar su cuenta?
				</p>
				<div class="mt-2 flex gap-4">
					<Button label="Cancelar" variant="secondary" on:click={cancelarEliminarCuenta} />
					<Button
						label="Confirmar"
						variant="secondary"
						customClass="bg-red-500 text-white hover:bg-red-600"
						on:click={confirmarEliminarCuenta}
					/>
				</div>
			</div>
		</div>
	{/if}
</div>
