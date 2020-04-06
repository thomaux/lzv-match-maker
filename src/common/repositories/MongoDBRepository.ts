import { Document, isValidObjectId, Model } from 'mongoose';
import { Repository } from './Repository';

export class MongoDBRepository<T> implements Repository<T> {

    constructor(protected readonly model: Model<T & Document>) { }
    
    async create(document: Partial<T>, ...args: unknown[]): Promise<string> {
        const result = await this.model.create(document);
        return result.id;
    }

    async get(id: string): Promise<T> {
        if (!isValidObjectId(id)) {
            return null;
        }
        return this.model.findById(id, { __v: false });
    }

    async delete(id: string): Promise<void> {
        let result: T;
        if (isValidObjectId(id)) {
            result = await this.model.findByIdAndDelete(id);
        }

        if (!result) {
            throw new Error(`Failed to delete ${this.model.modelName} with id ${id}`);
        }
    }
}