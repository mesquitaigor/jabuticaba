import { Component, signal, Signal } from '@angular/core';
import { GroceryItemIconComponent } from '../grocery-item-icon/grocery-item-icon.component';
import { ButtonModule } from 'primeng/button';
import { DataTestId, DataTestidDirective } from '@directives/data-testid';

@Component({
  selector: 'jbt-grocery-icon-list-selection',
  templateUrl: './grocery-icon-list-selection.dialog.html',
  imports: [GroceryItemIconComponent, ButtonModule, DataTestidDirective],
})
export class GroceryIconListSelectionDialog {
  public readonly testIds = DataTestId.GroceryIconListSelectionDialog;
  public readonly saving = signal(false);
  public readonly icons: Signal<string[]> = signal([
    'alvejante',
    'default-icon',
    'ketchup',
    'rice-sack',
    'picles',
    'oleo',
    'azeite',
  ]);
  public readonly selectedIcon: Signal<string | null> = signal('default-icon');
  public readonly saveButtonDisabledStt = signal(true);
  public save(): void {
    console.log('oi');
  }
  public handleCancel(): void {
    console.log('cancelar');
  }
}
