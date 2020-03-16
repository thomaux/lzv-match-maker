import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationService } from './LocationService';
import { GymSchema } from './models/GymSchema';
import { RegionSchema } from './models/RegionSchema';
import { RegionController } from './RegionController';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Region', schema: RegionSchema }]), MongooseModule.forFeature([{ name: 'Gym', schema: GymSchema }])],
    controllers: [RegionController],
    providers: [LocationService],
    exports: [LocationService]
})
export class LocationModule { }
