import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/guards/AuthenticatedGuard';
import { LocationService } from './LocationService';
import { Gym } from './models/Gym';
import { Region } from './models/Region';

@UseGuards(AuthenticatedGuard)
@Controller('api/region')
export class RegionController {

    constructor(private readonly locationService: LocationService) { }

    @Get()
    getAllRegions(): Promise<Region[]> {
        return this.locationService.getAllRegions();
    }

    @Get(':regionId/gyms')
    getAllGymsOfRegion(@Param('regionId') regionId: number): Promise<Gym[]> {
        return this.locationService.getAllGymsOfRegion(regionId);
    }
}
