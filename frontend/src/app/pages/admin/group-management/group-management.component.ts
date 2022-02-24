import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GetGroupsResponse, GetStarsResponse, Group } from '@y-celestial/sadalsuud-service';
import { GroupService } from 'src/app/services/group.service';
import { StarService } from 'src/app/services/star.service';

@Component({
  selector: 'app-group-management',
  templateUrl: './group-management.component.html',
  styleUrls: ['./group-management.component.scss'],
})
export class GroupManagementComponent implements OnInit {
  isSubmitting = false;
  partnerGroups: Group[] = [];
  starGroups: Group[] = [];
  displayedColumns = ['name', 'member'];
  hasStar = false;
  stars: GetStarsResponse = [];
  inputUser: Map<string, string> = new Map();
  addGroupForm = this.fb.group({
    userId: ['', Validators.required],
    starId: [''],
  });

  constructor(
    private groupService: GroupService,
    private starService: StarService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.groupService.getAllGroups().then((res: GetGroupsResponse) => {
      res.forEach((g: Group) => {
        if (g.star === undefined) this.partnerGroups.push(g);
        else this.starGroups.push(g);
      });
    });
    this.starService.getAllStars().then((res: GetStarsResponse) => {
      this.stars = res.filter((s: GetStarsResponse[0]) => s.nGroups === 0);
    });
  }

  onRefresh() {
    this.starGroups = [];
    this.partnerGroups = [];
    this.groupService.refreshAllGroups().then((res: GetGroupsResponse) => {
      res.forEach((g: Group) => {
        if (g.star === undefined) this.partnerGroups.push(g);
        else this.starGroups.push(g);
      });
    });
  }

  onSubmit() {
    if (!this.addGroupForm.valid) return;
    this.isSubmitting = true;
    const data = {
      userId: this.addGroupForm.value.userId,
      starId: this.hasStar ? this.addGroupForm.value.starId : undefined,
    };
    this.groupService
      .addGroup(data)
      .then(() => {
        this.snackBar.open('success', undefined, { duration: 4000 });
      })
      .catch((e) => {
        this.snackBar.open(e.message, undefined, { duration: 4000 });
      })
      .finally(() => {
        this.isSubmitting = false;
      });
  }

  onInput(event: any, id: string) {
    this.inputUser.set(id, event.target.value);
  }

  onAdd(id: string) {
    this.isSubmitting = true;
    const userId = this.inputUser.get(id);
    if (userId === undefined) return;
    this.groupService
      .addGroupMember(id, userId)
      .then(() => {
        this.snackBar.open('success', undefined, { duration: 4000 });
      })
      .catch((e) => {
        this.snackBar.open(e.message, undefined, { duration: 4000 });
      })
      .finally(() => {
        this.isSubmitting = false;
      });
  }

  onDelete(groupId: string, userId: string) {
    this.isSubmitting = true;
    this.groupService
      .removeGroupMember(groupId, userId)
      .then(() => {
        this.snackBar.open('success', undefined, { duration: 4000 });
      })
      .catch((e) => {
        this.snackBar.open(e.message, undefined, { duration: 4000 });
      })
      .finally(() => {
        this.isSubmitting = false;
      });
  }
}
