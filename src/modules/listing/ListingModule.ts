import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationModule } from '../location/LocationModule';
import { TeamModule } from '../team/TeamModule';
import { BidController } from './BidController';
import { BidService } from './BidService';
import { ListingsController } from './ListingController';
import { ListingService } from './ListingService';
import { BidSchema } from './models/BidSchema';
import { ListingSchema } from './models/ListingSchema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Listing', schema: ListingSchema }]),
        MongooseModule.forFeature([{ name: 'Bid', schema: BidSchema }]),
        LocationModule, TeamModule],
    controllers: [ListingsController, BidController],
    providers: [ListingService, BidService]
})
export class ListingModule { }
