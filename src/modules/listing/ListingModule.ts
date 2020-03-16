import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationModule } from '../location/LocationModule';
import { ListingsController } from './ListingController';
import { ListingService } from './ListingService';
import { ListingSchema } from './models/ListingSchema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Listing', schema: ListingSchema }]), LocationModule],
    controllers: [ListingsController],
    providers: [ListingService]
})
export class ListingModule { }
