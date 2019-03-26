import { findAllGymsOfRegion } from "../facades/RegionFacade";

export interface FindListingsRequest {
    regionId?: number;
    level?: number;
}

export async function mapFindListingsRequestToConditions(filters: FindListingsRequest) {
    let conditions: any = {
        date: {
            $gt: new Date()
        }
    };

    if (filters.level) {
        conditions.minLevel = {
            $gte: filters.level
        };
        conditions.maxLevel = {
            $lte: filters.level
        };
    }

    if (filters.regionId) {
        const gyms = await findAllGymsOfRegion(filters.regionId);
        conditions.gymId = {
            $in: gyms.map(gym => gym.id)
        };
    }

    return conditions;
}