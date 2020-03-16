import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { Gym } from './models/Gym';
import { Region } from './models/Region';

@Injectable()
export class LocationService {

    constructor(
        @InjectModel('Region') private readonly regionModel: Model<Region & Document>,
        @InjectModel('Gym') private readonly gymModel: Model<Gym & Document>) { }

    async getAllRegions(): Promise<Region[]> {
        try {
            return await this.regionModel.find({}, { __v: false });
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    async getAllGymsOfRegion(regionId: number): Promise<Gym[]> {
        try {
            return await this.gymModel.find({ regionId }, { __v: false });
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    async findRegionByGymId(gymId: number): Promise<Region> {
        const gym = await this.gymModel.findById(gymId);
        if (!gym) {
            return undefined;
        }
        return this.regionModel.findById(gym.regionId);
    }
}
