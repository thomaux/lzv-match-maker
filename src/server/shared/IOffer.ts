export interface IOffer {
    dateAndTime: Date,
    location: ILocation,
    forLevels: number[],
    areCostsSplit: boolean
}

export interface ILocation {
    postalCode: number,
    gymName: string
}