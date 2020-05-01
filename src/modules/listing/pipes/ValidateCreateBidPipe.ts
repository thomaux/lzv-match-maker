import { BadRequestException, Inject, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BidService } from '../BidService';
import { ListingService } from '../ListingService';
import { CreateBidRequest } from '../models/CreateBidRequest';

@Injectable()
export class ValidateCreateBidPipe implements PipeTransform<CreateBidRequest, Promise<CreateBidRequest>> {

    constructor(
        private readonly listingService: ListingService,
        private readonly bidService: BidService,
        @Inject(REQUEST) private readonly request: Request) { }

    async transform(value: CreateBidRequest): Promise<CreateBidRequest> {

        const listing = await this.listingService.get(this.request.params.id);

        if(!listing) {
            throw new NotFoundException();
        }

        if(listing.team.id === value.teamId) {
            throw new BadRequestException('Cannot bid on own listing');
        }

        const existingBid = await this.bidService.findByListingAndTeamId(listing.id, value.teamId);

        if(existingBid) {
            throw new BadRequestException('Cannot bid twice on the same listing');
        }

        return value;
    }
}
