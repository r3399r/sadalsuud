import { Injectable } from '@angular/core';
import {
  GetTripResponse,
  GetTripsResponse,
  PostTripRequest,
  PostTripResponse,
} from '@y-celestial/sadalsuud-service';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root',
})
export class TripService {
  constructor(private http: HttpClientService) {}

  public async getTrips() {
    return await this.http.get<GetTripsResponse>('trips');
  }

  public async createTrip(data: PostTripRequest) {
    return await this.http.post<PostTripResponse, PostTripRequest>('trips', data);
  }

  public async getTrip(id: string) {
    return await this.http.get<GetTripResponse>(`trips/${id}`);
  }
}
