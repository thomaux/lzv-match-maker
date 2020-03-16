import { Listing } from '../../../src/modules/listing/models/Listing';
import { Gym } from '../../../src/modules/location/models/Gym';
import { Region } from '../../../src/modules/location/models/Region';

export const mockListingRepository = {
    create(): Listing {
        const d = new Date();
        d.setFullYear(d.getFullYear() + 1);
        return {
            _id: 1,
            authorId: '1',
            minLevel: 5,
            maxLevel: 1,
            date: d,
            teamName: 'FC Test',
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
            _id: 1,
            regionId: 1,
            name: 'Test Gym'
        };
    }
};

export const mockRegionRepository = {
    findById(id: number): Region {
        if (id !== 1) {
            return undefined;
        }
        return {
            _id: 1,
            name: 'Test Region',
            lowestPossibleLevel: 3
        };
    }
};