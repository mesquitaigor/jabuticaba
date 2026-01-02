import { TestBed } from '@angular/core/testing';
import { GroceryItemApiService } from './grocery-item.api.service';

describe(GroceryItemApiService.name, () => {
  let service: GroceryItemApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroceryItemApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
