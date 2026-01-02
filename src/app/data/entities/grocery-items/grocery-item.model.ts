export default class GroceryItemModel {
  name?: string;
  missing = false;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  public constructor(public uuid?: string) {}
}
