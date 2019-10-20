import { ListingsQueryModel } from "../../search-listing/ListingsQueryModel";

export async function findListings(query: ListingsQueryModel) {
    return callAPI('listing' + query.toQueryString());
}

export function getRegions() {
    return callAPI('region');
}

async function callAPI(path: string): Promise<any> {
    const response = await fetch('/api/' + path);

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return response.json();
}
