<script lang="ts">
	import { goto } from '$app/navigation';
	import Badge from '$lib/components/ui/elementos/Badge.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import type { Usuario } from '$lib/types/Usuario';

	let formData: Partial<Usuario> = {
		username: '',
		password: '',
		nombre: '',
		apellido: '',
		fecha_nacimiento: undefined,
		estado: 'pendiente',
		rol: 'administrador',
		url_foto: ''
	};

	let errors: Record<string, string> = {};
	let isLoading = false;

	function validarFormulario(): boolean {
		errors = {};

		if (!formData.username || formData.username.trim().length < 3) {
			errors.username = 'El username debe tener al menos 3 caracteres';
		}

		if (!formData.password || formData.password.length < 6) {
			errors.password = 'La contraseña debe tener al menos 6 caracteres';
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
		if (!validarFormulario()) {
			return;
		}

		isLoading = true;

		try {
			// TODO: Aquí se haría la llamada al backend para crear el usuario
			console.log('Creando usuario:', formData);

			// Simulación de guardado exitoso
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Redirigir a la lista de usuarios
			goto('/admin/usuarios');
		} catch (error) {
			console.error('Error al crear usuario:', error);
			alert('Error al crear el usuario. Por favor, intenta nuevamente.');
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Crear usuario - Panel admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between gap-4">
		<div>
			<Badge text="Usuarios" />
			<h1 class="mt-3 text-2xl font-bold text-gray-900">Crear nuevo usuario</h1>
			<p class="mt-1 text-sm text-gray-600">Completa el formulario para crear un nuevo usuario</p>
		</div>
		<Button
			label="Cancelar"
			variant="secondary"
			size="sm"
			type="button"
			on:click={() => goto('/admin/usuarios')}
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
						<label for="password" class="block text-sm font-medium text-gray-700">
							Contraseña <span class="text-red-500">*</span>
						</label>
						<input
							id="password"
							type="password"
							bind:value={formData.password}
							required
							class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
							class:border-red-300={errors.password}
						/>
						{#if errors.password}
							<p class="mt-1 text-sm text-red-600">{errors.password}</p>
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
							value={formData.fecha_nacimiento ? new Date(formData.fecha_nacimiento).toISOString().split('T')[0] : ''}
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
				on:click={() => goto('/admin/usuarios')}
			/>
			<Button
				label={isLoading ? 'Guardando...' : 'Guardar usuario'}
				variant="primary"
				size="sm"
				type="submit"
				disabled={isLoading}
				loading={isLoading}
			/>
		</div>
	</form>
</div>
