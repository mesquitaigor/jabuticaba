import { GroceryItemService } from '@models/grocery-items';
import { of } from 'rxjs';
import Spy from './spy.spec';
import GroceryItemModel from '@models/grocery-items/grocery-item.model';
import { createGroceryItemModelMock } from '../mocks/GroceryItemModel.mock.spec';

export default class GroceryItemServiceSpy extends Spy<GroceryItemService> {
  protected override readonly token = GroceryItemService;
  public itemList: GroceryItemModel[] = [];
  public override create(): jasmine.SpyObj<GroceryItemService> {
    this.itemList = [];
    this.spy = jasmine.createSpyObj(GroceryItemService.name, [
      'getAll',
      'updateName',
      'updateMissing',
      'delete',
      'getList',
      'create',
    ]) as jasmine.SpyObj<GroceryItemService>;

    this.spy.getList.and.returnValue(this.itemList);
    this.spy.updateName.and.returnValue(of(null));
    this.spy.delete.and.returnValue(of(null));
    this.spy.getAll.and.returnValue(of([]));
    this.spy.create.and.returnValue(of(createGroceryItemModelMock()));
    this.spy.updateMissing.and.returnValue(of(createGroceryItemModelMock()));

    return this.spy;
  }
}
