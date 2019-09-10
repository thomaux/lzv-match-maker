import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ListingService } from './ListingService';
import { FindListingsRequest, CreateListingRequest } from './Listing';

@Controller('listing')
export class ListingsController {

    constructor(private readonly listingService: ListingService) { }

    @Get()
    findAll(@Query() query: FindListingsRequest) {
        return this.listingService.findListings(query);
    }

    @Post()
    create(@Body() createListing: CreateListingRequest) {
        this.listingService.create(createListing, '');
    }

    @Get(':id')
    get(@Param('id') id: string) {
        return this.listingService.get(id);
    }

    @Delete('id')
    delete(@Param('id') id: string) {
        return this.listingService.delete(id);
    }
}
