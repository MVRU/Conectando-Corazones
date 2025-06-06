<!--
* Componente: CollaboratorForm
        -*- Descripción: formulario de registro de colaboradores.
        -*- Soporta registro individual u organización con representante.
        -*- Usa funciones compartidas para validaciones (email y mayoría de edad).
-->
<script lang="ts">
import Button from '../ui/Button.svelte';
import DatePicker from './DatePicker.svelte';
import Input from '../ui/Input.svelte';
import { clsx } from 'clsx';
import { isAdult, isValidEmail } from '$lib/utils/validation';

        let sending = false;
        let tipo: 'persona' | 'organizacion' = 'persona';
        let errors: Record<string, string> = {};

        function handleSubmit(event: Event) {
                event.preventDefault();
                const data = new FormData(event.target as HTMLFormElement);
                errors = {};

                const username = (data.get('username') || '').toString().trim();
                const email = (data.get('email') || '').toString().trim();
                const password = (data.get('password') || '').toString();
                const repassword = (data.get('repassword') || '').toString();

               if (!username) errors.username = 'Requerido';
               if (!email || !isValidEmail(email)) errors.email = 'Email inválido';
                if (!password) errors.password = 'Requerido';
                if (password !== repassword) errors.repassword = 'Las contraseñas no coinciden';

                if (tipo === 'persona') {
                        const nombre = (data.get('nombre') || '').toString().trim();
                        const apellido = (data.get('apellido') || '').toString().trim();
                        const docTipo = (data.get('docTipo') || '').toString();
                        const docNumero = (data.get('docNumero') || '').toString().trim();
                        const nacimiento = (data.get('nacimiento') || '').toString();
                        const cuil = (data.get('cuil') || '').toString().trim();
                        if (!nombre) errors.nombre = 'Requerido';
                        if (!apellido) errors.apellido = 'Requerido';
                        if (!docTipo || !docNumero) errors.docNumero = 'Documento obligatorio';
                       if (!nacimiento || !isAdult(nacimiento)) errors.nacimiento = 'Debe ser mayor de 18 años';
                        if (!cuil) errors.cuil = 'CUIL obligatorio';
                } else {
                        const razonSocial = (data.get('razonSocial') || '').toString().trim();
                        const cuit = (data.get('cuit') || '').toString().trim();
                        const repNombre = (data.get('repNombre') || '').toString().trim();
                        const repApellido = (data.get('repApellido') || '').toString().trim();
                        const repDocTipo = (data.get('repDocTipo') || '').toString();
                        const repDocNumero = (data.get('repDocNumero') || '').toString().trim();
                        const repNacimiento = (data.get('repNacimiento') || '').toString();
                        if (!razonSocial) errors.razonSocial = 'Requerido';
                        if (!cuit) errors.cuit = 'CUIT obligatorio';
                        if (!repNombre) errors.repNombre = 'Requerido';
                        if (!repApellido) errors.repApellido = 'Requerido';
                        if (!repDocTipo || !repDocNumero) errors.repDocNumero = 'Documento obligatorio';
                       if (!repNacimiento || !isAdult(repNacimiento)) errors.repNacimiento = 'Debe ser mayor de 18 años';
                }

                if (Object.keys(errors).length > 0) return;

                sending = true;
                setTimeout(() => {
                        sending = false;
                        console.log('Colaborador registrado');
                }, 1000);
        }
</script>

<form on:submit={handleSubmit} class="space-y-6 rounded-2xl bg-white p-8 shadow">
        <div>
                <label for="tipo" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Tipo de colaborador *</label>
                <select id="tipo" bind:value={tipo} class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]">
                        <option value="persona">Persona</option>
                        <option value="organizacion">Organización / ONG</option>
                </select>
        </div>
        {#if tipo === 'persona'}
                <div class="grid gap-4 md:grid-cols-2">
                        <div>
                                <label for="nombre" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Nombre *</label>
                                <Input id="nombre" name="nombre" required error={errors.nombre} />
                        </div>
                        <div>
                                <label for="apellido" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Apellido *</label>
                                <Input id="apellido" name="apellido" required error={errors.apellido} />
                        </div>
                        <div>
                                <label for="docTipo" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Tipo de documento *</label>
                                <select id="docTipo" name="docTipo" required class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]">
                                        <option>DNI</option>
                                        <option>Pasaporte</option>
                                        <option>Otro</option>
                                </select>
                        </div>
                        <div>
                                <label for="docNumero" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Número *</label>
                                <Input id="docNumero" name="docNumero" required error={errors.docNumero} />
                        </div>
                        <div>
                                <label for="nacimiento" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Fecha de nacimiento *</label>
                                <DatePicker id="nacimiento" name="nacimiento" required error={errors.nacimiento} />
                        </div>
                        <div>
                                <label for="cuil" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">CUIL *</label>
                                <Input id="cuil" name="cuil" required error={errors.cuil} />
                        </div>
                </div>
        {:else}
                <div class="grid gap-4 md:grid-cols-2">
                        <div class="md:col-span-2">
                                <label for="razonSocial" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Razón social *</label>
                                <Input id="razonSocial" name="razonSocial" required error={errors.razonSocial} />
                        </div>
                        <div class="md:col-span-2">
                                <label for="cuit" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">CUIT *</label>
                                <Input id="cuit" name="cuit" required error={errors.cuit} />
                        </div>
                        <div>
                                <label for="repNombre" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Nombre representante *</label>
                                <Input id="repNombre" name="repNombre" required error={errors.repNombre} />
                        </div>
                        <div>
                                <label for="repApellido" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Apellido representante *</label>
                                <Input id="repApellido" name="repApellido" required error={errors.repApellido} />
                        </div>
                        <div>
                                <label for="repDocTipo" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Tipo de documento *</label>
                                <select id="repDocTipo" name="repDocTipo" required class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]">
                                        <option>DNI</option>
                                        <option>Pasaporte</option>
                                        <option>Otro</option>
                                </select>
                        </div>
                        <div>
                                <label for="repDocNumero" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Número *</label>
                                <Input id="repDocNumero" name="repDocNumero" required error={errors.repDocNumero} />
                        </div>
                        <div class="md:col-span-2">
                                <label for="repNacimiento" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Fecha de nacimiento *</label>
                                <DatePicker id="repNacimiento" name="repNacimiento" required error={errors.repNacimiento} />
                        </div>
                </div>
        {/if}
        <div>
                <label for="username" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Nombre de usuario *</label>
                <Input id="username" name="username" required error={errors.username} />
        </div>
        <div>
                <label for="email" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Email *</label>
                <Input id="email" name="email" type="email" required error={errors.email} />
        </div>
        <div class="grid gap-4 md:grid-cols-2">
                <div>
                        <label for="password" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Contraseña *</label>
                        <Input id="password" name="password" type="password" required error={errors.password} />
                </div>
                <div>
                        <label for="repassword" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Confirmar contraseña *</label>
                        <Input id="repassword" name="repassword" type="password" required error={errors.repassword} />
                </div>
        </div>
        <Button label="Crear cuenta" disabled={sending} customClass="w-full" />
</form>
