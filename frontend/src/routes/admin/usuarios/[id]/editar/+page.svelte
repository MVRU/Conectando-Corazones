<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Badge from '$lib/components/ui/elementos/Badge.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { mockUsuarios } from '$lib/mocks/mock-usuarios';
	import type { MockUsuarios } from '$lib/mocks/mock-usuarios';
	import type { Usuario } from '$lib/types/Usuario';

	const usuariosArray = Object.values(mockUsuarios as MockUsuarios) as Usuario[];

	let usuarioDetalle: Usuario | undefined;
	let formData: Partial<Usuario> = {};
	let errors: Record<string, string> = {};
	let isLoading = false;

	$: {
		const id = Number($page.params.id);
		usuarioDetalle = usuariosArray.find((u) => u.id_usuario === id);
		if (usuarioDetalle) {
			// Prellenar el formulario con los datos del usuario
			formData = {
				username: usuarioDetalle.username,
				nombre: usuarioDetalle.nombre,
				apellido: usuarioDetalle.apellido,
				fecha_nacimiento: usuarioDetalle.fecha_nacimiento,
				estado: usuarioDetalle.estado,
				rol: usuarioDetalle.rol,
				url_foto: usuarioDetalle.url_foto
			};
		}
	}

	function validarFormulario(): boolean {
		errors = {};

		if (!formData.username || formData.username.trim().length < 3) {
			errors.username = 'El username debe tener al menos 3 caracteres';
		}

		if (!formData.nombre || formData.nombre.trim().length < 2) {
			errors.nombre = 'El nombre es requerido';
		}

		if (!formData.apellido || formData.apellido.trim().length < 2) {
			errors.apellido = 'El apellido es requerido';
		}

		if (!formData.rol) {
			errors.rol = 'El rol es requerido';
		}

		return Object.keys(errors).length === 0;
	}

	async function guardarUsuario() {
		if (!validarFormulario() || !usuarioDetalle) {
			return;
		}

		isLoading = true;

		try {
			// TODO: Aquí se haría la llamada al backend para actualizar el usuario
			console.log('Actualizando usuario:', formData);

			// Simulación de actualización exitosa
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Redirigir al detalle del usuario
			goto(`/admin/usuarios/${usuarioDetalle.id_usuario}`);
		} catch (error) {
			console.error('Error al actualizar usuario:', error);
			alert('Error al actualizar el usuario. Por favor, intenta nuevamente.');
		} finally {
			isLoading = false;
		}
	}

	function formatearFechaParaInput(fecha?: Date): string {
		if (!fecha) return '';
		const date = new Date(fecha);
		return date.toISOString().split('T')[0];
	}
</script>

<svelte:head>
	<title>Editar usuario - Panel admin</title>
</svelte:head>

{#if !usuarioDetalle}
	<div class="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
		<p class="text-sm font-medium text-red-800">Usuario no encontrado</p>
		<Button
			label="Volver a usuarios"
			variant="secondary"
			size="sm"
			type="button"
			on:click={() => goto('/admin/usuarios')}
		/>
	</div>
{:else}
	<div class="space-y-6">
		<!-- Header -->
		<div class="flex items-center justify-between gap-4">
			<div>
				<Badge text="Usuarios" />
				<h1 class="mt-3 text-2xl font-bold text-gray-900">
					Editar usuario: {usuarioDetalle.nombre} {usuarioDetalle.apellido}
				</h1>
				<p class="mt-1 text-sm text-gray-600">Modifica la información del usuario</p>
			</div>
			<Button
				label="Cancelar"
				variant="secondary"
				size="sm"
				type="button"
				on:click={() => goto(`/admin/usuarios/${usuarioDetalle?.id_usuario}`)}
			/>
		</div>

		<!-- Formulario -->
		<form on:submit|preventDefault={guardarUsuario} class="space-y-6">
			<div class="grid gap-6 lg:grid-cols-2">
				<!-- Información básica -->
				<section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<h2 class="mb-4 text-lg font-semibold text-gray-900">Información básica</h2>

					<div class="space-y-4">
						<div>
							<label for="username" class="block text-sm font-medium text-gray-700">
								Username <span class="text-red-500">*</span>
							</label>
							<input
								id="username"
								type="text"
								bind:value={formData.username}
								required
								class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
								class:border-red-300={errors.username}
							/>
							{#if errors.username}
								<p class="mt-1 text-sm text-red-600">{errors.username}</p>
							{/if}
						</div>

						<div>
							<label for="nombre" class="block text-sm font-medium text-gray-700">
								Nombre <span class="text-red-500">*</span>
							</label>
							<input
								id="nombre"
								type="text"
								bind:value={formData.nombre}
								required
								class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
								class:border-red-300={errors.nombre}
							/>
							{#if errors.nombre}
								<p class="mt-1 text-sm text-red-600">{errors.nombre}</p>
							{/if}
						</div>

						<div>
							<label for="apellido" class="block text-sm font-medium text-gray-700">
								Apellido <span class="text-red-500">*</span>
							</label>
							<input
								id="apellido"
								type="text"
								bind:value={formData.apellido}
								required
								class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
								class:border-red-300={errors.apellido}
							/>
							{#if errors.apellido}
								<p class="mt-1 text-sm text-red-600">{errors.apellido}</p>
							{/if}
						</div>

						<div>
							<label for="fecha_nacimiento" class="block text-sm font-medium text-gray-700">
								Fecha de nacimiento
							</label>
							<input
								id="fecha_nacimiento"
								type="date"
								value={formatearFechaParaInput(formData.fecha_nacimiento)}
								on:change={(e) => {
									const value = (e.currentTarget as HTMLInputElement).value;
									formData.fecha_nacimiento = value ? new Date(value) : undefined;
								}}
								class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					</div>
				</section>

				<!-- Configuración y estado -->
				<section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<h2 class="mb-4 text-lg font-semibold text-gray-900">Configuración</h2>

					<div class="space-y-4">
						<div>
							<label for="rol" class="block text-sm font-medium text-gray-700">
								Rol <span class="text-red-500">*</span>
							</label>
							<select
								id="rol"
								bind:value={formData.rol}
								required
								class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
								class:border-red-300={errors.rol}
							>
								<option value="administrador">Administrador</option>
								<option value="institucion">Institución</option>
								<option value="colaborador">Colaborador</option>
							</select>
							{#if errors.rol}
								<p class="mt-1 text-sm text-red-600">{errors.rol}</p>
							{/if}
						</div>

						<div>
							<label for="estado" class="block text-sm font-medium text-gray-700">Estado</label>
							<select
								id="estado"
								bind:value={formData.estado}
								class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="activo">Activo</option>
								<option value="pendiente">Pendiente</option>
								<option value="inactivo">Inactivo</option>
								<option value="suspendido">Suspendido</option>
							</select>
						</div>

						<div>
							<label for="url_foto" class="block text-sm font-medium text-gray-700">URL de foto</label>
							<input
								id="url_foto"
								type="url"
								bind:value={formData.url_foto}
								placeholder="https://ejemplo.com/foto.jpg"
								class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label for="password" class="block text-sm font-medium text-gray-700">
								Nueva contraseña
							</label>
							<input
								id="password"
								type="password"
								placeholder="Dejar vacío para no cambiar"
								class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<p class="mt-1 text-xs text-gray-500">
								Deja este campo vacío si no deseas cambiar la contraseña
							</p>
						</div>
					</div>
				</section>
			</div>

			<!-- Botones de acción -->
			<div class="flex justify-end gap-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
				<Button
					label="Cancelar"
					variant="secondary"
					size="sm"
					type="button"
					on:click={() => goto(`/admin/usuarios/${usuarioDetalle?.id_usuario}`)}
				/>
				<Button
					label={isLoading ? 'Guardando...' : 'Guardar cambios'}
					variant="primary"
					size="sm"
					type="submit"
					disabled={isLoading}
					loading={isLoading}
				/>
			</div>
		</form>
	</div>
{/if}
