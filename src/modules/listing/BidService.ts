import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { Bid } from './models/Bid';

@Injectable()
export class BidService {

    constructor(@InjectModel('Bid') private readonly bidModel: Model<Bid & Document>) {}
    
    async create(bid: Partial<Bid>): Promise<string> {
        const newBid = await this.bidModel.create(bid);
        return newBid.id;
    }
}