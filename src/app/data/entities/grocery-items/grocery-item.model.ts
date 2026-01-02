export default class GroceryItemModel {
  item_name?: string;
  missing = false;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  public constructor(public uuid?: string) {}
}
