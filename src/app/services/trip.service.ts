import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LineService } from 'src/app/services/line.service';
import { UserService } from 'src/app/services/user.service';
import { compareNumber } from 'src/app/util/compare';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TripService {
  private readonly http: HttpClient;
  private readonly userService: UserService;
  private readonly lineService: LineService;
  private readonly tripApi: string = `${environment.api}/trips`;
  private readonly signApi: string = `${environment.api}/sign`;

  private trips: any = {};

  constructor(
    http: HttpClient,
    userService: UserService,
    lineService: LineService
  ) {
    this.http = http;
    this.userService = userService;
    this.lineService = lineService;
  }

  private async loadTrips(): Promise<void> {
    const rawTrips = await this.http.get<any>(this.tripApi).toPromise();

    const unsortedTrips = rawTrips.map((rawTrip: any) => {
      return { ...rawTrip, sortKey: new Date(rawTrip.startDate) };
    });
    unsortedTrips.sort(compareNumber('sortKey')).forEach((trip: any) => {
      delete trip.sortKey;
      this.trips[trip.creationId] = trip;
    });
  }

  public async getTrips(): Promise<any> {
    if (Object.keys(this.trips).length === 0) await this.loadTrips();

    const res = [];
    for (const key of Object.keys(this.trips)) {
      const trip = this.trips[key];
      if (new Date(trip.endDate).getTime() > Date.now()) res.push(trip);
    }

    return res;
  }

  public async getTrip(id: string): Promise<any> {
    if (Object.keys(this.trips).length === 0) await this.loadTrips();

    return this.trips[id];
  }

  public async signTrip(tripId: string): Promise<string> {
    try {
      const user = await this.userService.getUser();

      if (user === undefined) {
        const lineUserProfile = await this.userService.getLineUser();
        await this.lineService.pushMessage(lineUserProfile.userId, [
          '您好，我們收到您的報名申請，但由於我們的資料庫中並未有您的資料，故報名尚未成功。',
          '請您回覆以下基本資訊，謝謝您\n1. 姓名\n2. 身份(星兒家人或星雨團員或其他)\n3. 聯絡方式(手機)',
        ]);

        return '報名尚未成功。資料庫並未有您的資料，請開啟LINE回覆星遊的官方帳號';
      }

      if (user.role !== 'family' && user.role !== 'star')
        return '報名失敗。此活動僅開放給星兒或家人報名，資料庫顯示您的身份為「星雨哥姐」。若您想參加活動或資料設定有誤，請洽星遊的LINE官方帳號，謝謝';

      // if(user.starInfo.lengh>0){

      // }

      await this.http
        .post<string>(`${this.signApi}`, {
          tripId,
          starId: user.starInfo[0].creationId,
        })
        .toPromise();

      return '報名成功，將於截止後進行抽籤';
    } catch (e) {
      if (e.error.message === 'already signed')
        return '已經報名成功過囉，將於截止後進行抽籤';

      return '發生未知錯誤，請聯繫星遊官方帳號';
    }
  }
}
