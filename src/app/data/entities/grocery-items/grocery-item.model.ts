export default class GroceryItemModel {
  public name?: string;
  public missing = false;
  public created_at?: Date;
  public updated_at?: Date;
  public deleted_at?: Date;
  public hidden?: boolean;
  public constructor(public uuid?: string) {}
}
