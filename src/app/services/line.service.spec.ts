import { TestBed } from '@angular/core/testing';
import { LineService } from 'src/app/services/line.service';

describe('LineService', () => {
  let service: LineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
