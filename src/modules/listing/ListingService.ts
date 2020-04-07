import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { MongoDBRepository } from '../../common/repositories/MongoDBRepository';
import { FindListingsConditions } from './models/FindListingsConditions';
import { Listing } from './models/Listing';

@Injectable()
export class ListingService extends MongoDBRepository<Listing> {

    constructor(@InjectModel('Listing') model: Model<Listing & Document>) {
        super(model);
    }

    async findListings(conditions: FindListingsConditions): Promise<Listing[]> {
        return this.model.find(conditions);
    }

}
