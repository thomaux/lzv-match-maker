import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { User } from '../../common/decorators/UserDecorator';
import { AuthenticatedGuard } from '../auth/AuthenticatedGuard';
import { User as UserEntity } from '../user/models/User';
import { ListingService } from './ListingService';
import { CreateListingRequest } from './models/CreateListingRequest';
import { FindListingsRequest } from './models/FindListingsRequest';
import { Listing } from './models/Listing';
import { ValidateCreateListingPipe } from './pipes/ValidateCreateListingPipe';

@UseGuards(AuthenticatedGuard)
@Controller('api/listing')
export class ListingsController {

    constructor(private readonly listingService: ListingService) { }

    @Get()
    @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
    findAll(@Query() query: FindListingsRequest): Promise<Listing[]> {
        return this.listingService.findListings(query);
    }

    @Post()
    @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true, transform: true }))
    async create(
        @Body(ValidateCreateListingPipe) createListing: CreateListingRequest, @User() user: UserEntity): Promise<{ _id: number }> {
        const _id = await this.listingService.create(createListing, user.id);
        return {
            _id
        };
    }

    @Get(':id')
    get(@Param('id') id: string): Promise<Listing> {
        return this.listingService.get(id);
    }

    @Delete('id')
    delete(@Param('id') id: string): Promise<boolean> {
        return this.listingService.delete(id);
    }
}
