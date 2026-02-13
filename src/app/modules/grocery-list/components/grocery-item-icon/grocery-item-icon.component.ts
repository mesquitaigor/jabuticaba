import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'jbt-grocery-item-icon',
  templateUrl: './grocery-item-icon.component.html',
  host: {
    '[class]': 'iconSizeClass() + " inline-block"',
  },
})
export class GroceryItemIconComponent {
  public readonly iconName = input<string | undefined | null>('default-icon');
  public readonly iconSize = input('10');
  public readonly iconSizeClass = computed(() => {
    return `w-${this.iconSize()} h-${this.iconSize()}`;
  });
  public readonly iconSrc = computed(
    () => `icons/${this.iconName() || 'default-icon'}.svg`,
  );
}
