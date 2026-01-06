import { Component, inject, input, output } from '@angular/core';
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
  inputRef?: HTMLInputElement;
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
  public item = input<GroceryTemplateItem>();
  public deletedItem = output<GroceryTemplateItem>();
  private readonly groceryItemService: GroceryItemService =
    inject(GroceryItemService);
  public handleChangeMissingItem(item: GroceryTemplateItem): void {
    this.groceryItemService.updateMissing(item.data).subscribe();
  }
  public handleEditItem(item: GroceryTemplateItem): void {
    item.editing = true;
    item.initialValue = item.data.name || '';
  }
  public handleGetInputElement(
    event: HTMLElement,
    item: GroceryTemplateItem,
  ): void {
    event.focus();
    item.inputRef = event as HTMLInputElement;
  }
  public handleFinalizeEditionItem(item: GroceryTemplateItem): void {
    if (item.editing && item.initialValue !== (item.inputRef?.value || '')) {
      item.editing = false;
      item.data.name = item.inputRef?.value || '';
      this.groceryItemService.updateName(item.data).subscribe(() => {
        item.initialValue = item.data.name || '';
      });
    }
  }
  public handleDeleteItem(uuid: string): void {
    this.groceryItemService.delete(uuid).subscribe(() => {
      this.deletedItem.emit(this.item()!);
      // const updatedList = this.itemsList().filter(
      //   (item) => item.data.uuid !== uuid,
      // );
      // this.itemsList.set(updatedList);
    });
  }
}
