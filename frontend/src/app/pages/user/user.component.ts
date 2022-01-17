import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GetUserResponse, PostUserRequest, ROLE, User } from '@y-celestial/sadalsuud-service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ROLE as ROLE_LOCALE } from 'src/app/locales/role';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  user: User | undefined;
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
      .then((res: GetUserResponse) => {
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
        .then((res: User) => {
          this.user = res;
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
        .then((res: User) => {
          this.user = res;
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
    if (role === ROLE.ROOKIE) return ROLE_LOCALE.ROOKIE;
    if (role === ROLE.GOOD_PARTNER || role === ROLE.SOFT_PARTNER) return ROLE_LOCALE.PARTNER;
    if (role === ROLE.GOOD_PLANNER || role === ROLE.SOFT_PLANNER) return ROLE_LOCALE.PLANEER;
    if (role === ROLE.ADMIN) return ROLE_LOCALE.ADMIN;
    return ROLE_LOCALE.PASSERBY;
  }

  onClick() {
    this.isEdit = true;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
