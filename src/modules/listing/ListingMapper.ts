import { Injectable } from '@nestjs/common';
import { RegionService } from '../region/RegionService';
import { CreateListingRequest } from './models/CreateListingRequest';
import { FindListingsRequest } from './models/FindListingsRequest';
import { Listing } from './models/Listing';
import { FindListingsConditions } from './models/FindListingsConditions';

@Injectable()
export class ListingMapper {

    constructor(private readonly regionService: RegionService) { }

    async mapCreateListingRequestToListing(input: CreateListingRequest, authorId: string): Promise<Listing> {
        const date = new Date(input.date);

        if (date.getTime() <= new Date().getTime()) {
            throw new Error('Date needs to be in the future');
        }

        // Higher level, means lower rank.
        if (input.minLevel < input.maxLevel) {
            // TODO: these shouldn't be errors, rather make a return type ValidationResult
            throw new Error('Minimum level cannot be greater than maximum level');
        }

        const region = await this.regionService.findByGymId(input.gymId);
        if (!region) {
            throw new Error('No region found for gym id ' + input.gymId);
        }

        // check if min level is equal to or bigger than minPossibleLevel
        if (input.minLevel > region.lowestPossibleLevel) {
            throw new Error('Level cannot be lower than region\'s lowest possible level');
        }

        return {
            teamName: input.teamName,
            date,
            minLevel: input.minLevel,
            maxLevel: input.maxLevel,
            gymId: input.gymId,
            authorId
        };
    }

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
                $in: gyms.map(gym => gym.id)
            };
        }

        return conditions;
    }
}
