import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class FindListingsRequest {

    @IsOptional()
    @IsInt()
    @Transform(val => parseInt(val, 10))
    regionId: number;

    @IsOptional()
    @IsInt()
    @Transform(val => parseInt(val, 10))
    @Min(1)
    level: number;
}
