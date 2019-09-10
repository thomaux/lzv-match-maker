import { Controller, Get, Param } from '@nestjs/common';
import { RegionService } from './RegionService';

@Controller('region')
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
