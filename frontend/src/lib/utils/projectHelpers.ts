export function formatDate(date: string) {
    return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

export function formatAmount(value: number, type?: string) {
    return type === 'Monetaria' ? `$${value.toLocaleString('es-AR')}` : value.toString();
}

export function progressColor(type: string) {
    switch (type) {
        case 'Monetaria':
            return 'bg-[rgb(var(--color-primary))]';
        case 'Voluntariado':
            return 'bg-purple-500';
        case 'Materiales':
            return 'bg-green-500';
        default:
            return 'bg-gray-400';
    }
}

export function urgencyColor(level: string) {
    switch (level) {
        case 'Alta':
            return 'text-red-600 bg-red-100';
        case 'Media':
            return 'text-yellow-600 bg-yellow-100';
        case 'Baja':
            return 'text-green-600 bg-green-100';
        default:
            return 'text-gray-600 bg-gray-100';
    }
}

export function statusColor(status: string) {
    switch (status) {
        case 'Activo':
            return 'text-green-600 bg-green-100';
        case 'Próximo a cerrar':
            return 'text-orange-600 bg-orange-100';
        case 'Cerrado':
            return 'text-gray-600 bg-gray-100';
        case 'Completado':
            return 'text-blue-600 bg-blue-100';
        default:
            return 'text-gray-600 bg-gray-100';
    }
}

export function participationIcon(type: string) {
    switch (type) {
        case 'Monetaria':
            return '💰';
        case 'Voluntariado':
            return '🙋‍♀️';
        case 'Materiales':
            return '📦';
        default:
            return '🤝';
    }
}

export function actionText(type: string) {
    switch (type) {
        case 'Monetaria':
            return 'Enviar donación';
        case 'Voluntariado':
            return 'Postularme como voluntario';
        case 'Materiales':
            return 'Donar materiales';
        default:
            return 'Colaborar';
    }
}
