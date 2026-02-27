import { GroceryItemService } from '@models/grocery-items';
import { of } from 'rxjs';
import Mocker from './mocker.spec';
import { createGroceryItemModelMock } from './GroceryItemModel.mock.spec';
import { signal } from '@angular/core';
import GroceryItemModel from '@models/grocery-items/grocery-item.model';

export default class GroceryItemServiceMocker extends Mocker<GroceryItemService> {
  protected override readonly token = GroceryItemService;
  public mockSignal = signal<GroceryItemModel[]>([]);
  public override create(): jasmine.SpyObj<GroceryItemService> {
    this.mockSignal = signal<GroceryItemModel[]>([]);
    this.spy = jasmine.createSpyObj(GroceryItemService.name, [
      'getAll',
      'updateName',
      'updateMissing',
      'delete',
      'getGroceryList',
      'create',
    ]) as jasmine.SpyObj<GroceryItemService>;

    this.spy.getGroceryList.and.returnValue(this.mockSignal);
    this.spy.updateName.and.returnValue(of(null));
    this.spy.delete.and.returnValue(of(null));
    this.spy.getAll.and.returnValue(of([]));
    this.spy.create.and.returnValue(of(createGroceryItemModelMock()));
    this.spy.updateMissing.and.returnValue(of(createGroceryItemModelMock()));

    return this.spy;
  }
}
