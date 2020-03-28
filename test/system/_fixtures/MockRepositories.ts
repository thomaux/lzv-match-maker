import { Listing } from '../../../src/modules/listing/models/Listing';
import { Gym } from '../../../src/modules/location/models/Gym';
import { Region } from '../../../src/modules/location/models/Region';
import { Team } from '../../../src/modules/team/models/Team';

export const mockListingRepository = {
    create(): Listing {
        const d = new Date();
        d.setFullYear(d.getFullYear() + 1);
        return {
            id: '1',
            teamId: '1',
            minLevel: 5,
            maxLevel: 1,
            date: d,
            gymId: 1
        };
    },
};

export const mockGymRepository = {
    findById(id: number): Gym {
        if (id !== 1) {
            return undefined;
        }
        return {
            id: '1',
            regionId: 1,
            name: 'Test Gym'
        };
    },
    find({ regionId }: { regionId: number }): Gym[] {
        if(regionId === 1) {
            return [
                {
                    id: '1',
                    regionId: 1,
                    name: 'Test Gym'
                },
                {
                    id: '2',
                    regionId: 1,
                    name: 'Test Gym 2'
                }
            ];
        }
        return [];
    }
};

export const mockRegionRepository = {
    findById(id: number): Region {
        if (id !== 1) {
            return undefined;
        }
        return {
            id: '1',
            name: 'Test Region',
            lowestPossibleLevel: 3
        };
    }
};

const teams = [
    {
        id: '1',
        name: 'Team of owner 1',
        gymId: 1,
        level: 4,
        ownerId: '1'
    },
    {
        id: '2',
        name: 'Team of owner 2',
        gymId: 1,
        level: 2,
        ownerId: '2'
    }
];

export const mockTeamsRepository = {
    findById(id: string): Team {
        return teams.find(t => t.id === id);
    }
};
