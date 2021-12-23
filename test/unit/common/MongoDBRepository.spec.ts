import { Document, model, Model, Schema } from 'mongoose';
import { MongoDBRepository } from '../../../src/common/repositories/MongoDBRepository';
import { Repository } from '../../../src/common/repositories/Repository';
import { reactivateIsValidObjectIdStub, restoreIsValidObjectIdStub } from '../../setup';

interface MockDoc extends Document {
    fake: boolean;
}

describe('The MongoDBRepository', () => {
    let repository: Repository<MockDoc>;
    let mockDockModel: Model<MockDoc>;

    beforeAll(() => {
        restoreIsValidObjectIdStub();
        mockDockModel = model('MockDoc', new Schema());
        repository = new MongoDBRepository(mockDockModel);
    });

    afterAll(() => {
        reactivateIsValidObjectIdStub();
    });

    describe('Validates the id', () => {
        it('And returns null when retrieving a document from the database', async () => {
            const result = await repository.get('inval-id');
            expect(result).toBeNull();

        });
        
        it('Throws an error when deleting a document', async () => {
            expect.assertions(1);
            try {
                await repository.delete('inval-id');
            } catch (e) {
                expect(e.message).toEqual('Failed to delete MockDoc with id inval-id');
            }

        });
    });

    it('Throws an error when the document to be deleted could not be found', async () => {
        // Given
        jest.spyOn(mockDockModel, 'findByIdAndDelete').mockReturnValue(null);
        expect.assertions(1);

        // when
        try {
            await repository.delete('inval-id');
        } catch (e) {
            expect(e.message).toEqual('Failed to delete MockDoc with id inval-id');
        }
    });

});