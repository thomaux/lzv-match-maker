import { Injectable, PipeTransform } from '@nestjs/common';
import { FindListingsConditions } from '../models/FindListingsConditions';
import { FindListingsQuery } from '../models/FindListingsQuery';

@Injectable()
export class ConditionsFromQueryPipe implements PipeTransform<FindListingsQuery, Promise<FindListingsConditions>> {

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
            conditions['region._id'] = parseInt(value.regionId, 10);
        }

        return conditions;
    }
}