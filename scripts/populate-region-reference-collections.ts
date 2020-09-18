import { company, random, address } from 'faker';
import * as mongoose from 'mongoose';
import { GymSchema } from '../src/modules/location/models/GymSchema';
import { RegionSchema } from '../src/modules/location/models/RegionSchema';

const RegionModel = mongoose.model('Region', RegionSchema);
const GymModel = mongoose.model('Gym', GymSchema);

interface RegionReferenceData {
    id: number;
    name: string;
    lowestPossibleLevel: number;
    gyms: {
        id: number;
        name: string;
    }[];
}

async function populate(regions: RegionReferenceData[]): Promise<Record<string, number>> {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    await RegionModel.deleteMany({});
    await GymModel.deleteMany({});

    const promiseAllRegions = regions.map(region => RegionModel.create({
        _id: region.id,
        name: region.name,
        lowestPossibleLevel: region.lowestPossibleLevel
    }));

    const promiseAllGyms = regions.map(region =>
        region.gyms.map(gym =>
            GymModel.create({
                _id: gym.id,
                name: gym.name,
                regionId: region.id
            }))).reduce((acc, val) => acc.concat(val), []);

    await Promise.all(promiseAllRegions);
    await Promise.all(promiseAllGyms);

    return {
        nrOfRegions: promiseAllRegions.length,
        nrOfGyms: promiseAllGyms.length
    };
}

async function resolveData(randomize: boolean): Promise<RegionReferenceData[]> {

    if (!randomize) {
        throw new Error('populate script does not support retrieving actual data yet. Use the randomize flag to generate dummy reference data');
    }

    const result: RegionReferenceData[] = [];

    // generate a random nr. of Regions
    let nrOfRegions = random.number({
        min: 3,
        max: 10
    });

    while (nrOfRegions) {

        result.push({
            id: nrOfRegions,
            name: address.city(),
            lowestPossibleLevel: random.number({ min: 1, max: 5 }),
            gyms: []
        });

        nrOfRegions -= 1;
    }

    // For each region, generate a random nr. of Gyms
    result.forEach(region => {
        let nrOfGyms = random.number({ min: 2, max: 7 });
        while (nrOfGyms) {
            region.gyms.push({
                id: parseInt(region.id + '0' + nrOfGyms),
                name: company.companyName()
            });
            nrOfGyms -= 1;
        }
    });

    return result;
}

resolveData(true)
    .then(populate)
    .then(res => {
        console.log(`Successfully populated ${res.nrOfRegions} regions & ${res.nrOfGyms} gyms`);
        process.exit(0);
    })
    .catch(err => {
        console.error('Something went wrong while populating the reference collections', err);
        process.exit(1);
    });