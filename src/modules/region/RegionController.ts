import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/AuthenticatedGuard';
import { Gym } from '../gym/Gym';
import { Region } from './models/Region';
import { RegionService } from './RegionService';

@UseGuards(AuthenticatedGuard)
@Controller('api/region')
export class RegionController {

    constructor(private readonly regionService: RegionService) { }

    @Get()
    getAllRegions(): Promise<Region[]> {
        return this.regionService.getAll();
    }

    @Get(':regionId/gyms')
    getAllGymsOfRegion(@Param('regionId') regionId: number): Promise<Gym[]> {
        return this.regionService.getAllGymsOfRegion(regionId);
    }
}
