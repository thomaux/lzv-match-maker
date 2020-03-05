import { Injectable, PipeTransform } from '@nestjs/common';
import { RegionService } from '../../region/RegionService';
import { FindListingsConditions } from '../models/FindListingsConditions';
import { FindListingsQuery } from '../models/FindListingsQuery';

@Injectable()
export class ConditionsFromQueryPipe implements PipeTransform<FindListingsQuery, Promise<FindListingsConditions>> {
    
    constructor(private readonly regionService: RegionService) {}
    
    async transform(value: FindListingsQuery): Promise<FindListingsConditions> {
        
        const conditions: FindListingsConditions = {
            date: {
                $gt: new Date()
            }
        };

        if (value.level) {
            conditions.minLevel = {
                $gte: value.level
            };
            conditions.maxLevel = {
                $lte: value.level
            };
        }

        if (value.regionId) {
            const gyms = await this.regionService.getAllGymsOfRegion(value.regionId);
            // FIXME: what if the region's not found?
            conditions.gymId = {
                $in: gyms.map(gym => gym._id)
            };
        }

        return conditions;
    }
}