import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationModule } from '../location/LocationModule';
import { TeamModule } from '../team/TeamModule';
import { ListingsController } from './ListingController';
import { ListingService } from './ListingService';
import { ListingSchema } from './models/ListingSchema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Listing', schema: ListingSchema }]), LocationModule, TeamModule],
    controllers: [ListingsController],
    providers: [ListingService]
})
export class ListingModule { }
