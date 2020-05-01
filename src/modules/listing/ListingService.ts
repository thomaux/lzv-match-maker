import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { MongoDBRepository } from '../../common/repositories/MongoDBRepository';
import { LocationService } from '../location/LocationService';
import { TeamService } from '../team/TeamService';
import { CreateListingRequest } from './models/CreateListingRequest';
import { FindListingsConditions } from './models/FindListingsConditions';
import { Listing } from './models/Listing';

@Injectable()
export class ListingService extends MongoDBRepository<Listing> {

    constructor(@InjectModel('Listing') model: Model<Listing & Document>, private teamService: TeamService, private locationService: LocationService) {
        super(model);
    }

    async create(createListingRequest: CreateListingRequest): Promise<string> {

        const [gym, region, team] = await Promise.all([
            this.locationService.getGym(createListingRequest.gymId),
            this.locationService.findRegionByGymId(createListingRequest.gymId),
            this.teamService.get(createListingRequest.teamId)]);

        return super.create({
            team,
            gym,
            region,
            date: createListingRequest.date,
            minLevel: createListingRequest.minLevel,
            maxLevel: createListingRequest.maxLevel
        });
    }

    async findListings(conditions: FindListingsConditions): Promise<Listing[]> {
        return this.model.find(conditions);
    }

}
