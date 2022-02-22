import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import {
  GetUsersResponse,
  ROLE,
  User,
  STATUS,
  PutUserRoleRequest,
} from '@y-celestial/sadalsuud-service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment';
import { getRole, getUserStatus } from 'src/app/util/ui';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements AfterViewInit {
  users: MatTableDataSource<User> = new MatTableDataSource<User>([]);
  roles = Object.values(ROLE);
  statuses = Object.values(STATUS);
  displayedColumns = ['name', 'phone', 'birthday', 'role', 'status', 'dateUpdated', 'edit'];
  isEdit: Map<string, PutUserRoleRequest> = new Map();

  constructor(private userService: UserService, private snackBar: MatSnackBar) {}

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    this.userService.getAllUsers().then((res: GetUsersResponse) => {
      this.users = new MatTableDataSource(res);
      this.users.sort = this.sort;
    });
  }

  addRole(e: MatSelectChange, id: string) {
    const role = e.value as ROLE;
    this.isEdit.set(id, { ...this.isEdit.get(id), role });
  }

  addStatus(e: MatSelectChange, id: string) {
    const status = e.value as STATUS;
    this.isEdit.set(id, { ...this.isEdit.get(id), status });
  }

  getRole(role: ROLE) {
    return getRole(role);
  }

  getUserStatus(status: STATUS) {
    return getUserStatus(status);
  }

  getDate(ts: number) {
    return moment(ts).format('YYYY/MM/DD HH:mm:ss');
  }

  onEdit(id: string) {
    const data = this.isEdit.get(id);
    if (data === undefined) return;
    this.userService
      .updateUserStatus(id, data)
      .then(() => {
        this.snackBar.open('success', undefined, { duration: 4000 });
      })
      .catch(() => {
        this.snackBar.open('failed', undefined, { duration: 4000 });
      })
      .finally(() => {
        this.isEdit.delete(id);
      });
  }
}
