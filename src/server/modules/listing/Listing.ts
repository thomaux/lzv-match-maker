export interface Listing {
    teamName: string;
    date: Date;
    minLevel: number;
    maxLevel: number;
    gymId: number;
    authorId: string;
}

export interface FindListingsRequest {
    regionId?: number;
    level?: number;
}

export interface CreateListingRequest {
    teamName: string;
    date: string;
    minLevel: number;
    maxLevel: number;
    gymId: number;
}
