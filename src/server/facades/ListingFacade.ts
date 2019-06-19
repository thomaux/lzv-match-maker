import { CreateListingRequest, mapCreateListingRequestToListing } from '../mappers/CreateListingRequestToListingMapper';
import { FindListingsRequest, mapFindListingsRequestToConditions } from '../mappers/FindListingsRequestToConditionsMapper';
import { Listing, ListingModel } from '../models/ListingModel';

export async function createListing(input: CreateListingRequest, authorId: string): Promise<number> {
    const listing = await mapCreateListingRequestToListing(input, authorId);

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
    return ListingModel.find(await mapFindListingsRequestToConditions(filters), { __v: false });
}

export async function deleteListing(listingId: string): Promise<boolean> {
    const result = await ListingModel.deleteOne({ _id: listingId });
    return result.n === 1;
}
