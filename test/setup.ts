import * as mongoose from 'mongoose';

let isValidObjectIdStub = jest.spyOn(mongoose, 'isValidObjectId');

// Global hooks
beforeAll(() => {
    isValidObjectIdStub.mockReturnValue(true);
});

afterAll(() => isValidObjectIdStub.mockReset());

// Utils
export function restoreIsValidObjectIdStub(): void {
    isValidObjectIdStub.mockReset();
}

export function reactivateIsValidObjectIdStub(): void {
    isValidObjectIdStub = jest.spyOn(mongoose, 'isValidObjectId');
}
