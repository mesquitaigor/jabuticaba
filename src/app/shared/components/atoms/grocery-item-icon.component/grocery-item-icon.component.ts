import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'jbt-grocery-item-icon',
  templateUrl: './grocery-item-icon.component.html',
})
export class GroceryItemIconComponent {
  public readonly iconName = input('');
  public readonly iconSize = input(10);
  public readonly iconSizeClass = computed(() => {
    return `w-${this.iconSize()} h-${this.iconSize()}`;
  });
  public readonly iconSrc = computed(() => `icons/${this.iconName()}.svg`);
}
