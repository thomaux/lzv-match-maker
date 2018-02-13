import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ITeam } from '../../server/shared/ITeam';

@Injectable()
export class TeamService {

  constructor(private http: Http) { }

  // Get all posts from the API
  createTeam(team: ITeam) {
    return this.http.post('/api/team', team)
      .toPromise();
  }
}
