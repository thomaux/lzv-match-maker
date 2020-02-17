export interface FindListingsConditions {
    date: { $gt: Date };
    minLevel?: { $gte: number };
    maxLevel?: { $lte: number };
    gymId?: { $in: number[] };
}
