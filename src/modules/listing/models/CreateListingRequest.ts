import { IsDate, IsInt, IsString, Min, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateListingRequest {

    @IsString()
    @MinLength(3)
    readonly teamName: string;

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
