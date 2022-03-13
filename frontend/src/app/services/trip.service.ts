import { Injectable } from '@angular/core';
import {
  GetSignResponse,
  GetTripResponse,
  GetTripsResponse,
  PostTripRequest,
  PostTripResponse,
  ReviseTripRequest,
  ReviseTripResponse,
  SetTripMemberRequest,
  SetTripMemberResponse,
  SignTripRequest,
  SignTripResponse,
  User,
  VerifyTripRequest,
  VerifyTripResponse,
} from '@y-celestial/sadalsuud-service';
import { HttpClientService } from './http-client.service';
import { UserService } from './user.service';
import { Sign } from 'src/app/model/Sign';

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

  public async getSignedList(id: string): Promise<Sign[]> {
    const signedList = await this.http.get<GetSignResponse>(`trips/${id}/sign`);
    return signedList.map((v: GetSignResponse[0]) => {
      const isStarGroup = v.group.star !== undefined;
      let phone = v.group.user[0].phone;
      if (isStarGroup) {
        phone = v.group.user.map((u: User) => `${u.name}: ${u.phone}`).join(', ');
      }
      return {
        groupId: v.group.id,
        type: isStarGroup ? 'star' : 'volunteer',
        name: isStarGroup ? v.group.star!.name : v.group.user[0].name,
        birthday: isStarGroup ? v.group.star!.birthday : v.group.user[0].birthday,
        phone,
        targetId: isStarGroup ? v.group.star!.id : v.group.user[0].id,
      };
    });
  }

  public async verifyTrip(id: string, data: VerifyTripRequest) {
    return await this.http.put<VerifyTripResponse, VerifyTripRequest>(`trips/${id}/verify`, data);
  }

  public async setMember(id: string, groupIds: string) {
    const groupId = groupIds.split(',');
    return await this.http.put<SetTripMemberResponse, SetTripMemberRequest>(`trips/${id}/member`, {
      groupId,
    });
  }
}
