export enum GroceryItemIcons {
  Alvejante = 'alvejante',
  DefaultIcon = 'default-icon',
  Ketchup = 'ketchup',
  Avocado = 'avocado',
  Pote = 'pote',
  RiceSack = 'rice-sack',
  Picles = 'picles',
  Oleo = 'oleo',
}
export const iconDictionary = new Map<GroceryItemIcons, string>([
  [GroceryItemIcons.Avocado, 'Avocado'],
  [GroceryItemIcons.Pote, 'Pote'],
]);
export const getIconsList = (): GroceryItemIcons[] =>
  Object.values(GroceryItemIcons);
export class GroceryItemIconModel {
  public static readonly defaultIconName = 'default-icon';
  public name: string;
  public description?: string;
  public constructor(name?: string | null) {
    this.name = name || GroceryItemIconModel.defaultIconName;
    this.description =
      iconDictionary.get(this.name as GroceryItemIcons) || this.name;
  }
  public static get defaultIcon(): GroceryItemIconModel {
    return new GroceryItemIconModel(GroceryItemIconModel.defaultIconName);
  }
  public getSrc(): string {
    return `icons/grocery-items/${this.name || GroceryItemIconModel.defaultIconName}.svg`;
  }
}
