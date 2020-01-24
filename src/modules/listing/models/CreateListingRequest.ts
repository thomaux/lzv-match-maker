import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class CreateListingRequest {

    @IsString()
    @MinLength(3)
    readonly teamName: string;

    @IsString()
    readonly date: string;

    @IsInt()
    @Min(1)
    readonly minLevel: number;

    @IsInt()
    @Min(1)
    readonly maxLevel: number;

    @IsInt()
    readonly gymId: number;
}
