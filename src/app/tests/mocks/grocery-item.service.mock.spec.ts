import { GroceryItemService } from '@models/grocery-items';
import { of } from 'rxjs';

export const createGroceryItemServiceMock =
  (): jasmine.SpyObj<GroceryItemService> => {
    const mockGroceryItemService = jasmine.createSpyObj(
      GroceryItemService.name,
      ['getAll', 'updateName', 'updateMissing', 'delete'],
    );

    mockGroceryItemService.getAll.and.returnValue(of([]));
    mockGroceryItemService.updateName.and.returnValue(of(null));
    mockGroceryItemService.updateMissing.and.returnValue(of(null));
    mockGroceryItemService.delete.and.returnValue(of(null));
    return mockGroceryItemService;
  };
