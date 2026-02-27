import { GroceryItemApiService } from '@models/grocery-items/grocery-item.api.service';
import Mocker from './mocker.spec';

export class GroceryItemApiServiceMock extends Mocker<GroceryItemApiService> {
  protected override readonly token = GroceryItemApiService;
  public create(): jasmine.SpyObj<GroceryItemApiService> {
    this.spy = jasmine.createSpyObj(GroceryItemApiService.name, [
      'create',
      'getAll',
      'updateRecord',
      'deleteRecord',
    ]) as jasmine.SpyObj<GroceryItemApiService>;
    return this.spy;
  }
}
