import { Body, Controller, Delete, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/AuthenticatedGuard';
import { TeamOwnerGuard } from '../team/guards/TeamOwnerGuard';
import { BidService } from './BidService';
import { BidOwnerGuard } from './guards/BidOwnerGuard';
import { ListingOwnerGuard } from './guards/ListingOwnerGuard';
import { CreateBidRequest } from './models/CreateBidRequest';
import { ReplyToBidRequest } from './models/ReplyToBidRequest';
import { ValidateCreateBidPipe } from './pipes/ValidateCreateBidPipe';
import { ValidateReplyToBidPipe } from './pipes/ValidateReplyToBidPipe';

@UseGuards(AuthenticatedGuard)
@UsePipes(new ValidationPipe({ forbidNonWhitelisted: true, transform: true }))
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

    @Put(':bidId')
    @UseGuards(ListingOwnerGuard)
    async replyToBid(@Body(ValidateReplyToBidPipe) replyToBid: ReplyToBidRequest, @Param('bidId') bidId: string): Promise<void> {
        return this.bidService.update(bidId, replyToBid.accept);
    }

    @Delete(':bidId')
    @UseGuards(BidOwnerGuard)
    revokeBid(@Param('bidId') bidId: string): Promise<void> {
        return this.bidService.delete(bidId);
    }
}
