// TODO: unir con mocks/mock-users.ts

import type { InstitucionUser } from '$lib/types/User';

export const institucionesMock: InstitucionUser[] = [
    {
        id: '1',
        email: 'contacto@escuelaesperanza.edu.ar',
        nombre: 'Marta Fernández',
        role: 'institucion',
        isActive: true,
        createdAt: new Date('2024-12-01'),
        updatedAt: new Date(),
        verificationStatus: 'verificado',
        razonSocial: 'Escuela Esperanza',
        cuit: '30-12345678-1',
        telefono: '+54 341 123-4567',
        direccion: {
            calle: 'Belgrano',
            numero: '1234',
            ciudad: 'Rosario',
            provincia: 'Santa Fe',
            codigoPostal: '2000'
        },
        descripcion: 'Escuela rural comprometida con la educación inclusiva.',
        sitioWeb: 'https://escuelaesperanza.edu.ar',
        logo: '/img/logos/escuelaesperanza.png',
        tipoInstitucion: 'escuela',
        capacidadBeneficiarios: 150,
        proyectosCreados: ['1']
    },
    {
        id: '2',
        email: 'comedorlospinos@gmail.com',
        nombre: 'Comedor Los Pinos',
        role: 'institucion',
        isActive: true,
        createdAt: new Date('2024-11-20'),
        updatedAt: new Date(),
        verificationStatus: 'verificado',
        razonSocial: 'Comedor Comunitario Los Pinos',
        telefono: '+54 221 555-7890',
        direccion: {
            calle: 'San Martín',
            numero: '555',
            ciudad: 'La Plata',
            provincia: 'Buenos Aires',
            codigoPostal: '1900'
        },
        descripcion: 'Comedor que brinda alimento y contención a familias en situación de vulnerabilidad.',
        tipoInstitucion: 'ong',
        capacidadBeneficiarios: 75,
        proyectosCreados: ['2']
    },
    {
        id: '3',
        email: 'fundacionsiempre@gmail.com',
        nombre: 'Fundación Siempre',
        role: 'institucion',
        isActive: true,
        createdAt: new Date('2024-10-05'),
        updatedAt: new Date(),
        verificationStatus: 'verificado',
        razonSocial: 'Fundación Siempre',
        telefono: '+54 351 400-9876',
        direccion: {
            calle: 'Bv. Illia',
            numero: '890',
            ciudad: 'Córdoba Capital',
            provincia: 'Córdoba',
            codigoPostal: '5000'
        },
        descripcion: 'Brinda cuidado y recreación a niños con discapacidad.',
        tipoInstitucion: 'fundacion',
        capacidadBeneficiarios: 80,
        proyectosCreados: ['3']
    },
    {
        id: '4',
        email: 'contacto@hospitalsanjose.gov.ar',
        nombre: 'Hospital General San José',
        role: 'institucion',
        isActive: true,
        createdAt: new Date('2024-09-10'),
        updatedAt: new Date(),
        verificationStatus: 'verificado',
        razonSocial: 'Hospital General San José',
        telefono: '+54 261 422-3344',
        direccion: {
            calle: 'Av. San Martín',
            numero: '1010',
            ciudad: 'Mendoza Capital',
            provincia: 'Mendoza',
            codigoPostal: '5500'
        },
        descripcion: 'Hospital público que atiende a toda la comunidad mendocina.',
        tipoInstitucion: 'hospital',
        capacidadBeneficiarios: 500,
        proyectosCreados: ['4']
    },
    {
        id: '5',
        email: 'info@ifl.edu.ar',
        nombre: 'Instituto de Formación Laboral',
        role: 'institucion',
        isActive: true,
        createdAt: new Date('2025-01-10'),
        updatedAt: new Date(),
        verificationStatus: 'verificado',
        razonSocial: 'Instituto de Formación Laboral',
        telefono: '+54 381 456-7890',
        direccion: {
            calle: 'Av. Mitre',
            numero: '2300',
            ciudad: 'San Miguel de Tucumán',
            provincia: 'Tucumán',
            codigoPostal: '4000'
        },
        descripcion: 'Centro educativo dedicado al fortalecimiento de competencias laborales.',
        tipoInstitucion: 'escuela',
        capacidadBeneficiarios: 60,
        proyectosCreados: ['5']
    },
    {
        id: '6',
        email: 'contacto@comedoresunidos.org.ar',
        nombre: 'Red de Comedores Unidos',
        role: 'institucion',
        isActive: true,
        createdAt: new Date('2025-02-01'),
        updatedAt: new Date(),
        verificationStatus: 'verificado',
        razonSocial: 'Red de Comedores Unidos',
        telefono: '+54 11 4321-5678',
        direccion: {
            calle: 'Av. Calchaquí',
            numero: '777',
            ciudad: 'Quilmes',
            provincia: 'Buenos Aires',
            codigoPostal: '1878'
        },
        descripcion: 'Organización que coordina comedores comunitarios del conurbano bonaerense.',
        tipoInstitucion: 'ong',
        capacidadBeneficiarios: 200,
        proyectosCreados: ['6']
    },
    {
        id: '7',
        email: 'info@calorhumano.org',
        nombre: 'Fundación Calor Humano',
        role: 'institucion',
        isActive: true,
        createdAt: new Date('2025-01-05'),
        updatedAt: new Date(),
        verificationStatus: 'verificado',
        razonSocial: 'Fundación Calor Humano',
        telefono: '+54 11 3890-1234',
        direccion: {
            calle: 'Av. Rivadavia',
            numero: '3050',
            ciudad: 'CABA',
            provincia: 'Buenos Aires',
            codigoPostal: '1200'
        },
        descripcion: 'Fundación enfocada en brindar abrigo y asistencia a personas sin techo.',
        tipoInstitucion: 'fundacion',
        capacidadBeneficiarios: 100,
        proyectosCreados: ['7']
    },
    {
        id: '8',
        email: 'hogarsantateresa@gmail.com',
        nombre: 'Hogar Santa Teresa',
        role: 'institucion',
        isActive: true,
        createdAt: new Date('2025-02-15'),
        updatedAt: new Date(),
        verificationStatus: 'verificado',
        razonSocial: 'Hogar Santa Teresa',
        telefono: '+54 342 498-7654',
        direccion: {
            calle: 'Laprida',
            numero: '550',
            ciudad: 'Santa Fe Capital',
            provincia: 'Santa Fe',
            codigoPostal: '3000'
        },
        descripcion: 'Hogar geriátrico que brinda cuidados a adultos mayores en situación de vulnerabilidad.',
        tipoInstitucion: 'fundacion',
        capacidadBeneficiarios: 45,
        proyectosCreados: ['8']
    },
    {
        id: '9',
        email: 'escuelarural123@educ.ar',
        nombre: 'Escuela Rural N° 123',
        role: 'institucion',
        isActive: true,
        createdAt: new Date('2025-01-20'),
        updatedAt: new Date(),
        verificationStatus: 'verificado',
        razonSocial: 'Escuela Rural N° 123',
        telefono: '+54 3868 432-1111',
        direccion: {
            calle: 'Ruta 40',
            numero: 'km 52',
            ciudad: 'Cafayate',
            provincia: 'Salta',
            codigoPostal: '4427'
        },
        descripcion: 'Escuela de zona rural que busca integrar tecnologías en la educación.',
        tipoInstitucion: 'escuela',
        capacidadBeneficiarios: 85,
        proyectosCreados: ['9']
    },
    {
        id: '10',
        email: 'educacionparatodos@gmail.com',
        nombre: 'Fundación Educación para Todos',
        role: 'institucion',
        isActive: true,
        createdAt: new Date('2025-01-10'),
        updatedAt: new Date(),
        verificationStatus: 'verificado',
        razonSocial: 'Fundación Educación para Todos',
        telefono: '+54 299 412-8899',
        direccion: {
            calle: 'Perito Moreno',
            numero: '100',
            ciudad: 'Neuquén Capital',
            provincia: 'Neuquén',
            codigoPostal: '8300'
        },
        descripcion: 'Promueve el acceso igualitario a la educación superior mediante becas.',
        tipoInstitucion: 'fundacion',
        capacidadBeneficiarios: 24,
        proyectosCreados: ['10']
    }
];
