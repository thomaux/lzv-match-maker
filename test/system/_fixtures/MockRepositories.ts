import { Gym } from '../../../src/modules/gym/models/Gym';
import { Listing } from '../../../src/modules/listing/models/Listing';
import { Region } from '../../../src/modules/region/models/Region';

export const mockListingRepository = {
    async create(): Promise<Listing> {
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
    }
};

export const mockGymRepository = {
    async findById(id: number): Promise<Gym> {
        if(id !== 1) {
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
    async findById(id: number): Promise<Region> {
        if(id !== 1) {
            return undefined;
        }
        return { 
            _id: 1,
            name: 'Test Region',
            lowestPossibleLevel: 3
        };
    } 
};