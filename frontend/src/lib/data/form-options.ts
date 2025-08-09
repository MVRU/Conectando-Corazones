// Opciones comunes para formularios del sistema

// FIX: mejor data y types por separado, archivos atómicos, no mezclar peras con manzanas, hay que tener todo centralizado, si cambian las provincias lo vamos a cambiar en cada archivo repetido?

// ! Estos export no se están implementando en ningún lado, se crearon y no se usaron, no conviene mantener archivos que no se usan, ¿eliminar?

// Provincias de Argentina
// FIX: código repetido, ¿para qué está la data provinces? No sé implementó en ningún lado...
export const provincias = [
  { value: 'buenos-aires', label: 'Buenos Aires' },
  { value: 'ciudad-autonoma-buenos-aires', label: 'Ciudad Autónoma de Buenos Aires' },
  { value: 'catamarca', label: 'Catamarca' },
  { value: 'chaco', label: 'Chaco' },
  { value: 'chubut', label: 'Chubut' },
  { value: 'cordoba', label: 'Córdoba' },
  { value: 'corrientes', label: 'Corrientes' },
  { value: 'entre-rios', label: 'Entre Ríos' },
  { value: 'formosa', label: 'Formosa' },
  { value: 'jujuy', label: 'Jujuy' },
  { value: 'la-pampa', label: 'La Pampa' },
  { value: 'la-rioja', label: 'La Rioja' },
  { value: 'mendoza', label: 'Mendoza' },
  { value: 'misiones', label: 'Misiones' },
  { value: 'neuquen', label: 'Neuquén' },
  { value: 'rio-negro', label: 'Río Negro' },
  { value: 'salta', label: 'Salta' },
  { value: 'san-juan', label: 'San Juan' },
  { value: 'san-luis', label: 'San Luis' },
  { value: 'santa-cruz', label: 'Santa Cruz' },
  { value: 'santa-fe', label: 'Santa Fe' },
  { value: 'santiago-del-estero', label: 'Santiago del Estero' },
  { value: 'tierra-del-fuego', label: 'Tierra del Fuego' },
  { value: 'tucuman', label: 'Tucumán' }
];

// Tipos de institución
// ? ¿ONG cuenta como Institución o Colaborador para ayudar?
// FIX: OJO ACÁ porque un usuario NO puede ser Institución y Colaborador simultáneamente
export const tiposInstitucion = [
  { value: 'escuela', label: 'Escuela' },
  { value: 'hospital', label: 'Hospital' },
  { value: 'ong', label: 'ONG' }, // FIX
  { value: 'fundacion', label: 'Fundación' },
  { value: 'otro', label: 'Otro' }
];

// FIX: se difiere entre ong y empresa... es organización en el DER
// Tipos de colaborador
export const tiposColaborador = [
  { value: 'empresa', label: 'Empresa' },
  { value: 'persona', label: 'Persona' },
  { value: 'ong', label: 'ONG' }
];

// Categorías de proyectos
export const categoriasProyectos = [
  { value: 'educacion', label: 'Educación' },
  { value: 'salud', label: 'Salud' },
  { value: 'medioambiente', label: 'Medio Ambiente' },
  { value: 'pobreza', label: 'Reducción de la Pobreza' },
  { value: 'tecnologia', label: 'Tecnología' },
  { value: 'arte-cultura', label: 'Arte y Cultura' },
  { value: 'deportes', label: 'Deportes' },
  { value: 'emergencias', label: 'Emergencias' },
  { value: 'animales', label: 'Protección Animal' },
  { value: 'otro', label: 'Otro' }
];

// Estados de proyectos
// ! Estos estados quedaron obsoletos y este export no se implementa en ningún lado
export const estadosProyectos = [
  { value: 'abierto', label: 'Abierto' },
  { value: 'en-ejecucion', label: 'En Ejecución' },
  { value: 'finalizado', label: 'Finalizado' },
  { value: 'pausado', label: 'Pausado' },
  { value: 'cancelado', label: 'Cancelado' }
];

// Niveles de urgencia
export const nivelesUrgencia = [
  { value: 'baja', label: 'Baja' },
  { value: 'media', label: 'Media' },
  { value: 'alta', label: 'Alta' },
  { value: 'critica', label: 'Crítica' }
];

// Tipos de donación
// FIX: servicios y equipamiento no están en el DER
export const tiposDonacion = [
  { value: 'dinero', label: 'Dinero' }, // FIX: monetaria
  { value: 'materiales', label: 'Materiales' }, // FIX: especie
  { value: 'voluntarios', label: 'Voluntarios' }, // FIX: voluntariado
  { value: 'servicios', label: 'Servicios' }, // FIX: inventado
  { value: 'equipamiento', label: 'Equipamiento' } // FIX: inventado
];

// Rubros empresariales
export const rubrosEmpresariales = [ // FIX: inventado
  { value: 'tecnologia', label: 'Tecnología' },
  { value: 'salud', label: 'Salud' },
  { value: 'educacion', label: 'Educación' },
  { value: 'finanzas', label: 'Finanzas' },
  { value: 'retail', label: 'Retail' },
  { value: 'manufactura', label: 'Manufactura' },
  { value: 'servicios', label: 'Servicios' },
  { value: 'construccion', label: 'Construcción' },
  { value: 'alimentacion', label: 'Alimentación' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'otro', label: 'Otro' }
];

// Géneros
// ? Esto no está en el DER, pero se puede considerar
export const generos = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'femenino', label: 'Femenino' },
  { value: 'otro', label: 'Otro' }
];

// Asuntos de contacto
// FIX: se creó, no se implementó y se volvió a crear en otro lado repitiendo código
export const asuntosContacto = [
  { value: 'consulta-general', label: 'Consulta general' },
  { value: 'soporte-tecnico', label: 'Soporte técnico' },
  { value: 'colaboracion', label: 'Propuesta de colaboración' },
  { value: 'institucion', label: 'Soy una institución' },
  { value: 'feedback', label: 'Feedback del sistema' },
  { value: 'otro', label: 'Otro' }
];

// Estados de verificación
// ! Esto no lo íbamos a almacenar, si es rechazado no se crea la cuenta
export const estadosVerificacion = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'verificado', label: 'Verificado' },
  { value: 'rechazado', label: 'Rechazado' }
];

// Tamaños de empresa (por número de empleados)
// FIX: inventado, no está en el DER
export const tamanosEmpresa = [
  { value: '1-10', label: '1-10 empleados' },
  { value: '11-50', label: '11-50 empleados' },
  { value: '51-200', label: '51-200 empleados' },
  { value: '201-1000', label: '201-1000 empleados' },
  { value: '1000+', label: 'Más de 1000 empleados' }
]; 