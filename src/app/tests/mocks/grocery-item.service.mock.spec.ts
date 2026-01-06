import { of } from 'rxjs';
import { GroceryItemService } from '../../data/entities/grocery-items/grocery-item.service';

export const createGroceryItemServiceMock =
  (): jasmine.SpyObj<GroceryItemService> => {
    const mockGroceryItemService = jasmine.createSpyObj(
      GroceryItemService.name,
      ['updateName', 'updateMissing', 'delete'],
    );

    mockGroceryItemService.updateName.and.returnValue(of(null));
    mockGroceryItemService.updateMissing.and.returnValue(of(null));
    mockGroceryItemService.delete.and.returnValue(of(null));
    return mockGroceryItemService;
  };
