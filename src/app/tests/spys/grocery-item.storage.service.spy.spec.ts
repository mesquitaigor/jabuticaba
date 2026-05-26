import { GroceryItemStorageService } from '@models/grocery-items/grocery-item.storage.service';
import Spy from './spy.spec';

export class GroceryItemsStorageServiceSpy extends Spy<GroceryItemStorageService> {
  protected override readonly token = GroceryItemStorageService;
  public create(): jasmine.SpyObj<GroceryItemStorageService> {
    this.spy = jasmine.createSpyObj(GroceryItemStorageService.name, [
      'save',
      'recover',
    ]) as jasmine.SpyObj<GroceryItemStorageService>;
    this.spy.recover.and.returnValue([]);
    return this.spy;
  }
}
