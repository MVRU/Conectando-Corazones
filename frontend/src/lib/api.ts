// Cliente API para consumir el backend
// Separación correcta: Frontend solo consume, no contiene lógica de negocio

const API_BASE_URL = 'http://localhost:3000/api';

// Tipos para las respuestas de la API
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Cliente para proyectos
export const proyectosApi = {
    // Obtener todos los proyectos
    async getAll(): Promise<ApiResponse<any[]>> {
        const response = await fetch(`${API_BASE_URL}/proyectos`);
        return response.json();
    },

    // Obtener proyecto por ID
    async getById(id: number): Promise<ApiResponse<any>> {
        const response = await fetch(`${API_BASE_URL}/proyectos/${id}`);
        return response.json();
    },

    // Crear nuevo proyecto
    async create(proyecto: any): Promise<ApiResponse<any>> {
        const response = await fetch(`${API_BASE_URL}/proyectos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(proyecto),
        });
        return response.json();
    },

    // Actualizar proyecto
    async update(id: number, proyecto: any): Promise<ApiResponse<any>> {
        const response = await fetch(`${API_BASE_URL}/proyectos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(proyecto),
        });
        return response.json();
    },

    // Eliminar proyecto
    async delete(id: number): Promise<ApiResponse<any>> {
        const response = await fetch(`${API_BASE_URL}/proyectos/${id}`, {
            method: 'DELETE',
        });
        return response.json();
    },
};

// Cliente para categorías
export const categoriasApi = {
    async getAll(): Promise<ApiResponse<any[]>> {
        const response = await fetch(`${API_BASE_URL}/categorias`);
        return response.json();
    },

    async create(categoria: any): Promise<ApiResponse<any>> {
        const response = await fetch(`${API_BASE_URL}/categorias`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(categoria),
        });
        return response.json();
    },
};

// Cliente para tipos de participación
export const tiposParticipacionApi = {
    async getAll(): Promise<ApiResponse<any[]>> {
        const response = await fetch(`${API_BASE_URL}/tipos-participacion`);
        return response.json();
    },

    async create(tipo: any): Promise<ApiResponse<any>> {
        const response = await fetch(`${API_BASE_URL}/tipos-participacion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tipo),
        });
        return response.json();
    },
};
