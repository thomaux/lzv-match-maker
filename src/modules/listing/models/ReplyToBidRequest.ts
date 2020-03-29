import { IsBoolean } from 'class-validator';

export class ReplyToBidRequest {

    @IsBoolean()
    readonly accept: boolean;

}
