import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { VariablesService } from './variables.service';

describe('VariablesService', () => {
  let service: VariablesService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClientSpy }],
    });
    service = TestBed.inject(VariablesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getVariables should work', async () => {
    httpClientSpy.get.and.returnValue(of({ lineLoginId: 'a' }));

    expect(await service.getVariables('lineLoginId')).toEqual({ lineLoginId: 'a' });
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    expect(await service.getVariables('lineLoginId')).toEqual({ lineLoginId: 'a' });
  });
});
