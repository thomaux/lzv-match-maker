export interface ListingsQueryParameters {
    regionId: number;
    level: number;
}

export class ListingsQueryModel implements ListingsQueryParameters {

    regionId: number;
    level: number;

    constructor(initial: ListingsQueryParameters) {
        if (!initial) {
            return;
        }
        this.level = initial.level;
        this.regionId = initial.regionId;
    }

    toString(): string {
        return this.keysWithValue ? '?' + this.keysWithValue.join('&') : "";
    }

    toQueryObject() {
        const queryObject = {};
        this.keysWithValue.forEach(k => {
            queryObject[k] = this[k];
        });
        return queryObject;
    }

    private get keysWithValue(): string[] {
        const keys = ['regionId', 'level'].filter(k => this[k]);
        return keys.length ? keys : undefined;
    }
}