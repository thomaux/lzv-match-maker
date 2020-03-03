import { Injectable } from '@nestjs/common';
import { RegionService } from '../region/RegionService';
import { FindListingsConditions } from './models/FindListingsConditions';
import { FindListingsRequest } from './models/FindListingsRequest';

@Injectable()
export class ListingMapper {

    constructor(private readonly regionService: RegionService) { }

    async mapFindListingsRequestToConditions(filters: FindListingsRequest): Promise<FindListingsConditions> {
        const conditions: FindListingsConditions = {
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
            const gyms = await this.regionService.getAllGymsOfRegion(filters.regionId);
            conditions.gymId = {
                $in: gyms.map(gym => gym._id)
            };
        }

        return conditions;
    }
}
