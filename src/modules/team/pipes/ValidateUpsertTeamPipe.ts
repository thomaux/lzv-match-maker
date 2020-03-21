import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { LocationService } from '../../location/LocationService';
import { UpsertTeamRequest } from '../models/UpsertTeamRequest';

@Injectable()
export class ValidateUpsertTeamPipe implements PipeTransform<UpsertTeamRequest, Promise<UpsertTeamRequest>> {

    constructor(private readonly locationService: LocationService) { }

    async transform(value: UpsertTeamRequest): Promise<UpsertTeamRequest> {

        const region = await this.locationService.findRegionByGymId(value.gymId);
        if (!region) {
            throw new BadRequestException('No region found for gym id ' + value.gymId);
        }

        return value;
    }

}