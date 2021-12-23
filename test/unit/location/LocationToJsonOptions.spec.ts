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
        expect(data._id).toBeUndefined;
        expect(data.id).toEqual(1);
    });
});
