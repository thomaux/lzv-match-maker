import { ListingModel } from "../../create-listing/ListingModel";
import { ListingsQueryModel } from "../../search-listing/ListingsQueryModel";
import { Gym } from "../models/GymModel";
import { Region } from "../models/RegionModel";

export async function findListings(query: ListingsQueryModel) {
    return callAPI('listing' + query.toQueryString());
}

export function getRegions(): Promise<Region[]> {
    return callAPI('region');
}

export function createListing(createListingRequest: ListingModel): Promise<number> {
    return callAPI('listing', {
        method: 'POST',
        body: JSON.stringify(createListingRequest),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function getGymsForRegion(regionId: number): Promise<Gym[]> {
    return callAPI(`region/${regionId}/gyms`)
}

async function callAPI(path: string, options?: RequestInit): Promise<any> {
    const response = await fetch('/api/' + path, options);

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return response.json();
}
