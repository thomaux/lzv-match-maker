import { IsString } from 'class-validator';

export class CreateBidRequest {

    @IsString()
    readonly teamId: string;

}
