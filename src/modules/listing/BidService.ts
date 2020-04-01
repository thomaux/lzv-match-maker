import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { Bid } from './models/Bid';

@Injectable()
export class BidService {

    constructor(@InjectModel('Bid') private readonly bidModel: Model<Bid & Document>) { }

    async create(bid: Partial<Bid>): Promise<string> {
        const newBid = await this.bidModel.create(bid);
        return newBid.id;
    }

    async update(bidId: string, accept: boolean): Promise<void> {
        const updatedBid = await this.bidModel.findOneAndUpdate({ _id: bidId, accepted: null }, {
            $set: { accepted: accept }
        });

        if (!updatedBid) {
            throw new Error('Failed to update bid with id ' + bidId);
        }

        if (!accept) {
            return;
        }

        // In case the bid was accepted, reject all other bids for this listing
        await this.bidModel.updateMany({ listingId: updatedBid.listingId, teamId: { $not: updatedBid.teamId } }, { $set: { accepted: false } });
    }

    async get(id: string): Promise<Bid> {
        return this.bidModel.findById(id);
    }

    async findByListingAndTeamId(listingId: string, teamId: string): Promise<Bid> {
        return this.bidModel.findOne({ listingId, teamId });
    }

    async delete(id: string): Promise<void> {
        const result = await this.bidModel.findByIdAndDelete(id);

        if(!result) {
            throw new Error('Failed to delete bid with id ' + id);
        }
    }
}