import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { CreateListingRequest } from './models/CreateListingRequest';
import { FindListingsRequest } from './models/FindListingsRequest';
import { Listing } from './models/Listing';
import { ListingMapper } from './ListingMapper';

@Injectable()
export class ListingService {

    constructor(@InjectModel('Listing') private readonly listingModel: Model<Listing & Document>,
    private readonly listingMapper: ListingMapper) {}

    async create(input: CreateListingRequest, authorId: string): Promise<number> {
        const listing = await this.listingMapper.mapCreateListingRequestToListing(input, authorId);

        const newListing = await this.listingModel.create(listing);
        return newListing.id;
    }

    async get(listingId: any): Promise<Listing> {
        try {
            return await this.listingModel.findById(listingId, { __v: false });
        } catch (err) {
            console.error(err);
            return undefined;
        }
    }

    async findListings(filters: FindListingsRequest): Promise<Listing[]> {
        return this.listingModel.find(await this.listingMapper.mapFindListingsRequestToConditions(filters), { __v: false });
    }

    async delete(listingId: string): Promise<boolean> {
        const result = await this.listingModel.deleteOne({ _id: listingId });
        return result.n === 1;
    }
}
