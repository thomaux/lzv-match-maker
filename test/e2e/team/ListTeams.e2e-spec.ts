import { NestApplication } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import * as request from 'supertest';
import { TeamModule } from '../../../src/modules/team/TeamModule';
import { createTestModuleWithMocks } from '../_fixtures/MockModule';

describe('When listing teams', () => {
    let app: NestApplication;
    const aggregateStub = jest.fn();

    beforeAll(async () => {
        const module = await createTestModuleWithMocks({
            imports: [TeamModule]
        })
            .overrideProvider(getModelToken('Team'))
            .useValue({
                aggregate: aggregateStub
            })
            .compile();

        app = module.createNestApplication();
        await app.init();
    });

    afterAll(() => {
        app.close();
    });

    afterEach(() => {
        aggregateStub.mockReset();
    });

    it('Returns only teams of which the current logged in user is the owner', async () => {
        // Given
        aggregateStub.mockReturnValue([
            {
                id: '1',
                name: 'Team of owner 1',
                gymId: 1,
                level: 4,
                ownerId: '1'
            }
        ]);

        // When
        const response = await request(app.getHttpServer())
            .get('/api/team');

        // Then
        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(1);
        expect(response.body).toEqual([{
            id: '1',
            name: 'Team of owner 1',
            gymId: 1,
            level: 4,
            ownerId: '1'
        }]);
        expect(aggregateStub).toHaveBeenNthCalledWith(1, expect.arrayContaining([{ $match: { ownerId: '1' } }]));
    });

    it('Returns an empty list, in case the current logged in user has no teams', async () => {
        // Given
        aggregateStub.mockReturnValue([]);

        // When
        const response = await request(app.getHttpServer())
            .get('/api/team');

        // Then
        expect(response.status).toEqual(200);
        expect(response.body).toEqual([]);
        expect(aggregateStub).toHaveBeenNthCalledWith(1, expect.arrayContaining([{ $match: { ownerId: '1' } }]));
    });
});
