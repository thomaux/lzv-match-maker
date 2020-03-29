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
    }

    async get(id: string): Promise<Bid> {
        return this.bidModel.findById(id);
    }
}