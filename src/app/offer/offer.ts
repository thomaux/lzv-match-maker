import { IOffer } from "../../server/shared/IOffer";

export class Offer implements IOffer {
    constructor(public dateAndTime: Date, public areCostsSplit: boolean){

    }
}
