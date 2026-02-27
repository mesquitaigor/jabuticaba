import GroceryItemModel from '@models/grocery-items/grocery-item.model';
import { TemplateGroceryItem } from './template-grocery-item.model';
import { EmptyFn } from '@jbt-types/empty-fn';
export interface TemplateGroceryItemMapperCallbacks {
  onDelete?: (stopState: EmptyFn) => void;
  onEdit?: (item: TemplateGroceryItem) => void;
  onChangeVisibility?: (item: TemplateGroceryItem, stopState: EmptyFn) => void;
  onChangeMissing?: (item: TemplateGroceryItem, stopState: EmptyFn) => void;
}
export default class TemplateGroceryItemMapper {
  public static toTemplateGroceryItem(
    item: GroceryItemModel,
    cb: TemplateGroceryItemMapperCallbacks,
  ): TemplateGroceryItem {
    const groceryListItem = new TemplateGroceryItem();
    groceryListItem.parse({
      item,
      onDelete: (stopState: EmptyFn): void => {
        cb.onDelete?.(stopState);
      },
      onChangeMissing: (
        item: TemplateGroceryItem,
        stopState: EmptyFn,
      ): void => {
        cb.onChangeMissing?.(item, stopState);
      },
      onEdit: (item: TemplateGroceryItem): void => {
        cb.onEdit?.(item);
      },
      onChangeVisibility: (
        item: TemplateGroceryItem,
        stopState: EmptyFn,
      ): void => {
        cb.onChangeVisibility?.(item, stopState);
      },
    });
    return groceryListItem;
  }
}
