import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { RegionService } from '../../region/RegionService';
import { CreateListingRequest } from '../models/CreateListingRequest';

@Injectable()
export class ValidateCreateListingPipe implements PipeTransform<CreateListingRequest, Promise<CreateListingRequest>> {

    constructor(private readonly regionService: RegionService) { }

    async transform(value: CreateListingRequest): Promise<CreateListingRequest> {

        if (value.date.getTime() <= new Date().getTime()) {
            throw new BadRequestException('Date needs to be in the future');
        }

        // Higher level, means lower rank.
        if (value.minLevel < value.maxLevel) {
            throw new BadRequestException('Minimum level cannot be greater than maximum level');
        }

        const region = await this.regionService.findByGymId(value.gymId);
        if (!region) {
            throw new BadRequestException('No region found for gym id ' + value.gymId);
        }

        // check if min level is equal to or bigger than minPossibleLevel
        if (value.minLevel > region.lowestPossibleLevel) {
            throw new BadRequestException('Level cannot be lower than region\'s lowest possible level');
        }

        return value;
    }

}