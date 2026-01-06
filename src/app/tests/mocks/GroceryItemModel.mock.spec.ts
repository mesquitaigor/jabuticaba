import GroceryItemModel from '../../data/entities/grocery-items/grocery-item.model';
export const uuidTestValue = 'test-uuid-123';
export const nameTestValue = 'Test Item Name';
export const createGroceryItemModelMock = (
  overrides: Partial<GroceryItemModel> = {},
): GroceryItemModel => {
  const mockGroceryItemModel = new GroceryItemModel(uuidTestValue);
  mockGroceryItemModel.name = nameTestValue;
  mockGroceryItemModel.missing = false;
  return { ...mockGroceryItemModel, ...overrides };
};
