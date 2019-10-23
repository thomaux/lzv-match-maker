import { Region } from "../common/models/RegionModel";

export interface ListingsQueryParameters {
    regionId?: number;
    level?: number;
}

export class ListingsQueryModel {

    region: Region | number;
    level: number;

    constructor(initial: ListingsQueryParameters) {
        if (!initial) {
            return;
        }
        this.level = initial.level;
        this.region = initial.regionId;
    }

    toQueryString(): string {
        const queryObject = this.toQueryObject();
        const keysWithValue = Object.keys(queryObject);

        return keysWithValue.length ? '?' + keysWithValue.map(key => key + '=' + queryObject[key]).join('&') : "";
    }

    toQueryObject(): ListingsQueryParameters {
        const queryObject: ListingsQueryParameters = {};

        if (this.region) {
            // TODO: how could we avoid calling the update method before the region has been resolved to a Region?
            queryObject.regionId = (this.region as Region)._id || this.region as number ;
        }
        if (this.level) {
            queryObject.level = this.level;
        }

        return queryObject;
    }
}