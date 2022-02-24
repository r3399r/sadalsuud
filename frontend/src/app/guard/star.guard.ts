import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { ROLE } from '@y-celestial/sadalsuud-service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class StarGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
  ) {}

  async canActivate(): Promise<boolean | UrlTree> {
    try {
      const isLogin = this.authService.isLogin();
      const user = await this.userService.getUser();
      const isAuth =
        user.role === ROLE.ADMIN ||
        user.role === ROLE.SOFT_PLANNER ||
        user.role === ROLE.SOFT_PARTNER;
      if (!isLogin || !isAuth) throw Error();
      return true;
    } catch {
      return this.router.parseUrl('/');
    }
  }
}
