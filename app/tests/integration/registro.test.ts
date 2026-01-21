import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import '@testing-library/jest-dom/vitest';
import RegistroCuentaForm from '$lib/components/feature/registro/RegistroCuentaForm.svelte';
import FotoPerfilUploader from '$lib/components/feature/registro/FotoPerfilUploader.svelte';

/**
 * Helper para simular la selección de archivos en inputs de tipo file
 */
function createFileList(files: File[]): FileList {
	const fileList = {
		length: files.length,
		item: (index: number) => files[index] || null,
		[Symbol.iterator]: function* () {
			for (const file of files) {
				yield file;
			}
		}
	};

	// Agregar cada archivo como propiedad numérica
	files.forEach((file, index) => {
		Object.defineProperty(fileList, index, {
			value: file,
			enumerable: true
		});
	});

	return fileList as FileList;
}

/**
 * Helper para asignar archivos a un input de tipo file
 */
function setInputFiles(input: HTMLInputElement, files: File[]) {
	const fileList = createFileList(files);
	Object.defineProperty(input, 'files', {
		value: fileList,
		writable: false,
		configurable: true
	});
}

/**
 * ! Tests de integración para el flujo de registro en /registrarse
 */

describe('Flujo de Registro - /registrarse', () => {
	describe('Métodos de Acceso', () => {
		beforeEach(() => {
			// Renderizar el formulario en estado inicial
			render(RegistroCuentaForm, {
				props: {
					rol: 'institucion',
					procesando: false,
					errorGeneral: null
				}
			});
		});

		it('muestra inputs de credenciales al seleccionar Email', async () => {
			// Arrange: Verificar que los inputs no estén visibles inicialmente
			expect(screen.queryByLabelText(/nombre de usuario/i)).not.toBeInTheDocument();
			expect(screen.queryByLabelText(/correo electrónico/i)).not.toBeInTheDocument();
			expect(screen.queryByLabelText(/^contraseña/i)).not.toBeInTheDocument();

			// Act: Seleccionar el método "Email" usando el data-metodo attribute
			const emailButton = document.querySelector('[data-metodo="manual"]') as HTMLButtonElement;
			expect(emailButton).toBeTruthy();
			await fireEvent.click(emailButton);

			// Assert: Los inputs de credenciales deben aparecer en el DOM
			await waitFor(() => {
				expect(screen.getByLabelText(/nombre de usuario/i)).toBeInTheDocument();
				expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
				expect(screen.getByLabelText(/^contraseña/i)).toBeInTheDocument();
				expect(screen.getByLabelText(/confirmá la contraseña/i)).toBeInTheDocument();
			});
		});

		it('deshabilita el bloque de Google al seleccionar Email', async () => {
			// Act: Seleccionar el método "Email" usando data-metodo
			const emailButton = document.querySelector('[data-metodo="manual"]') as HTMLButtonElement;
			expect(emailButton).toBeTruthy();
			await fireEvent.click(emailButton);

			// Assert: El botón de Google debe tener aria-disabled="true"
			await waitFor(() => {
				const googleButton = document.querySelector(
					'[data-metodo="federado"]'
				) as HTMLButtonElement;
				expect(googleButton).toBeTruthy();
				expect(googleButton.getAttribute('aria-disabled')).toBe('true');
			});
		});
	});

	describe('Visibilidad de Password', () => {
		beforeEach(async () => {
			// Renderizar el formulario y seleccionar método Email
			render(RegistroCuentaForm, {
				props: {
					rol: 'institucion',
					procesando: false,
					errorGeneral: null
				}
			});

			const emailButton = document.querySelector('[data-metodo="manual"]') as HTMLButtonElement;
			await fireEvent.click(emailButton);

			// Esperar a que los inputs de password estén disponibles
			await waitFor(() => {
				expect(screen.getByLabelText(/^contraseña/i)).toBeInTheDocument();
			});
		});

		it('cambia el tipo de input al clickear el icono del ojo', async () => {
			// Arrange: Obtener el input de contraseña
			const passwordInput = screen.getByLabelText(/^contraseña/i) as HTMLInputElement;

			// Verificar que inicialmente es type="password"
			expect(passwordInput.type).toBe('password');

			// Act: Clickear el botón de mostrar/ocultar contraseña
			const toggleButton = screen.getByRole('button', { name: /mostrar contraseña/i });
			await fireEvent.click(toggleButton);

			// Assert: El tipo debe cambiar a "text"
			await waitFor(() => {
				expect(passwordInput.type).toBe('text');
			});

			// Act: Clickear nuevamente para ocultar
			const hideButton = screen.getByRole('button', { name: /ocultar contraseña/i });
			await fireEvent.click(hideButton);

			// Assert: El tipo debe volver a "password"
			await waitFor(() => {
				expect(passwordInput.type).toBe('password');
			});
		});

		it('cambia el tipo de input de confirmación al clickear su ojo', async () => {
			// Arrange: Obtener el input de confirmación de contraseña
			const passwordConfirmInput = screen.getByLabelText(
				/confirmá la contraseña/i
			) as HTMLInputElement;

			// Verificar que inicialmente es type="password"
			expect(passwordConfirmInput.type).toBe('password');

			// Act: Clickear el botón de mostrar/ocultar confirmación
			const toggleButton = screen.getByRole('button', {
				name: /mostrar confirmación de contraseña/i
			});
			await fireEvent.click(toggleButton);

			// Assert: El tipo debe cambiar a "text"
			await waitFor(() => {
				expect(passwordConfirmInput.type).toBe('text');
			});

			// Act: Clickear nuevamente para ocultar
			const hideButton = screen.getByRole('button', {
				name: /ocultar confirmación de contraseña/i
			});
			await fireEvent.click(hideButton);

			// Assert: El tipo debe volver a "password"
			await waitFor(() => {
				expect(passwordConfirmInput.type).toBe('password');
			});
		});
	});

	describe('Selección Dinámica "Otro"', () => {
		it('muestra input adicional al seleccionar "Otro"', async () => {
			// Arrange: Renderizar el formulario y llegar al paso de detalles
			const { container } = render(RegistroCuentaForm, {
				props: {
					rol: 'institucion',
					procesando: false,
					errorGeneral: null
				}
			});

			// Seleccionar método Email
			const emailButton = document.querySelector('[data-metodo="manual"]') as HTMLButtonElement;
			await fireEvent.click(emailButton);

			// Llenar credenciales
			await waitFor(() => {
				expect(screen.getByLabelText(/nombre de usuario/i)).toBeInTheDocument();
			});

			const usernameInput = screen.getByLabelText(/nombre de usuario/i);
			const emailInput = screen.getByLabelText(/correo electrónico/i);
			const passwordInput = screen.getByLabelText(/^contraseña/i);
			const passwordConfirmInput = screen.getByLabelText(/confirmá la contraseña/i);

			await fireEvent.input(usernameInput, { target: { value: 'testuser_nuevo' } });
			await fireEvent.input(emailInput, { target: { value: 'nuevo@test.com' } });
			await fireEvent.input(passwordInput, { target: { value: 'Password123!' } });
			await fireEvent.input(passwordConfirmInput, { target: { value: 'Password123!' } });

			// Submit form
			const form = container.querySelector('form');
			expect(form).toBeTruthy();
			await fireEvent.submit(form!);

			// Esperar a que aparezca la sección de tipo de institución
			await waitFor(
				() => {
					expect(screen.queryByText(/tipo de institución/i)).toBeInTheDocument();
				},
				{ timeout: 5000 }
			);

			// Verificar que el input personalizado no esté visible inicialmente
			expect(screen.queryByLabelText(/especificá el tipo de institución/i)).not.toBeInTheDocument();

			// Act: Seleccionar la opción "Otro"
			const otroRadio = screen.getByRole('radio', { name: /otro/i });
			await fireEvent.click(otroRadio);

			// Assert: El input personalizado debe aparecer
			await waitFor(() => {
				const customInput = screen.getByLabelText(/especificá el tipo de institución/i);
				expect(customInput).toBeInTheDocument();
				expect(customInput).toHaveAttribute('type', 'text');
			});
		});
	});

	describe('Gestión de Archivos y Enlaces', () => {
		describe('Previsualización de Enlace', () => {
			it('muestra una etiqueta img con el src correcto al pegar una URL', async () => {
				// Arrange: Renderizar el componente FotoPerfilUploader
				const enlaceValue = '';
				const { container } = render(FotoPerfilUploader, {
					props: {
						id: 'foto-test',
						nombre: 'foto',
						etiqueta: 'Foto de perfil',
						enlace: enlaceValue,
						archivo: null
					}
				});

				// Act: Pegar una URL en el campo de enlace
				const urlInput = container.querySelector('input[type="url"]') as HTMLInputElement;
				expect(urlInput).toBeTruthy();

				const testUrl = 'https://example.com/image.jpg';
				await fireEvent.input(urlInput, { target: { value: testUrl } });

				// Assert: Debe aparecer una etiqueta <img> con ese src
				await waitFor(() => {
					const previewImg = container.querySelector(
						'img[alt*="Vista previa"]'
					) as HTMLImageElement;
					expect(previewImg).toBeInTheDocument();
					expect(previewImg.src).toContain('example.com/image.jpg');
				});
			});

			it('muestra vista previa para URLs sin protocolo agregando https://', async () => {
				// Arrange
				const { container } = render(FotoPerfilUploader, {
					props: {
						id: 'foto-test',
						nombre: 'foto',
						enlace: '',
						archivo: null
					}
				});

				// Act: Ingresar URL sin protocolo
				const urlInput = container.querySelector('input[type="url"]') as HTMLInputElement;
				await fireEvent.input(urlInput, { target: { value: 'example.com/image.png' } });

				// Assert: La imagen debe tener https:// agregado
				await waitFor(() => {
					const previewImg = container.querySelector(
						'img[alt*="Vista previa"]'
					) as HTMLImageElement;
					expect(previewImg).toBeInTheDocument();
					expect(previewImg.src).toMatch(/^https:\/\//);
				});
			});
		});

		describe('Límite de Tamaño de Archivo', () => {
			it('muestra error para archivos que no son imágenes', async () => {
				// Arrange
				const { container } = render(FotoPerfilUploader, {
					props: {
						id: 'foto-test',
						nombre: 'foto',
						enlace: '',
						archivo: null
					}
				});

				// Cambiar a modo archivo
				const archivoButton = screen.getByRole('button', { name: /subir archivo/i });
				await fireEvent.click(archivoButton);

				// Act: Crear un archivo que no es imagen
				const pdfFile = new File(
					[new ArrayBuffer(500 * 1024)], // 500KB
					'document.pdf',
					{ type: 'application/pdf' }
				);

				const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

				// Simular la selección del archivo
				setInputFiles(fileInput, [pdfFile]);
				await fireEvent.change(fileInput);

				// Assert: Debe mostrar error de tipo de archivo
				await waitFor(() => {
					const errorMessage = screen.getByText(/el archivo debe ser una imagen compatible/i);
					expect(errorMessage).toBeInTheDocument();
				});
			});
		});
	});
});
