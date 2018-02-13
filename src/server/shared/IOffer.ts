import { ITeam } from "./ITeam";

export interface IOffer {
    dateAndTime: Date,
    areCostsSplit: boolean
    owner?: ITeam
}