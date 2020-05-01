import { Listing } from '../../../src/modules/listing/models/Listing';
import { Gym } from '../../../src/modules/location/models/Gym';
import { Region } from '../../../src/modules/location/models/Region';
import { Team } from '../../../src/modules/team/models/Team';

const gyms = [
    {
        id: 1,
        regionId: 1,
        name: 'Test Gym'
    },
    {
        id: 2,
        regionId: 1,
        name: 'Test Gym 2'
    }
];

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

const region = {
    id: 1,
    name: 'Test Region',
    lowestPossibleLevel: 3
};

const d = new Date();
d.setFullYear(d.getFullYear() + 1);
const listings: Listing[] = [
    {
        id: 'exists-and-owned',
        team: teams[0],
        minLevel: 5,
        maxLevel: 1,
        date: d,
        gym: gyms[0],
        region
    },
    {
        id: 'exists-not-owned',
        team: teams[1],
        minLevel: 5,
        maxLevel: 1,
        date: d,
        gym: gyms[0],
        region
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
            id: 1,
            regionId: 1,
            name: 'Test Gym'
        };
    },
    find({ regionId }: { regionId: number }): Gym[] {
        return regionId === 1 ? gyms : [];
    }
};

export const mockRegionRepository = {
    findById(id: number): Region {
        return id === 1 ? region : undefined;
    }
};

export const mockTeamsRepository = {
    findById(id: string): Team {
        return teams.find(t => t.id === id);
    }
};
