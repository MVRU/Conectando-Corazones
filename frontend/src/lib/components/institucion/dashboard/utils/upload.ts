export const formatReadableDate = (value: string | Date): string => {
        const date = typeof value === 'string' ? new Date(value) : value;
        if (Number.isNaN(date.getTime())) {
                return 'Fecha desconocida';
        }

        const formatter = new Intl.DateTimeFormat('es-AR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
        });

        return formatter.format(date);
};

export const extractExtension = (fileName: string): string | null => {
        const normalized = fileName.trim();
        if (!normalized) {
                return null;
        }

        const match = /\.([0-9a-zA-Z]+)$/.exec(normalized);
        return match ? match[1].toLowerCase() : null;
};

export const formatFileSizeMB = (bytes: number): string => {
        if (!Number.isFinite(bytes) || bytes < 0) {
                return '0.00 MB';
        }

        const megabytes = bytes / 1024 / 1024;
        return `${megabytes.toFixed(2)} MB`;
};