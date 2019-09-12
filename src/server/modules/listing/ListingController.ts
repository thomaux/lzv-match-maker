import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/AuthenticatedGuard';
import { CreateListingRequest, FindListingsRequest } from './Listing';
import { ListingService } from './ListingService';

@Controller('api/listing')
export class ListingsController {

    constructor(private readonly listingService: ListingService) { }

    @Get()
    @UseGuards(AuthenticatedGuard)
    findAll(@Query() query: FindListingsRequest) {
        return this.listingService.findListings(query);
    }

    @Post()
    @UseGuards(AuthenticatedGuard)
    create(@Body() createListing: CreateListingRequest) {
        this.listingService.create(createListing, '');
    }

    @Get(':id')
    @UseGuards(AuthenticatedGuard)
    get(@Param('id') id: string) {
        return this.listingService.get(id);
    }

    @Delete('id')
    @UseGuards(AuthenticatedGuard)
    delete(@Param('id') id: string) {
        return this.listingService.delete(id);
    }
}
