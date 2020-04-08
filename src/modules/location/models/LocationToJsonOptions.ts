import { DocumentToObjectOptions } from 'mongoose';

export const locationToJsonOptions: DocumentToObjectOptions = {
    versionKey: false,
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
    }
};
 