import { Component, OnInit } from '@angular/core';
import { TeamService } from './team.service';
import { Team } from './team';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  model = new Team(undefined, undefined, undefined);

  constructor(private teamService: TeamService) { }

  ngOnInit() {
  }

  onSubmit() {
    this.teamService.createTeam(this.model)
      .then(() => alert('success'))
  }
}
