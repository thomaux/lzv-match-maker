import { NestApplication } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { expect } from 'chai';
import { before, describe, it } from 'mocha';
import { match, SinonStub, stub } from 'sinon';
import * as request from 'supertest';
import { Team } from '../../../src/modules/team/models/Team';
import { TeamModule } from '../../../src/modules/team/TeamModule';
import { createTestModuleWithMocks } from '../_fixtures/MockModule';

describe('When listing teams', () => {

    let app: NestApplication;
    const aggregateStub: SinonStub<{}[], Team[]> = stub();

    before(async () => {
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

    it('Returns only teams of which the current logged in user is the owner', async () => {
        // Given
        aggregateStub.returns([
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
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(1);
        expect(response.body[0]).to.deep.equal(
            {
                id: '1',
                name: 'Team of owner 1',
                gymId: 1,
                level: 4,
                ownerId: '1'
            }
        );
        expect(aggregateStub).to.have.been.calledWith(match.array);
        expect(aggregateStub.firstCall.args[0][0]).to.deep.equal({ $match: { ownerId: '1' }});
    });

    it('Returns an empty list, in case the current logged in user has no teams', async () => {
        // Given
        aggregateStub.returns([]);

        // When
        const response = await request(app.getHttpServer())
            .get('/api/team');

        // Then
        expect(response.status).to.equal(200);
        expect(response.body).to.be.instanceOf(Array);
        expect(response.body.length).to.equal(0);
        expect(aggregateStub).to.have.been.calledWith(match.array);
        expect(aggregateStub.firstCall.args[0][0]).to.deep.equal({ $match: { ownerId: '1' }});
    });
});
