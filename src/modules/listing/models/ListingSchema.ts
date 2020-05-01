import { Schema } from 'mongoose';
import { defaultToJsonOptions } from '../../../common/repositories/DefaultToJsonOptions';
import { GymSchema } from '../../location/models/GymSchema';
import { RegionSchema } from '../../location/models/RegionSchema';
import { TeamSchema } from '../../team/models/TeamSchema';

export const ListingSchema = new Schema({
    team: TeamSchema,
    date: Date,
    minLevel: Number,
    maxLevel: Number,
    gym: GymSchema,
    region: RegionSchema 
});

ListingSchema.set('toJSON', defaultToJsonOptions);