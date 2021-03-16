import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ParameterService } from 'src/app/services/parameter.service';

describe('ParameterService', () => {
  let service: ParameterService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    httpClientSpy.get.and.returnValue(of({ a: 'hello', b: 'world' }));

    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClientSpy }],
    });
    service = TestBed.inject(ParameterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getParameter() should work', async () => {
    await service.getParameter('a');
    // second time would use saved value
    expect(await service.getParameter('a')).toBe('hello');
  });
});
