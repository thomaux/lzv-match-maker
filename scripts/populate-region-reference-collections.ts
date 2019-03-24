import { connect } from 'mongoose';
import { GymModel } from '../src/server/models/GymModel';
import { RegionModel } from '../src/server/models/RegionModel';
import * as regions from './region-reference-data.json';

execute(regions)
    .then(res => {
        console.log(`Successfully populated ${res.nrOfRegions} regions & ${res.nrOfGyms} gyms`);
        process.exit(0);
    })
    .catch(err => {
        console.error('Something went wrong while populating the reference collections', err);
        process.exit(1);
    });

interface RegionReferenceData {
    id: number;
    name: string;
    lowestPossibleLevel: number;
    gyms: {
        id: number;
        name: string;
    }[]
}

async function execute(regions: RegionReferenceData[]) {
    await connect(`mongodb://${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_SECRET)}@${process.env.MONGO_HOST}`, { useNewUrlParser: true })

    await RegionModel.deleteMany({});
    await GymModel.deleteMany({});

    const promiseAllRegions = regions.map(region => RegionModel.create({
        _id: region.id,
        name: region.name,
        lowestPossibleLevel: region.lowestPossibleLevel
    }));

    const promiseAllGyms = [].concat.apply([], regions.map(region =>
        region.gyms.map(gym =>
            GymModel.create({
                _id: gym.id,
                name: gym.name,
                regionId: region.id
            }))));

    await Promise.all(promiseAllRegions);
    await Promise.all(promiseAllGyms);

    return {
        nrOfRegions: promiseAllRegions.length,
        nrOfGyms: promiseAllGyms.length
    };
}
