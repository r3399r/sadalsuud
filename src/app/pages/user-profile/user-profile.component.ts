import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { LineUserProfile } from 'src/app/model/LineUserProfile';
import { LineAuthService } from 'src/app/services/line-auth.service';
import { ParameterService } from 'src/app/services/parameter.service';
import { UserService } from 'src/app/services/user.service';
import { DateHelper } from 'src/app/util/date-helper';

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
  private loadingController: LoadingController;
  private dateHelper: DateHelper;

  constructor(
    userService: UserService,
    parameterService: ParameterService,
    lineAuthService: LineAuthService,
    router: Router,
    loadingController: LoadingController
  ) {
    this.userService = userService;
    this.parameterService = parameterService;
    this.lineAuthService = lineAuthService;
    this.router = router;
    this.loadingController = loadingController;
    this.dateHelper = new DateHelper();
  }

  async ngOnInit(): Promise<void> {
    const loading: HTMLIonLoadingElement = await this.loadingController.create({
      message: '讀取中...',
    });
    await loading.present();

    this.lineUserProfile = await this.userService.getLineUser();
    this.user = await this.userService.getUser();

    this.lineChannelUrl = await this.parameterService.getParameter(
      'SADALSUUD_CHANNEL_URL'
    );
    await loading.dismiss();
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

  getDate(birthday: string): string {
    return this.dateHelper.getDate(birthday);
  }

  getAge(birthday: string): number {
    return this.dateHelper.getAge(birthday);
  }
}
