export const defaultToJsonOptions = {
    virtuals: true,
    versionKey: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transform: (doc: any, ret: any): void => { 
        delete ret._id;
    }
}; 