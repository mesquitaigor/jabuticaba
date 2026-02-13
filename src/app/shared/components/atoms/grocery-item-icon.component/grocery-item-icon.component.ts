import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'jbt-grocery-item-icon.component',
  templateUrl: './grocery-item-icon.component.html',
})
export class GroceryItemIconComponent {
  public readonly iconName = input('');
  public readonly iconSrc = computed(() => `icons/${this.iconName()}.svg`);
}
