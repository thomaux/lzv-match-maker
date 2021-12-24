import { ToObjectOptions } from 'mongoose';

export const defaultToJsonOptions: ToObjectOptions = {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret): void => { 
        delete ret._id;
    }
}; 