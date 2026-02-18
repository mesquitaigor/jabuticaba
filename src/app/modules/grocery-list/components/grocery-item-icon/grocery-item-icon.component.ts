import { Component, computed, input } from '@angular/core';
import GroceryItemModel from '../../../../data/entities/grocery-items/grocery-item.model';

@Component({
  selector: 'jbt-grocery-item-icon',
  templateUrl: './grocery-item-icon.component.html',
  host: {
    '[class]': 'iconSizeClass() + " inline-block"',
  },
})
export class GroceryItemIconComponent {
  public readonly iconName = input<string | undefined | null>(
    GroceryItemModel.defaultIconName,
  );
  public readonly iconSize = input('10');
  public readonly iconSizeClass = computed(() => {
    return `w-${this.iconSize()} h-${this.iconSize()}`;
  });
  public readonly iconSrc = computed(
    () =>
      `icons/grocery-items/${this.iconName() || GroceryItemModel.defaultIconName}.svg`,
  );
}
