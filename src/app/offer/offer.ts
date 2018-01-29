import { IOffer, ILocation } from "../../server/shared/IOffer";

export class Offer implements IOffer {
    constructor(public dateAndTime: Date, public location: ILocation, public forLevels: number[], public areCostsSplit: boolean){

    }
}
