export enum GroceryItemIcons {
  Alvejante = 'alvejante',
  DefaultIcon = 'default-icon',
  Ketchup = 'ketchup',
  RiceSack = 'rice-sack',
  Picles = 'picles',
  Oleo = 'oleo',
}
export const iconDictionary = new Map<GroceryItemIcons, string>([
  [GroceryItemIcons.Alvejante, 'Alvejante'],
  [GroceryItemIcons.Ketchup, 'Ketchup'],
]);
export const getIconsList = (): GroceryItemIcons[] =>
  Object.values(GroceryItemIcons);
export class GroceryItemIconModel {
  public static readonly defaultIconName = 'default-icon';
  public name: string;
  public label?: string;
  public constructor(name?: string | null) {
    this.name = name || GroceryItemIconModel.defaultIconName;
    this.label = iconDictionary.get(this.name as GroceryItemIcons) || this.name;
  }
  public static get defaultIcon(): GroceryItemIconModel {
    return new GroceryItemIconModel(GroceryItemIconModel.defaultIconName);
  }
  public getSrc(): string {
    return `icons/grocery-items/${this.name || GroceryItemIconModel.defaultIconName}.svg`;
  }
}
