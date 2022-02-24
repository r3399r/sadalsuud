import { TestBed } from '@angular/core/testing';
import { PostStarRequest } from '@y-celestial/sadalsuud-service';
import { HttpClientService } from './http-client.service';

import { StarService } from './star.service';

describe('StarService', () => {
  let service: StarService;
  let httpClientSpy: jasmine.SpyObj<HttpClientService>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClientService', ['get', 'post']);
    httpClientSpy.get.and.resolveTo('good');
    httpClientSpy.post.and.resolveTo('good');

    TestBed.configureTestingModule({
      providers: [{ provide: HttpClientService, useValue: httpClientSpy }],
    });
    service = TestBed.inject(StarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllStars should work', async () => {
    await service.getAllStars();
    await service.getAllStars();
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
  });

  it('refreshAllStars should work', async () => {
    await service.refreshAllStars();
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
  });

  it('addStar should work', async () => {
    await service.addStar({} as PostStarRequest);
    expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
  });
});
