import { use } from 'chai';
import { afterEach, beforeEach } from 'mocha';
import * as mongoose from 'mongoose';
import { reset, SinonStub, stub } from 'sinon';
import * as sinonChai from 'sinon-chai';

use(sinonChai);

let isValidObjectIdStub: SinonStub = stub(mongoose, 'isValidObjectId');

// Global hooks
beforeEach(() => {
    isValidObjectIdStub.returns(true);
});

afterEach(() => reset());

// Utils
export function restoreIsValidObjectIdStub(): void {
    isValidObjectIdStub.restore();
}

export function reactivateIsValidObjectIdStub(): void {
    isValidObjectIdStub = stub(mongoose, 'isValidObjectId');
}
