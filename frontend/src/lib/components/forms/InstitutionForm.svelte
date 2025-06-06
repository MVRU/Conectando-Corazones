<!--
* Componente: InstitutionForm
        -*- Descripción: formulario de registro para instituciones.
        -*- Incluye datos de representante legal y validación básica.
        -*- Usa funciones compartidas para validaciones (email y mayoría de edad).
-->
<script lang="ts">
import Button from '../ui/Button.svelte';
       let sending = false;

       // Datos de la institución
       let nombre = '';
       let tipo = 'Escuela';
       let otroTipo = '';
       let username = '';
       let email = '';
       let cuit = '';
       // Datos del representante
       let repNombre = '';
       let repApellido = '';
       let repDocTipo = 'DNI';
       let repDocOtro = '';
       let repDocNumero = '';
       let repNacimiento = '';
       // Contraseñas
       let password = '';
       let repassword = '';

       // Errores reactivos
       let errors: Record<string, string> = {};
       $: errors = {
               nombre: nombre.trim() ? '' : 'Requerido',
               otroTipo: tipo === 'Otro' && !otroTipo.trim() ? 'Especifique el tipo' : '',
               username: username.trim() ? '' : 'Requerido',
               email: email && isValidEmail(email) ? '' : 'Email inválido',
               cuit: cuit.trim() ? '' : 'CUIT obligatorio',
               repNombre: repNombre.trim() ? '' : 'Requerido',
               repApellido: repApellido.trim() ? '' : 'Requerido',
               repDocOtro: repDocTipo === 'Otro' && !repDocOtro.trim() ? 'Especifique el documento' : '',
               repDocNumero: repDocNumero.trim() ? '' : 'Documento obligatorio',
               repNacimiento: repNacimiento && isAdult(repNacimiento) ? '' : 'Debe ser mayor de 18 años',
               password: password ? '' : 'Requerido',
               repassword: repassword && repassword === password ? '' : 'Las contraseñas no coinciden'
       };
       function handleSubmit(event: Event) {
               event.preventDefault();
                if (Object.values(errors).some(Boolean)) return;
                <label for="nombre" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Nombre de la institución <span class="text-red-600">*</span></label>
                <Input id="nombre" name="nombre" bind:value={nombre} required error={errors.nombre} />
                <label for="tipo" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Tipo de institución <span class="text-red-600">*</span></label>
                <select id="tipo" bind:value={tipo} required class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]">
                        <option>Fundación</option>
                        <option>Asociación</option>
                        <option>Parroquia</option>
                        <label for="otroTipo" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Especifique <span class="text-red-600">*</span></label>
                <label for="username" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Nombre de usuario <span class="text-red-600">*</span></label>
                <Input id="username" name="username" bind:value={username} required error={errors.username} />
                <label for="email" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Email <span class="text-red-600">*</span></label>
                <Input id="email" name="email" type="email" bind:value={email} required error={errors.email} />
                <label for="cuit" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">CUIT <span class="text-red-600">*</span></label>
                <Input id="cuit" name="cuit" bind:value={cuit} required error={errors.cuit} />
                                <label for="repNombre" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Nombre <span class="text-red-600">*</span></label>
                                <Input id="repNombre" name="repNombre" bind:value={repNombre} required error={errors.repNombre} />
                                <label for="repApellido" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Apellido <span class="text-red-600">*</span></label>
                                <Input id="repApellido" name="repApellido" bind:value={repApellido} required error={errors.repApellido} />
                                <label for="repDocTipo" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Tipo de documento <span class="text-red-600">*</span></label>
                                <select id="repDocTipo" bind:value={repDocTipo} class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]">
                        {#if repDocTipo === 'Otro'}
                                <div>
                                        <label for="repDocOtro" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Especifique <span class="text-red-600">*</span></label>
                                        <Input id="repDocOtro" name="repDocOtro" bind:value={repDocOtro} required error={errors.repDocOtro} />
                                </div>
                        {/if}
                                <label for="repDocNumero" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Número <span class="text-red-600">*</span></label>
                                <Input id="repDocNumero" name="repDocNumero" bind:value={repDocNumero} required error={errors.repDocNumero} />
                                <label for="repNacimiento" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Fecha de nacimiento <span class="text-red-600">*</span></label>
                                <DatePicker id="repNacimiento" name="repNacimiento" bind:value={repNacimiento} required error={errors.repNacimiento} />
                <label for="password" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Contraseña <span class="text-red-600">*</span></label>
                <Input id="password" name="password" type="password" bind:value={password} required error={errors.password} />
                <label for="repassword" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Confirmar contraseña <span class="text-red-600">*</span></label>
                <Input id="repassword" name="repassword" type="password" bind:value={repassword} required error={errors.repassword} />
		<Input id="nombre" name="nombre" required error={errors.nombre} />
	</div>
	<div>
		<label for="tipo" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
			>Tipo de institución *</label
		>
		<select
			id="tipo"
			name="tipo"
			bind:value={tipo}
			required
			class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
		>
			<option>Escuela</option>
			<option>Hospital</option>
			<option>Comedor</option>
			<option>Otro</option>
		</select>
	</div>
	{#if tipo === 'Otro'}
		<div>
			<label for="otroTipo" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
				>Especifique *</label
			>
			<Input id="otroTipo" name="otroTipo" bind:value={otroTipo} required error={errors.otroTipo} />
		</div>
	{/if}
	<div>
		<label for="username" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
			>Nombre de usuario *</label
		>
		<Input id="username" name="username" required error={errors.username} />
	</div>
	<div>
		<label for="email" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
			>Email *</label
		>
		<Input id="email" name="email" type="email" required error={errors.email} />
	</div>
	<div>
		<label for="cuit" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
			>CUIT *</label
		>
		<Input id="cuit" name="cuit" required error={errors.cuit} />
	</div>
	<fieldset class="border-t pt-4">
		<legend class="mb-2 text-sm font-semibold">Representante legal</legend>
		<div class="grid gap-4 md:grid-cols-2">
			<div>
				<label for="repNombre" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
					>Nombre *</label
				>
				<Input id="repNombre" name="repNombre" required error={errors.repNombre} />
			</div>
			<div>
				<label
					for="repApellido"
					class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Apellido *</label
				>
				<Input id="repApellido" name="repApellido" required error={errors.repApellido} />
			</div>
			<div>
				<label for="repDocTipo" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
					>Tipo de documento *</label
				>
				<select
					id="repDocTipo"
					name="repDocTipo"
					required
					class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
				>
					<option>DNI</option>
					<option>Pasaporte</option>
					<option>Otro</option>
				</select>
			</div>
			<div>
				<label
					for="repDocNumero"
					class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Número *</label
				>
				<Input id="repDocNumero" name="repDocNumero" required error={errors.repDocNumero} />
			</div>
			<div class="md:col-span-2">
				<label
					for="repNacimiento"
					class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
					>Fecha de nacimiento *</label
				>
				<DatePicker id="repNacimiento" name="repNacimiento" required error={errors.repNacimiento} />
			</div>
		</div>
	</fieldset>
	<div>
		<label for="password" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
			>Contraseña *</label
		>
		<Input id="password" name="password" type="password" required error={errors.password} />
	</div>
	<div>
		<label for="repassword" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
			>Confirmar contraseña *</label
		>
		<Input id="repassword" name="repassword" type="password" required error={errors.repassword} />
	</div>
	<Button label="Continuar" disabled={sending} customClass="w-full" />
</form>
