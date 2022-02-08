import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/JwtGuard';
import { LocationService } from './LocationService';
import { Gym } from './models/Gym';
import { Region } from './models/Region';

@UseGuards(JwtGuard)
@Controller('api/region')
export class RegionController {

    constructor(private readonly locationService: LocationService) { }

    @Get()
    async getAllRegions(): Promise<Region[]> {
        return this.locationService.getAllRegions();
    }

    @Get(':regionId/gyms')
    async getAllGymsOfRegion(@Param('regionId') regionId: number): Promise<Gym[]> {
        return this.locationService.getAllGymsOfRegion(regionId);
    }
}
