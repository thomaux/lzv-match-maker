import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/JwtGuard';
import { TeamOwnerGuard } from '../team/guards/TeamOwnerGuard';
import { ListingOwnerGuard } from './guards/ListingOwnerGuard';
import { ListingService } from './ListingService';
import { CreateListingRequest } from './models/CreateListingRequest';
import { FindListingsConditions } from './models/FindListingsConditions';
import { Listing } from './models/Listing';
import { ConditionsFromQueryPipe } from './pipes/ConditionsFromQueryPipe';
import { ValidateCreateListingPipe } from './pipes/ValidateCreateListingPipe';

@UseGuards(JwtGuard)
@Controller('api/listing')
export class ListingsController {

    constructor(private readonly listingService: ListingService) { }

    @Get()
    async findAll(@Query(ConditionsFromQueryPipe) query: FindListingsConditions): Promise<Listing[]> {
        return this.listingService.findListings(query);
    }

    @Post()
    @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true, transform: true }))
    @UseGuards(TeamOwnerGuard)
    async create(
        @Body(ValidateCreateListingPipe) createListing: CreateListingRequest): Promise<{ _id: string }> {
        const _id = await this.listingService.create(createListing);
        return {
            _id
        };
    }

    @Get(':id')
    async get(@Param('id') id: string): Promise<Listing> {
        return this.listingService.get(id);
    }

    @Delete(':id')
    @UseGuards(ListingOwnerGuard)
    async delete(@Param('id') id: string): Promise<void> {
        return this.listingService.delete(id);
    }
}
