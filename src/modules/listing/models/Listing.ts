import { Gym } from '../../location/models/Gym';
import { Region } from '../../location/models/Region';
import { Team } from '../../team/models/Team';

export interface Listing {
    id: string;
    date: Date;
    minLevel: number;
    maxLevel: number;
    gym: Gym;
    region: Region;
    team: Team;
}
