import { NestApplication } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import * as request from 'supertest';
import { ListingModule } from '../../../src/modules/listing/ListingModule';
import { FindListingsQuery } from '../../../src/modules/listing/models/FindListingsQuery';
import { createTestModuleWithMocks } from '../_fixtures/MockModule';

const mockedDate = new Date('2022-01-01');

describe('When searching for listings', () => {
    let app: NestApplication;
    const findSpy = jest.fn();

    beforeAll(async () => {
        const module = await createTestModuleWithMocks({
            imports: [ListingModule]
        })
            .overrideProvider(getModelToken('Listing'))
            .useValue({
                find: findSpy
            })
            .compile();

        app = module.createNestApplication();
        await app.init();

        const RealDate = Date;
        
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        global.Date = jest.fn((...args) => (args.length ? new RealDate(...args) : new RealDate(mockedDate)));
        global.Date.now = jest.fn(() => mockedDate.valueOf());
    });

    afterAll(() => {
        app.close();
    });

    afterEach(() => {
        findSpy.mockReset();
    });

    it('Adds a filter to only search on future Listings by default', async () => {
        // When
        const response = await request(app.getHttpServer())
            .get('/api/listing');

        // Then
        expect(response.status).toEqual(200);
        expect(findSpy).toHaveBeenCalledWith({
            date: {
                $gt: mockedDate
            }
        });
    });

    it('And specifying a level, will only return Listings for which minimum level is higher and the maximum lower', async () => {
        // Given
        const query: FindListingsQuery = {
            level: '3'
        };

        // When
        const response = await request(app.getHttpServer())
            .get('/api/listing')
            .query(query);

        // Then
        expect(response.status).toEqual(200);
        expect(findSpy).toHaveBeenCalledWith(expect.objectContaining({
            minLevel: {
                $gte: 3
            },
            maxLevel: {
                $lte: 3
            }
        }));
    });

    it('And specifying a region, will only return Listings for that Region', async () => {
        // Given
        const query: FindListingsQuery = {
            regionId: '1'
        };

        // When
        const response = await request(app.getHttpServer())
            .get('/api/listing')
            .query(query);

        // Then
        expect(response.status).toEqual(200);
        expect(findSpy).toHaveBeenCalledWith(expect.objectContaining({
            'region._id': 1
        }));
    });
});
