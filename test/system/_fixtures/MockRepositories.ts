import { Listing } from '../../../src/modules/listing/models/Listing';
import { Gym } from '../../../src/modules/location/models/Gym';
import { Region } from '../../../src/modules/location/models/Region';
import { Team } from '../../../src/modules/team/models/Team';

const d = new Date();
d.setFullYear(d.getFullYear() + 1);
const listings: Listing[] = [
    {
        id: 'exists-and-owned',
        teamId: '1',
        minLevel: 5,
        maxLevel: 1,
        date: d,
        gymId: 1
    },
    {
        id: 'exists-not-owned',
        teamId: '2',
        minLevel: 5,
        maxLevel: 1,
        date: d,
        gymId: 1
    }
];

export const mockListingRepository = {
    // TODO: use a stub instead of mocking the create method
    create(): Listing {
        return listings[0];
    },
    findById(id: string): Listing {
        return listings.find(l => l.id === id);
    },
    findByIdAndDelete(): Listing {
        return listings[0];
    }
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
        if (regionId === 1) {
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
