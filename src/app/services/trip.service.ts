import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { compareNumber } from 'src/app/util/compare';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TripService {
  private readonly http: HttpClient;
  private readonly tripApi: string = `${environment.api}/trips`;
  private readonly signApi: string = `${environment.api}/sign`;

  private trips: any = {};

  constructor(http: HttpClient) {
    this.http = http;
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

  public async signTrip(tripId: string, star: any): Promise<string> {
    try {
      await this.http
        .post<string>(`${this.signApi}`, {
          tripId,
          starId: star.creationId,
        })
        .toPromise();

      return `${star.name} 報名成功！將於截止後進行抽籤`;
    } catch (e) {
      if (e.error.message === 'already signed')
        return `${star.name} 已經報名成功囉！將於截止後進行抽籤`;

      return '報名失敗，發生未知錯誤，請聯繫星遊官方帳號';
    }
  }
}
