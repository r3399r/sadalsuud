import { Injectable } from '@angular/core';
import {
  GetStarResponse,
  GetStarsResponse,
  PostStarRequest,
  PutRecordRequest,
  PutRecordResponse,
  PostStarResponse,
  PostRecordRequest,
  PostRecordResponse,
} from '@y-celestial/sadalsuud-service';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root',
})
export class StarService {
  stars: GetStarsResponse | undefined;

  constructor(private http: HttpClientService) {}

  public async getAllStars(): Promise<GetStarsResponse> {
    if (this.stars === undefined) this.stars = await this.http.get<GetStarsResponse>('stars');
    return this.stars;
  }

  public async refreshAllStars(): Promise<GetStarsResponse> {
    this.stars = await this.http.get<GetStarsResponse>('stars');
    return this.stars;
  }

  public async getStar(id: string): Promise<GetStarResponse> {
    return await this.http.get<GetStarResponse>(`stars/${id}`);
  }

  public async addStar(data: PostStarRequest): Promise<PostStarResponse> {
    return await this.http.post<PostStarResponse, PostStarRequest>('stars', data);
  }

  public async createRecord(data: PostRecordRequest): Promise<PostRecordResponse> {
    return await this.http.post('stars/record', data);
  }

  public async reviseRecord(data: PutRecordRequest): Promise<PutRecordResponse> {
    return await this.http.put('stars/record', data);
  }
}
