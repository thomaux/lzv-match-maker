import { ToObjectOptions } from 'mongoose';

export const locationToJsonOptions: ToObjectOptions = {
    versionKey: false,
    transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
    }
};
 