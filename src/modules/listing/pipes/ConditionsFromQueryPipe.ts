import { Injectable, PipeTransform } from '@nestjs/common';
import { LocationService } from '../../location/LocationService';
import { FindListingsConditions } from '../models/FindListingsConditions';
import { FindListingsQuery } from '../models/FindListingsQuery';

@Injectable()
export class ConditionsFromQueryPipe implements PipeTransform<FindListingsQuery, Promise<FindListingsConditions>> {
    
    constructor(private readonly locationService: LocationService) {}
    
    async transform(value: FindListingsQuery): Promise<FindListingsConditions> {
        
        const conditions: FindListingsConditions = {
            date: {
                $gt: new Date()
            }
        };

        if (value.level) {
            const level = parseInt(value.level, 10);
            conditions.minLevel = {
                $gte: level
            };
            conditions.maxLevel = {
                $lte: level
            };
        }

        if (value.regionId) {
            const gyms = await this.locationService.getAllGymsOfRegion(parseInt(value.regionId, 10));
            // FIXME: what if the region's not found?
            conditions.gymId = {
                $in: gyms.map(gym => gym._id)
            };
        }

        return conditions;
    }
}