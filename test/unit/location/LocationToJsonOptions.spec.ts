import { expect } from 'chai';
import { describe, it } from 'mocha';
import { locationToJsonOptions } from '../../../src/modules/location/models/LocationToJsonOptions';

describe('The locationToJSONOptions', () => {

    it('transform method, renames the _id property to id on the input', () => {
        // Given
        const data: { _id?: unknown; id?: unknown} = {
            _id: 1
        };

        // When
        locationToJsonOptions.transform(undefined, data, undefined);

        // Then
        expect(data._id).to.be.undefined;
        expect(data.id).to.equal(1);
    });
});
