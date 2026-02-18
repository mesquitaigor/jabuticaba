import { IGroceryItemApi } from '@models/grocery-items/grocery-item.dto';

export class GroceryItemApiResponseMock {
  public static readonly uuidTest = 'test-uuid-123';
  public static readonly nameTest = 'Test Item Name';
  public static create(): IGroceryItemApi {
    return {
      uuid: GroceryItemApiResponseMock.uuidTest,
      name: GroceryItemApiResponseMock.nameTest,
      missing: false,
      hidden: false,
      icon: 'default-icon',
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z',
      deleted_at: null,
    };
  }
}
