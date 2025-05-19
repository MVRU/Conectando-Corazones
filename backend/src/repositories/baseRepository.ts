// Clase base o interfaz genérica para los repositorios para extender con Prisma

import { PrismaClient } from '@prisma/client';

export abstract class BaseRepository<TModel, TCreateInput, TUpdateInput> {
    protected constructor(protected readonly prisma: PrismaClient) { }

    abstract findAll(): Promise<TModel[]>;
    abstract findById(id: string | number): Promise<TModel | null>;
    abstract create(data: TCreateInput): Promise<TModel>;
    abstract update(id: string | number, data: TUpdateInput): Promise<TModel>;
    abstract delete(id: string | number): Promise<void>;
}