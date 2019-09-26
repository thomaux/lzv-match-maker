import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/AuthenticatedGuard';
import { RegionService } from './RegionService';

@UseGuards(AuthenticatedGuard)
@Controller('api/region')
export class RegionController {

    constructor(private readonly regionService: RegionService) {}

    @Get()
    getAllRegions() {
        return this.regionService.getAll();
    }

    @Get(':regionId/gyms')
    getAllGymsOfRegion(@Param('regionId') regionId: number) {
        return this.regionService.getAllGymsOfRegion(regionId);
    }
}
