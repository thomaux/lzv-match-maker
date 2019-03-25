import { GymModel } from '../models/GymModel';
import { Region, RegionModel } from '../models/RegionModel';

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

export async function findRegionByGymId(gymId: number): Promise<Region> {
    const gym = await GymModel.findById(gymId);
    if (!gym) {
        return undefined;
    }
    return RegionModel.findById(gym.regionId);
}