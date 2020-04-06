export interface Repository<T> {
    create(document: Partial<T>): Promise<string>;
    get(id: string): Promise<T>;
    delete(id: string): Promise<void>;
}