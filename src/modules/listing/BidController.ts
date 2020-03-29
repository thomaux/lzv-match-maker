import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/AuthenticatedGuard';
import { TeamOwnerGuard } from '../team/guards/TeamOwnerGuard';
import { BidService } from './BidService';
import { CreateBidRequest } from './models/CreateBidRequest';
import { ValidateCreateBidPipe } from './pipes/ValidateCreateBidPipe';

@UseGuards(AuthenticatedGuard)
@Controller('api/listing/:id/bid')
export class BidController {

    constructor(private readonly bidService: BidService) { }

    @Post()
    @UseGuards(TeamOwnerGuard)
    async bid(@Body(ValidateCreateBidPipe) createBid: CreateBidRequest, @Param('id') listingId: string): Promise<{ _id: string }> {
        const _id = await this.bidService.create({
            listingId,
            teamId: createBid.teamId
        });
        return {
            _id
        };
    }
}
