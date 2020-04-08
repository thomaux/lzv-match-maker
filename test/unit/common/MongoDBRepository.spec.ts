import { assert, expect } from 'chai';
import { after, before, describe, it } from 'mocha';
import { Document, model, Model, Schema } from 'mongoose';
import { stub } from 'sinon';
import { MongoDBRepository } from '../../../src/common/repositories/MongoDBRepository';
import { Repository } from '../../../src/common/repositories/Repository';
import { reactivateIsValidObjectIdStub, restoreIsValidObjectIdStub } from '../../setup';

interface MockDoc extends Document {
    fake: boolean;
}

describe('The MongoDBRepository', () => {

    let repository: Repository<MockDoc>;
    let mockDockModel: Model<MockDoc>;

    before(() => {
        restoreIsValidObjectIdStub();
        mockDockModel = model('MockDoc', new Schema());
        repository = new MongoDBRepository(mockDockModel);
    });

    after(() => {
        reactivateIsValidObjectIdStub();
    });

    describe('Validates the id', () => {
        it('And returns null when retrieving a document from the database', async () => {
            const result = await repository.get('inval-id');
            expect(result).to.be.null;

        });
        it('Throws an error when deleting a document', async () => {

            try {
                await repository.delete('inval-id');
                assert(false);
            } catch (e) {
                expect(e.message).to.equal('Failed to delete MockDoc with id inval-id');
            }

        });
    });

    it('Throws an error when the document to be deleted could not be found', async () => {
        // Given
        stub(mockDockModel, 'findByIdAndDelete').returns(null);

        // when
        try {
            await repository.delete('inval-id');
            assert(false);
        } catch (e) {
            expect(e.message).to.equal('Failed to delete MockDoc with id inval-id');
        }
    });

});