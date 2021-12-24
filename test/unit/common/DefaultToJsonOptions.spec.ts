import { defaultToJsonOptions } from '../../../src/common/repositories/DefaultToJsonOptions';

describe('The defaultToJSONOptions', () => {

    it('transform method, removes the _id property from the input', () => {
        // Given
        const data = {
            _id: '1'
        };

        // When
        (defaultToJsonOptions.transform as (doc: unknown, ret: unknown, options: unknown) => unknown)(undefined, data, undefined);

        // Then
        expect(data._id).toBeUndefined();
    });
});
