import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  GetMeResponse,
  PostUserRequest,
  PostUserResponse,
  PutUserResponse,
  ROLE,
  STATUS,
} from '@y-celestial/sadalsuud-service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { getRole, getUserStatus } from 'src/app/util/ui';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  user: GetMeResponse | undefined;
  isLoading = true;
  isEdit = false;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.userService
      .getUser()
      .then((res: GetMeResponse) => {
        this.user = res;
      })
      .catch((e) => {
        this.snackBar.open(e.message, undefined, { duration: 4000 });
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  onFormSubmit(event: { type: 'add' | 'edit'; data: PostUserRequest }) {
    this.isLoading = true;
    if (event.type === 'add')
      this.userService
        .addUser(event.data)
        .then((res: PostUserResponse) => {
          this.user = { ...(this.user as GetMeResponse), ...res };
        })
        .catch((e) => {
          this.snackBar.open(e.message, undefined, { duration: 4000 });
        })
        .finally(() => {
          this.isLoading = false;
        });
    else
      this.userService
        .updateUser(event.data)
        .then((res: PutUserResponse) => {
          this.user = { ...(this.user as GetMeResponse), ...res };
        })
        .catch((e) => {
          this.snackBar.open(e.message, undefined, { duration: 4000 });
        })
        .finally(() => {
          this.isLoading = false;
          this.isEdit = false;
        });
  }

  onCancel() {
    this.isEdit = false;
  }

  getRole(role: ROLE) {
    return getRole(role);
  }

  isVerified() {
    return this.user?.status === STATUS.VERIFIED;
  }

  displayStatus() {
    if (this.user === undefined) return '';
    return `(${getUserStatus(this.user.status)})`;
  }

  isAdmin() {
    if (this.user?.role === ROLE.ADMIN) return true;
    return false;
  }

  onClick() {
    this.isEdit = true;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onClickAdmin() {
    this.router.navigate(['/admin']);
  }
}
