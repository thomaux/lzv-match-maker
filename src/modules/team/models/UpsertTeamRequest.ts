import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class UpsertTeamRequest {

    @IsString()
    @MinLength(3)
    readonly name: string;

    @IsInt()
    @Min(1)
    readonly level: number;

    @IsInt()
    readonly gymId: number;
}
