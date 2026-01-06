import { Component, inject, input, OnInit, signal } from '@angular/core';
import {
  GroceryItemBoxComponent,
  GroceryTemplateItem,
} from '../../molecules/grocery-item-box/grocery-item-box.component';
import GroceryItemModel from '../../../../data/entities/grocery-items/grocery-item.model';
import { GroceryItemService } from '../../../../data/entities/grocery-items/grocery-item.service';

@Component({
  selector: 'jbt-grocery-items-list',
  imports: [GroceryItemBoxComponent],
  templateUrl: './grocery-items-list.component.html',
  styleUrl: './grocery-items-list.component.scss',
})
export class GroceryItemsListComponent implements OnInit {
  private readonly groceryItemService: GroceryItemService =
    inject(GroceryItemService);
  public predefinedMissingValue = input<boolean | null>(null);
  public itemsList = signal<GroceryTemplateItem[]>([]);
  public ngOnInit(): void {
    this.groceryItemService.getAll().subscribe((data) => {
      this.itemsList.set(
        data.map((item) => ({
          data: item,
          editing: false,
          initialValue: item.name || '',
        })) ?? [],
      );
    });
  }
  public handleDeletedItem(groceryItem: GroceryTemplateItem): void {
    const updatedList = this.itemsList().filter(
      (itemList) => itemList.data.uuid !== groceryItem.data.uuid,
    );
    this.itemsList.set(updatedList);
  }
  public addToList(groceryItem: GroceryItemModel): void {
    const groceryItemList = this.itemsList();
    groceryItemList.push({
      data: groceryItem,
      editing: false,
      initialValue: groceryItem.name || '',
    });
    this.itemsList.set(groceryItemList);
  }
}
