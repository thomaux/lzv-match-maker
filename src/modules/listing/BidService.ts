import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, isValidObjectId } from 'mongoose';
import { MongoDBRepository } from '../../common/repositories/MongoDBRepository';
import { Bid } from './models/Bid';

@Injectable()
export class BidService extends MongoDBRepository<Bid> {

    constructor(@InjectModel('Bid') bidModel: Model<Bid & Document>) {
       super(bidModel);
    }

    async update(bidId: string, accept: boolean): Promise<void> {
        if(!isValidObjectId(bidId)) {
            throw new Error('Failed to update bid with id ' + bidId);
        }

        const updatedBid = await this.model.findOneAndUpdate({ _id: bidId, accepted: null }, {
            $set: { accepted: accept }
        });

        if (!updatedBid) {
            throw new Error('Failed to update bid with id ' + bidId);
        }

        if (!accept) {
            return;
        }

        // In case the bid was accepted, reject all other bids for this listing
        await this.model.updateMany({ listingId: updatedBid.listingId, teamId: { $not: { $eq: updatedBid.teamId } } }, { $set: { accepted: false } });
    }


    async findByListingAndTeamId(listingId: string, teamId: string): Promise<Bid> {
        return this.model.findOne({ listingId, teamId });
    }
}