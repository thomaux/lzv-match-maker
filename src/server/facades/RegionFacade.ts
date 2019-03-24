import { GymModel } from '../models/GymModel';
import { RegionModel } from '../models/RegionModel';

export async function getAllRegions() {
    try {
        return await RegionModel.find({}, { __v: false });
    } catch (err) {
        console.error(err);
        return [];
    }
}

export async function findAllGymsOfRegion(regionId: number) {
    try {
        return await GymModel.find({ regionId }, { __v: false });
    } catch (err) {
        console.error(err);
        return []
    }
}
