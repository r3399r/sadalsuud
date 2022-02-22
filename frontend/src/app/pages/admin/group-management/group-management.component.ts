import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GetGroupsResponse, Group, Star, User } from '@y-celestial/sadalsuud-service';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-group-management',
  templateUrl: './group-management.component.html',
  styleUrls: ['./group-management.component.scss'],
})
export class GroupManagementComponent implements AfterViewInit {
  groups: MatTableDataSource<Group> = new MatTableDataSource<Group>([]);
  displayedColumns = ['name', 'member'];

  constructor(private groupService: GroupService) {}

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    this.groupService.getAllGroups().then((res: GetGroupsResponse) => {
      this.groups = new MatTableDataSource(res);
      this.groups.sort = this.sort;
    });
  }

  getStar(star: Star | undefined) {
    return star?.name ?? '無';
  }

  getMember(user: User[]) {
    return user.map((u: User) => u.name).join();
  }
}
