import { Transform } from 'class-transformer';
import { IsDate, IsInt, IsString, Min } from 'class-validator';

export class CreateListingRequest {

    @IsString()
    readonly teamId: string;

    @IsDate()
    @Transform(val => new Date(val))
    readonly date: Date;

    @IsInt()
    @Min(1)
    readonly minLevel: number;

    @IsInt()
    @Min(1)
    readonly maxLevel: number;

    @IsInt()
    readonly gymId: number;
}
