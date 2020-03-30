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
        const result = await this.bidModel.updateOne({ _id: bidId, accepted: null }, {
            $set: { accepted: accept }
        });

        if (result.ok !== 1) {
            throw new Error('Failed to update bid with id ' + bidId);
        }

        if (!accept) {
            return;
        }

        // In case the bid was accepted, reject all other bids for this listing
        const bid = await this.get(bidId);
        await this.bidModel.updateMany({ listingId: bid.listingId, teamId: { $not: bid.teamId } }, { $set: { accepted: false } });
    }

    async get(id: string): Promise<Bid> {
        return this.bidModel.findById(id);
    }

    async findByListingAndTeamId(listingId: string, teamId: string): Promise<Bid> {
        return this.bidModel.findOne({ listingId, teamId });
    }
}