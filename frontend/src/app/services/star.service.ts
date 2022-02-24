import { Injectable } from '@angular/core';
import {
  GetStarsResponse,
  PostStarRequest,
  PostStarResponse,
  Star,
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

  public async addStar(data: PostStarRequest): Promise<PostStarResponse> {
    return await this.http.post<PostStarResponse, PostStarRequest>('stars', data);
  }
}
