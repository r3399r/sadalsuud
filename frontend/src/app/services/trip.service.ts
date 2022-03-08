import { Injectable } from '@angular/core';
import {
  GetTripResponse,
  GetTripsResponse,
  PostTripRequest,
  PostTripResponse,
  ReviseTripRequest,
  ReviseTripResponse,
  SignTripRequest,
  SignTripResponse,
} from '@y-celestial/sadalsuud-service';
import { HttpClientService } from './http-client.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class TripService {
  private trips: GetTripsResponse | undefined;

  constructor(private http: HttpClientService, private userService: UserService) {}

  private async getTrips() {
    if (this.trips === undefined) this.trips = await this.http.get<GetTripsResponse>('trips');
    return this.trips;
  }

  public async getVerfiedTrips(): Promise<GetTripsResponse> {
    return (await this.getTrips()).filter((trip: GetTripsResponse[0]) => trip.verified === true);
  }

  public async getUnverifiedTrips(): Promise<GetTripsResponse> {
    return (await this.getTrips()).filter((trip: GetTripsResponse[0]) => trip.verified === false);
  }

  public async createTrip(data: PostTripRequest) {
    return await this.http.post<PostTripResponse, PostTripRequest>('trips', data);
  }

  public async editTrip(id: string, data: ReviseTripRequest) {
    return await this.http.put<ReviseTripResponse, ReviseTripRequest>(`trips/${id}`, data);
  }

  public async getTrip(id: string) {
    return await this.http.get<GetTripResponse>(`trips/${id}`);
  }

  public async signTrip(id: string, data: SignTripRequest) {
    try {
      await this.http.post<SignTripResponse, SignTripRequest>(`trips/${id}/sign`, data);
      await this.userService.refreshUser();
    } catch (e) {
      if (e.message === 'You have already signed this trip before.')
        throw new Error('您已報名過了');
      throw new Error(e);
    }
  }
}
