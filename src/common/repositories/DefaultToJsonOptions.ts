import { DocumentToObjectOptions } from 'mongoose';

export const defaultToJsonOptions: DocumentToObjectOptions = {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret): void => { 
        delete ret._id;
    }
}; 