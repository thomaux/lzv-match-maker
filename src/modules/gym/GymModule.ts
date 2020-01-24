import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GymSchema } from './GymSchema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Gym', schema: GymSchema }])],
    exports: [MongooseModule.forFeature([{ name: 'Gym', schema: GymSchema }])]
})
export class GymModule { }
