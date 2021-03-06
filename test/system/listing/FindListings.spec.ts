import { NestApplication } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { expect } from 'chai';
import { before, describe, it } from 'mocha';
import { match, SinonSpy, spy } from 'sinon';
import * as request from 'supertest';
import { ListingModule } from '../../../src/modules/listing/ListingModule';
import { FindListingsQuery } from '../../../src/modules/listing/models/FindListingsQuery';
import { createTestModuleWithMocks } from '../_fixtures/MockModule';

describe('When searching for listings', () => {

    let app: NestApplication;
    const findSpy: SinonSpy = spy();

    before(async () => {
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
    });

    it('Adds a filter to only search on future Listings by default', async () => {
        // When
        const now = new Date();
        const response = await request(app.getHttpServer())
            .get('/api/listing');

        // Then
        expect(response.status).to.equal(200);
        expect(findSpy).to.have.been.calledWith({
            date: {
                $gt: match.date.and(match((val: Date) => val.getTime() - now.getTime() > 0, 'Date should be in the future'))
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
        expect(response.status).to.equal(200);
        expect(findSpy).to.have.been.calledWith(match({
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
        expect(response.status).to.equal(200);
        expect(findSpy).to.have.been.calledWith(match({
            'region._id': 1
        }));
    });
});
