import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gym } from '../gym/Gym';
import { Region } from './models/Region';

@Injectable()
export class RegionService {

    constructor(@InjectModel('Region') private readonly regionModel: Model<Region>,
    @InjectModel('Gym') private readonly gymModel: Model<Gym> ) {}

    async getAll() {
        try {
            return await this.regionModel.find({}, { __v: false });
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    async getAllGymsOfRegion(regionId: number) {
        try {
            return await this.gymModel.find({ regionId }, { __v: false });
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    async findByGymId(gymId: number): Promise<Region> {
        const gym = await this.gymModel.findById(gymId);
        if (!gym) {
            return undefined;
        }
        return this.regionModel.findById(gym.regionId);
    }
}
