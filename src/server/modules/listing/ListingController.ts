import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedGuard } from '../auth/AuthenticatedGuard';
import { CreateListingRequest } from './CreateListingRequest';
import { FindListingsRequest } from './FindListingsRequest';
import { ListingService } from './ListingService';

@Controller('api/listing')
export class ListingsController {

    constructor(private readonly listingService: ListingService) { }

    @Get()
    @UseGuards(AuthenticatedGuard)
    @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
    findAll(@Query() query: FindListingsRequest) {
        return this.listingService.findListings(query);
    }

    @Post()
    @UseGuards(AuthenticatedGuard)
    @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
    create(@Body() createListing: CreateListingRequest, @Req() req: Request) {
        this.listingService.create(createListing, req.user.id);
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
