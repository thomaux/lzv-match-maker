import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListingsController } from './ListingController';
import { ListingSchema } from './models/ListingSchema';
import { ListingService } from './ListingService';
import { RegionModule } from '../region/RegionModule';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Listing', schema: ListingSchema }]), RegionModule],
    controllers: [ListingsController],
    providers: [ListingService]
})
export class ListingModule { }
