// Clase base o interfaz genérica para los repositorios para extender con Prisma

export abstract class BaseRepository<T> {
    abstract findAll(): Promise<T[]>;
    abstract findById(id: string): Promise<T | null>;
    abstract delete(id: string): Promise<void>;
}