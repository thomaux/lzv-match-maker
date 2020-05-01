export interface FindListingsConditions {
    date: { $gt: Date };
    minLevel?: { $gte: number };
    maxLevel?: { $lte: number };
    'region._id'?: number;
}
