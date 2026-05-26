import { GroceryItemsStorageService } from '@models/grocery-items/grocery-items.storage.service';
import Spy from './spy.spec';

export class GroceryItemsStorageServiceSpy extends Spy<GroceryItemsStorageService> {
  protected override readonly token = GroceryItemsStorageService;
  public create(): jasmine.SpyObj<GroceryItemsStorageService> {
    this.spy = jasmine.createSpyObj(GroceryItemsStorageService.name, [
      'save',
    ]) as jasmine.SpyObj<GroceryItemsStorageService>;
    return this.spy;
  }
}
