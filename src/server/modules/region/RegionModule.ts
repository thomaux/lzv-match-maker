import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RegionController } from './RegionController';
import { RegionSchema } from './RegionSchema';
import { RegionService } from './RegionService';
import { GymModule } from '../gym/GymModule';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Region', schema: RegionSchema }]), GymModule],
    controllers: [RegionController],
    providers: [RegionService],
    exports: [RegionService]
})
export class RegionModule { }
