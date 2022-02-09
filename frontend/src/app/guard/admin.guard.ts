import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { ROLE } from '@y-celestial/sadalsuud-service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
  ) {}

  async canActivate(): Promise<boolean | UrlTree> {
    const isLogin = this.authService.isLogin();
    const user = await this.userService.getUser();
    const isAdmin = user.role === ROLE.ADMIN;

    if (isLogin && isAdmin) return true;
    return this.router.parseUrl('/');
  }
}
