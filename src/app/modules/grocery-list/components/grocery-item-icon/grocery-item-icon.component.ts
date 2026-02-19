import { Component, computed, input } from '@angular/core';
import { GroceryItemIconModel } from '@models/grocery-items';

@Component({
  selector: 'jbt-grocery-item-icon',
  templateUrl: './grocery-item-icon.component.html',
  host: {
    '[class]': 'iconSizeClass() + " inline-block"',
  },
})
export class GroceryItemIconComponent {
  public readonly iconName = input<GroceryItemIconModel | undefined | null>(
    new GroceryItemIconModel(),
  );
  public readonly iconSize = input('10');
  public readonly iconSizeClass = computed(() => {
    return `w-${this.iconSize()} h-${this.iconSize()}`;
  });
  public readonly iconSrc = computed(() => this.iconName()?.getSrc() || '');
}
