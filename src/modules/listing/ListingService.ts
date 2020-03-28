import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { CreateListingRequest } from './models/CreateListingRequest';
import { FindListingsConditions } from './models/FindListingsConditions';
import { Listing } from './models/Listing';

@Injectable()
export class ListingService {

    constructor(@InjectModel('Listing') private readonly listingModel: Model<Listing & Document>) {}

    async create(listing: CreateListingRequest): Promise<string> {
        const newListing = await this.listingModel.create(listing);
        return newListing.id;
    }

    async get(listingId: string): Promise<Listing> {
        try {
            return await this.listingModel.findById(listingId, { __v: false });
        } catch (err) {
            console.error(err);
            return undefined;
        }
    }

    async findListings(conditions: FindListingsConditions): Promise<Listing[]> {
        return this.listingModel.find(conditions, { __v: false });
    }

    async delete(listingId: string): Promise<boolean> {
        const result = await this.listingModel.deleteOne({ _id: listingId });
        return result.ok === 1;
    }
}
