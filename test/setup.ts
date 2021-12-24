import * as mongoose from 'mongoose';

const isValidObjectIdStub = jest.spyOn(mongoose, 'isValidObjectId');

// Global hooks
beforeAll(() => {
    isValidObjectIdStub.mockReturnValue(true);
});

afterAll(() => isValidObjectIdStub.mockReset());

// Utils
export function restoreIsValidObjectIdStub(): void {
    isValidObjectIdStub.mockReset();
}
