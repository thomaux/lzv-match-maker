import { expect } from 'chai';
import { describe, it } from 'mocha';
import { defaultToJsonOptions } from '../../src/common/repositories/DefaultToJsonOptions';

describe('The defaultToJSONOptions', () => {

    it('transform method, removes the _id property from the input', () => {
        // Given
        const data = {
            _id: '1'
        };

        // When
        defaultToJsonOptions.transform(undefined, data);

        // Then
        expect(data._id).to.be.undefined;
    });
});
