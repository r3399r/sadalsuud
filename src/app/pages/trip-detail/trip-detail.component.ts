import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { LineUserProfile } from 'src/app/model/LineUserProfile';
import { LineAuthService } from 'src/app/services/line-auth.service';
import { TripService } from 'src/app/services/trip.service';
import { UserService } from 'src/app/services/user.service';
import { DateHelper } from 'src/app/util/date-helper';

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.scss'],
})
export class TripDetailComponent implements OnInit {
  private activatedRoute: ActivatedRoute;
  private lineAuthService: LineAuthService;
  private userService: UserService;
  private tripService: TripService;
  private alertController: AlertController;
  private loadingController: LoadingController;
  private dateHelper: DateHelper;

  public isLogin: boolean;
  public isExpired: boolean;
  public trip: any;

  constructor(
    activatedRoute: ActivatedRoute,
    lineAuthService: LineAuthService,
    userService: UserService,
    tripService: TripService,
    alertController: AlertController,
    loadingController: LoadingController
  ) {
    this.activatedRoute = activatedRoute;
    this.lineAuthService = lineAuthService;
    this.userService = userService;
    this.tripService = tripService;
    this.alertController = alertController;
    this.loadingController = loadingController;
    this.dateHelper = new DateHelper();
  }

  async ngOnInit(): Promise<void> {
    const loading: HTMLIonLoadingElement = await this.loadingController.create({
      message: '讀取中...',
    });
    await loading.present();

    this.isLogin = await this.lineAuthService.isAuth();

    this.activatedRoute.params.subscribe(async (params: Params) => {
      const res = await this.tripService.getTrip(params.id);
      this.trip = {
        ...res,
        startDate: this.dateHelper.dateAll(res.startDate),
        endDate: this.dateHelper.dateAll(res.endDate),
        expiredDate: this.dateHelper.dateAll(res.expiredDate),
      };

      this.isExpired =
        new Date(this.trip.expiredDate).getTime() > Date.now() ? true : false;
      await loading.dismiss();
    });
  }

  public isPageLoading(): boolean {
    return this.trip === undefined || this.isLogin === undefined;
  }

  // private async signConfirm(): Promise<void> {
  //   const loading: HTMLIonLoadingElement = await this.loadingController.create({
  //     message: '請稍等...',
  //   });
  //   await loading.present();

  //   const lineUserProfile: LineUserProfile = await this.userService.getLineUser();
  //   const signResponse: string = await this.tripService.signTrip(
  //     this.trip.creationId,
  //     lineUserProfile.userId
  //   );

  //   await loading.dismiss();
  //   const alert: HTMLIonAlertElement = await this.alertController.create({
  //     message: signResponse,
  //     buttons: ['知道了'],
  //   });
  //   await alert.present();
  // }

  public async onSign(): Promise<void> {
    const alert: HTMLIonAlertElement = await this.alertController.create({
      message: '請確認是否報名此次出遊',
      buttons: [
        {
          text: '是的',
          role: 'confirm',
        },
        '取消',
      ],
    });
    await alert.present();

    const eventDetail = await alert.onDidDismiss();
    if (eventDetail.role === 'confirm') {
      const loading: HTMLIonLoadingElement = await this.loadingController.create(
        {
          message: '請稍等...',
        }
      );
      await loading.present();

      const signResponse: string = await this.tripService.signTrip(
        this.trip.creationId
      );
      await loading.dismiss();

      const notification: HTMLIonAlertElement = await this.alertController.create(
        {
          message: signResponse,
          buttons: ['知道了'],
        }
      );
      await notification.present();
    }
  }

  public getAccompanyText(needFamilyAccompany: string): string {
    if (needFamilyAccompany === 'yes') return '是';

    return '視情況而定';
  }

  public warningMessage(): string {
    if (!this.isLogin) return '您尚未登入，可點擊右下角的「個人資料」以登入';
    if (!this.isExpired) return '報名期限已過，此活動僅開放查詢';

    return;
  }
}
