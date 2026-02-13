import { IGroceryItemApi } from './grocery-item.dto';
import GroceryItem from './grocery-item.model';

export default class GroceryItemMapper {
  public static apiToModel(data: IGroceryItemApi): GroceryItem {
    const groceryItem = new GroceryItem(data.uuid);
    groceryItem.name = data.name;
    groceryItem.missing = data.missing;
    groceryItem.created_at = new Date(data.created_at);
    groceryItem.updated_at = new Date(data.updated_at);
    groceryItem.hidden = data.hidden;
    groceryItem.icon = data.icon || 'default-icon';
    groceryItem.deleted_at = data.deleted_at
      ? new Date(data.deleted_at)
      : undefined;
    return groceryItem;
  }
}
