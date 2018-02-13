import { ITeam } from "../../server/shared/ITeam";

export class Team implements ITeam {
    constructor(public name: String, public leagueLevel: Number, public location: String) {

    }
}
