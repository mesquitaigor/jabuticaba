import {
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { OnRenderDirective } from '../../../directives/on-render.directive';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import GroceryItemModel from '../../../../data/entities/grocery-items/grocery-item.model';
import { GroceryItemService } from '../../../../data/entities/grocery-items/grocery-item.service';

export interface GroceryTemplateItem {
  data: GroceryItemModel;
  editing: boolean;
  initialValue: string;
}

@Component({
  selector: 'jbt-grocery-item-box',
  imports: [
    OnRenderDirective,
    CheckboxModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
  ],
  templateUrl: './grocery-item-box.component.html',
  styleUrl: './grocery-item-box.component.scss',
  standalone: true,
})
export class GroceryItemBoxComponent {
  public item = input<GroceryItemModel>();
  public deletedItem = output<GroceryItemModel>();
  public groceryItem = signal<GroceryTemplateItem | null>(null);
  private readonly groceryItemService: GroceryItemService =
    inject(GroceryItemService);
  constructor() {
    effect(() => {
      const currentItem = this.item();
      if (currentItem) {
        this.groceryItem.set({
          data: currentItem,
          editing: false,
          initialValue: currentItem.name || '',
        });
      }
    });
  }
  public handleChangeMissingItem(item: GroceryTemplateItem): void {
    this.groceryItemService.updateMissing(item.data).subscribe();
  }
  public handleEditItem(item: GroceryTemplateItem): void {
    item.editing = true;
    item.initialValue = item.data.name || '';
  }
  public handleGetInputElement(event: HTMLElement): void {
    event.focus();
  }
  public handleFinalizeEditionItem(item: GroceryTemplateItem): void {
    if (item.editing && item.initialValue !== item.data.name) {
      item.editing = false;
      this.groceryItemService.updateName(item.data).subscribe(() => {
        item.initialValue = item.data.name || '';
      });
    }
  }
  public handleDeleteItem(uuid: string): void {
    this.groceryItemService.delete(uuid).subscribe(() => {
      const groceryItem = this.groceryItem();
      if (groceryItem) {
        this.deletedItem.emit(groceryItem.data);
      }
    });
  }
}
