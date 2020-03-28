import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/AuthenticatedGuard';
import { TeamOwnerGuard } from '../team/guards/TeamOwnerGuard';
import { ListingOwnerGuard } from './guards/ListingOwnerGuard';
import { ListingService } from './ListingService';
import { CreateListingRequest } from './models/CreateListingRequest';
import { FindListingsConditions } from './models/FindListingsConditions';
import { Listing } from './models/Listing';
import { ConditionsFromQueryPipe } from './pipes/ConditionsFromQueryPipe';
import { ValidateCreateListingPipe } from './pipes/ValidateCreateListingPipe';

@UseGuards(AuthenticatedGuard)
@Controller('api/listing')
export class ListingsController {

    constructor(private readonly listingService: ListingService) { }

    @Get()
    findAll(@Query(ConditionsFromQueryPipe) query: FindListingsConditions): Promise<Listing[]> {
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
    get(@Param('id') id: string): Promise<Listing> {
        return this.listingService.get(id);
    }

    @Delete(':id')
    @UseGuards(ListingOwnerGuard)
    delete(@Param('id') id: string): Promise<boolean> {
        return this.listingService.delete(id);
    }
}
