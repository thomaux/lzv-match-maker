import { GymModel } from '../models/GymModel';
import { ListingModel, Listing } from '../models/ListingModel';
import { RegionModel } from '../models/RegionModel';
import { isDate } from 'lodash';

interface CreateListingRequest {
    teamName: string;
    date: string;
    startHour: string;
    minLevel: number;
    maxLevel: number;
    gymId: number;
}

export async function createListing(input: any): Promise<number> {
    const listing = await getValidatedInput(input);

    const newListing = await ListingModel.create(listing);
    return newListing.id;
}

// TODO: initial input validation through JSON Schema
async function getValidatedInput(input: CreateListingRequest): Promise<Listing> {

    // TODO:  check if it is in the future
    const date = parseDate(input.date, input.startHour);
    if (!date) {
        throw new Error('Invalid date format, expected DD/MM/YYYY for date and HH for hour')
    }
    if(date.getTime() <= new Date().getTime()) {
        throw new Error('Date needs to be in the future');
    }

    // Higher level, means lower rank.
    if (input.minLevel < input.maxLevel) {
        // TODO: these shouldn't be errors, rather make a return type ValidationResult
        throw new Error('Minimum level cannot be greater than maximum level');
    }

    const gym = await GymModel.findById(input.gymId);
    if (!gym) {
        throw new Error('No gym for id ' + input.gymId);
    }
    const region = await RegionModel.findById(gym.regionId);
    if (!region) {
        throw new Error('No region for id ' + gym.regionId);
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
        gymId: input.gymId
    };
}

function parseDate(date: string, hour: string): Date {
    try {
        const dateParts = date.split('/');
        if(dateParts.length < 3) {
            return undefined;
        }

        const parsedDate = new Date(Date.parse(dateParts.reverse().join('-') + 'T' + hour + ':00:00.000Z'));
        return isDate(parsedDate) && !isNaN(parsedDate.getTime()) ? parsedDate : undefined;
    } catch (err) {
        console.error(err);
        return undefined;
    }
}