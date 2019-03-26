import { isDate } from 'lodash';
import { Listing, ListingModel } from '../models/ListingModel';
import { findAllGymsOfRegion, findRegionByGymId } from './RegionFacade';

interface CreateListingRequest {
    teamName: string;
    date: string;
    startHour: string;
    minLevel: number;
    maxLevel: number;
    gymId: number;
}

interface FindListingsRequest {
    regionId?: number;
    level?: number;
}

export async function createListing(input: CreateListingRequest, authorId: string): Promise<number> {
    const listing = await mapListingRequestToListing(input, authorId);

    const newListing = await ListingModel.create(listing);
    return newListing.id;
}

export async function getListing(listingId: any): Promise<Listing> {
    try {
        return await ListingModel.findById(listingId, { __v: false });
    } catch (err) {
        console.error(err);
        return undefined;
    }
}

export async function findListings(filters: FindListingsRequest): Promise<Listing[]> {
    return ListingModel.find(await getSearchConditionsForFilters(filters), { __v: false });
}

async function getSearchConditionsForFilters(filters: FindListingsRequest) {
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

async function mapListingRequestToListing(input: CreateListingRequest, authorId: string): Promise<Listing>{

    const date = parseDate(input.date, input.startHour);
    if (!date) {
        throw new Error('Invalid date format, expected DD/MM/YYYY for date and HH for hour')
    }
    if (date.getTime() <= new Date().getTime()) {
        throw new Error('Date needs to be in the future');
    }

    // Higher level, means lower rank.
    if (input.minLevel < input.maxLevel) {
        // TODO: these shouldn't be errors, rather make a return type ValidationResult
        throw new Error('Minimum level cannot be greater than maximum level');
    }

    const region = await findRegionByGymId(input.gymId);
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

function parseDate(date: string, hour: string): Date {
    try {
        const dateParts = date.split('/');
        if (dateParts.length < 3) {
            return undefined;
        }

        const parsedDate = new Date(Date.parse(dateParts.reverse().join('-') + 'T' + hour + ':00:00.000Z'));
        return isDate(parsedDate) && !isNaN(parsedDate.getTime()) ? parsedDate : undefined;
    } catch (err) {
        console.error(err);
        return undefined;
    }
}