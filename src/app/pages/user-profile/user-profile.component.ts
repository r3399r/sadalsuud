import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LineUserProfile } from 'src/app/model/LineUserProfile';
import { LineAuthService } from 'src/app/services/line-auth.service';
import { ParameterService } from 'src/app/services/parameter.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  private userService: UserService;
  private parameterService: ParameterService;
  private lineAuthService: LineAuthService;
  public lineUserProfile: LineUserProfile;
  public user: any = {};
  public lineChannelUrl: string;
  public router: Router;

  constructor(
    userService: UserService,
    parameterService: ParameterService,
    lineAuthService: LineAuthService,
    router: Router
  ) {
    this.userService = userService;
    this.parameterService = parameterService;
    this.lineAuthService = lineAuthService;
    this.router = router;
  }

  async ngOnInit(): Promise<void> {
    this.lineUserProfile = await this.userService.getLineUser();

    const dbUser = await this.userService.getUser(this.lineUserProfile.userId);
    if (dbUser !== null) this.user = dbUser;

    this.lineChannelUrl = await this.parameterService.getParameter(
      'SADALSUUD_CHANNEL_URL'
    );
  }

  onLogout(): void {
    this.lineAuthService.logout();
    this.router.navigate(['login']);
  }

  getRole(role: string): string {
    if (role === 'family') return '星兒家人';
    if (role === 'starRain') return '星雨團員';
    if (role === 'star') return '星雨夥伴';

    return '待定';
  }
}
