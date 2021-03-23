import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TripService {
  private readonly http: HttpClient;
  private readonly tripApi: string = `${environment.api}/trips`;
  private readonly signApi: string = `${environment.api}/sign`;

  constructor(http: HttpClient) {
    this.http = http;
  }

  public async getTrips(): Promise<any> {
    const trips = await this.http.get<any>(this.tripApi).toPromise();

    const res = [];
    trips.forEach((trip: any) => {
      if (new Date(trip.expiredDate).getTime() > Date.now()) res.push(trip);
    });

    return res;
  }

  public async getTrip(id: string): Promise<any> {
    return await this.http.get<any>(`${this.tripApi}/${id}`).toPromise();
  }

  public async signTrip(tripId: string, lineUserId: string): Promise<string> {
    return await this.http
      .post<string>(`${this.signApi}`, {
        tripId,
        lineUserId,
      })
      .toPromise();
  }
}
