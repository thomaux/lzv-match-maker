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

    async getGym(gymId: number): Promise<Gym> {
        return this.gymModel.findById(gymId);
    }

    async getAllRegions(): Promise<Region[]> {
        return this.regionModel.find({});
    }

    async getAllGymsOfRegion(regionId: number): Promise<Gym[]> {
        return this.gymModel.find({ regionId });
    }

    async findRegionByGymId(gymId: number): Promise<Region> {
        const gym = await this.gymModel.findById(gymId);
        if (!gym) {
            return undefined;
        }
        return this.regionModel.findById(gym.regionId);
    }
}
