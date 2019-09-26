import { Document } from 'mongoose';

export interface Region extends Document {
    _id: number;
    name: string;
    lowestPossibleLevel: number;
}
