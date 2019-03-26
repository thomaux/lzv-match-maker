import { findRegionByGymId } from "../facades/RegionFacade";
import { parseDate } from "../helpers/DateParser";
import { Listing } from "../models/ListingModel";

export interface CreateListingRequest {
    teamName: string;
    date: string;
    startHour: string;
    minLevel: number;
    maxLevel: number;
    gymId: number;
}

export async function mapCreateListingRequestToListing(input: CreateListingRequest, authorId: string): Promise<Listing> {
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
