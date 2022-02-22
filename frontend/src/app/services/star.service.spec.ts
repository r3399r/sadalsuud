import { TestBed } from '@angular/core/testing';
import { HttpClientService } from './http-client.service';

import { StarService } from './star.service';

describe('StarService', () => {
  let service: StarService;
  let httpClientSpy: jasmine.SpyObj<HttpClientService>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClientService', ['get']);
    httpClientSpy.get.and.resolveTo('good');

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
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
  });
});
