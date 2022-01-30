import { Injectable } from '@angular/core';
import {
  GetTripResponse,
  GetTripsResponse,
  PostTripRequest,
  PostTripResponse,
  SignTripRequest,
  SignTripResponse,
} from '@y-celestial/sadalsuud-service';
import { HttpClientService } from './http-client.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class TripService {
  constructor(private http: HttpClientService, private userService: UserService) {}

  public async getTrips() {
    return await this.http.get<GetTripsResponse>('trips');
  }

  public async createTrip(data: PostTripRequest) {
    return await this.http.post<PostTripResponse, PostTripRequest>('trips', data);
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
