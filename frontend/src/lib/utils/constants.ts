import type { EstadoDescripcion } from '$lib/types/Estado';
import type { TipoParticipacionDescripcion } from '$lib/types/TipoParticipacion';
import type { TipoUbicacion } from '$lib/types/Ubicacion';
import {
    CurrencyDollar,
    Home,
    Cube,
    ArchiveBox,
    Heart,
    QuestionMarkCircle,
    ComputerDesktop,
    Pencil,
    Beaker,
    PuzzlePiece,
    Scale,
    ShoppingBag,
    Users,
    Cake,
    Wrench
} from '@steeze-ui/heroicons';
import type { IconSource } from '@steeze-ui/svelte-icon';

// --- ESTADOS ---

export const ESTADO_LABELS: Record<EstadoDescripcion, string> = {
    en_curso: 'En curso',
    pendiente_solicitud_cierre: 'Pendiente de cierre',
    en_revision: 'En revisión',
    en_auditoria: 'En auditoría',
    completado: 'Completado',
    cancelado: 'Cancelado'
};

export const ESTADO_PRIORIDAD: Record<EstadoDescripcion, number> = {
    en_curso: 0,
    pendiente_solicitud_cierre: 1,
    en_revision: 2,
    en_auditoria: 3,
    completado: 4,
    cancelado: 5
};

// --- UBICACIONES ---

export const PRIORIDAD_TIPO_UBICACION: TipoUbicacion[] = ['principal', 'alternativa', 'voluntariado', 'reuniones'];

// --- CATEGORIAS ---

export const ICONOS_CATEGORIA: Record<string, string> = {
    Medioambiente: '🌱',
    Educación: '📚',
    Salud: '🏥',
    'Desarrollo económico': '💼',
    'Promoción de la paz': '🕊️',
    Seguridad: '🛡️',
    Entretenimiento: '🎭',
    Liderazgo: '👑',
    'Personas con discapacidad': '♿',
    Tecnología: '💻',
    Política: '🏛️',
    Religión: '⛪',
    'LGBTIQ+': '🏳️‍🌈',
    'Apoyo ante una crisis': '🆘',
    Empleo: '👷',
    'Inmigrantes y refugiados': '🤝',
    'Protección animal': '🐾',
    'Alimentación y nutrición': '🍽️',
    'Cultura y arte': '🎨',
    Otra: '📋'
};

// --- PARTICIPACION ---

export const TIPO_PARTICIPACION_LABELS: Record<TipoParticipacionDescripcion, string> = {
    Voluntariado: 'Voluntariado',
    Monetaria: 'Donación monetaria',
    Especie: 'Donación en especie'
};

export type ParticipacionVisualColor = 'green' | 'purple' | 'blue' | 'orange';

export const INFO_TIPOS_PARTICIPACION = {
    Voluntariado: {
        titulo: 'Voluntariado',
        descripcion: 'Necesitás personas que dediquen su tiempo',
        icon: '🤝',
        color: 'blue' as ParticipacionVisualColor
    },
    Monetaria: {
        titulo: 'Aporte Monetario',
        descripcion: 'Necesitás donaciones económicas',
        icon: '💰',
        color: 'green' as ParticipacionVisualColor
    },
    Especie: {
        titulo: 'En Especie',
        descripcion: 'Necesitás materiales o productos específicos',
        icon: '📦',
        color: 'orange' as ParticipacionVisualColor
    }
} as const;

export const UNIDADES_POR_TIPO = {
    Voluntariado: ['personas', 'horas', 'días'],
    Monetaria: ['ARS', 'USD', 'EUR'],
    Especie: ['unidades', 'kilogramos', 'mililitros', 'litros', 'centímetros', 'metros']
} as const;

export const ICONOS_UNIDAD: Record<string, IconSource> = {
    libros: Cube,
    colchones: Home,
    alimentos: Cake,
    juguetes: PuzzlePiece,
    computadoras: ComputerDesktop,
    prendas: ShoppingBag,
    medicamentos: Beaker,
    herramientas: Wrench,
    utiles: Pencil,
    personas: Users,
    kilogramos: Scale,
    unidades: Cube,
    pesos: CurrencyDollar,
    dolares: CurrencyDollar
};

export const DEFAULT_PARTICIPACION_ICON = ArchiveBox;


// --- COLORES UI ---

export const COLORES_UI = {
    blue: {
        border: 'border-blue-500',
        bg: 'bg-blue-50',
        hover: 'hover:border-blue-300',
        text: 'text-blue-800',
        iconBg: 'bg-sky-100',
        iconColor: 'text-sky-600'
    },
    green: {
        border: 'border-green-500',
        bg: 'bg-green-50',
        hover: 'hover:border-green-300',
        text: 'text-emerald-800',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600'
    },
    orange: {
        border: 'border-orange-500',
        bg: 'bg-orange-50',
        hover: 'hover:border-orange-300',
        text: 'text-orange-800',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600'
    },
    purple: {
        border: 'border-purple-500',
        bg: 'bg-purple-50',
        hover: 'hover:border-purple-300',
        text: 'text-purple-800',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600'
    },
    gray: {
        border: 'border-gray-200',
        bg: 'bg-gray-50',
        hover: '',
        text: 'text-gray-800',
        iconBg: 'bg-gray-200',
        iconColor: 'text-gray-600'
    },
    sky: {
        border: 'border-sky-200',
        bg: 'bg-sky-50',
        hover: '',
        text: 'text-sky-900',
        iconBg: 'bg-sky-100',
        iconColor: 'text-sky-600'
    }
} as const;
