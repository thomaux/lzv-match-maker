import { BadRequestException, Inject, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BidService } from '../BidService';
import { ReplyToBidRequest } from '../models/ReplyToBidRequest';

@Injectable()
export class ValidateReplyToBidPipe implements PipeTransform<ReplyToBidRequest, Promise<ReplyToBidRequest>> {

    constructor(private readonly bidService: BidService, @Inject(REQUEST) private readonly request: Request) { }

    async transform(value: ReplyToBidRequest): Promise<ReplyToBidRequest> {

        const bid = await this.bidService.get(this.request.params.bidId);

        if (!bid) {
            throw new NotFoundException();
        }

        if (bid.accepted !== null) {
            throw new BadRequestException('Bid is not open');
        }

        return value;
    }
}
