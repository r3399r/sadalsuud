import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LineService } from 'src/app/services/line.service';

describe('LineService', () => {
  let service: LineService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    httpClientSpy.post.and.returnValue(of({ a: 1, b: '2' }));

    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClientSpy }],
    });
    service = TestBed.inject(LineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('pushMessage() should work', async () => {
    await service.pushMessage('to', ['message']);
    expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
  });
});
