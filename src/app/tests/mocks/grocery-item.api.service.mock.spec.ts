import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { GroceryItemApiService } from '@models/grocery-items/grocery-item.api.service';

export class GroceryItemApiServiceMock {
  public spy?: jasmine.SpyObj<GroceryItemApiService>;
  public create(): jasmine.SpyObj<GroceryItemApiService> {
    this.spy = jasmine.createSpyObj(GroceryItemApiService.name, [
      'create',
      'getAll',
      'updateRecord',
      'deleteRecord',
    ]) as jasmine.SpyObj<GroceryItemApiService>;
    return this.spy;
  }
  public getSpy(): jasmine.SpyObj<GroceryItemApiService> {
    return TestBed.inject(
      GroceryItemApiService,
    ) as jasmine.SpyObj<GroceryItemApiService>;
  }
  public getProvider(): {
    provide: Type<GroceryItemApiService>;
    useValue: jasmine.SpyObj<GroceryItemApiService>;
  } {
    return { provide: GroceryItemApiService, useValue: this.spy! };
  }
}
