export interface FindListingsQuery {
    regionId: number;
    level: number;
}

export async function findListings(query?: FindListingsQuery) {
    let url = 'listing';
    if(query) {
        url += '?' + Object.keys(query).filter(key => query[key]).map(key => key + '=' + query[key]).join('&');
    }

    return callAPI(url);
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
