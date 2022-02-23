import { Component, OnInit } from '@angular/core';
import { GetGroupsResponse, Group } from '@y-celestial/sadalsuud-service';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-group-management',
  templateUrl: './group-management.component.html',
  styleUrls: ['./group-management.component.scss'],
})
export class GroupManagementComponent implements OnInit {
  partnerGroups: Group[] = [];
  starGroups: Group[] = [];
  displayedColumns = ['name', 'member'];

  constructor(private groupService: GroupService) {}

  ngOnInit(): void {
    this.groupService.getAllGroups().then((res: GetGroupsResponse) => {
      res.forEach((g: Group) => {
        if (g.star === undefined) this.partnerGroups.push(g);
        else this.starGroups.push(g);
      });
    });
  }
}
