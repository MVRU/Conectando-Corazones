import type { User } from '$lib/types/User';

export const mockUsers = {
    admin: {
        id: '1',
        email: 'admin@conectandocorazones.org',
        nombre: 'Administrador',
        role: 'admin',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
        verificationStatus: 'verificado',
        permisos: {
            gestionarUsuarios: true,
            gestionarProyectos: true,
            gestionarInstituciones: true,
            verReportes: true,
            gestionarSistema: true
        },
        telefono: '+54 341 123-4567',
        departamento: 'Administración'
    },
    institucion: {
        id: '2',
        email: 'escuela@esperanza.edu.ar',
        nombre: 'Escuela Esperanza',
        role: 'institucion',
        isActive: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date(),
        verificationStatus: 'verificado',
        razonSocial: 'Escuela Esperanza',
        cuit: '30-12345678-9',
        telefono: '+54 341 987-6543',
        direccion: {
            calle: 'San Martín',
            numero: '123',
            ciudad: 'Rosario',
            provincia: 'Santa Fe',
            codigoPostal: '2000'
        },
        descripcion: 'Escuela rural comprometida con la educación de calidad',
        sitioWeb: 'escuelaesperanza.edu.ar',
        tipoInstitucion: 'escuela',
        capacidadBeneficiarios: 150,
        proyectosCreados: ['1', '2']
    },
    colaborador: {
        id: '3',
        email: 'juan.perez@gmail.com',
        nombre: 'Juan Pérez',
        role: 'colaborador',
        isActive: true,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date(),
        verificationStatus: 'verificado',
        tipoColaborador: 'persona',
        telefono: '+54 341 555-1234',
        direccion: {
            calle: 'Belgrano',
            numero: '456',
            ciudad: 'Rosario',
            provincia: 'Santa Fe',
            codigoPostal: '2000'
        },
        persona: {
            dni: '12345678',
            fechaNacimiento: new Date('1990-05-15'),
            genero: 'masculino'
        },
        colaboraciones: ['1', '3'],
        preferencias: {
            categorias: ['educacion', 'salud'],
            provincias: ['santa-fe', 'buenos-aires'],
            notificaciones: true
        }
    }
} satisfies Record<string, User>; // Esto garantiza que todo cumpla con User

export type MockUsers = typeof mockUsers;