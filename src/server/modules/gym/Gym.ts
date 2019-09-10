import { Document } from "mongoose";

export interface Gym extends Document {
    _id: number;
    name: string;
    regionId: number;
}
