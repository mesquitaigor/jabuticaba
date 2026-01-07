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
  public predefinedMissingCheckboxValue = input<boolean | null>(null);
  public filterList = input<(list: GroceryItemModel[]) => GroceryItemModel[]>();
  public saveMissingChanges = input<boolean>(true);
  public itemsList = signal<GroceryTemplateItem[]>([]);
  public ngOnInit(): void {
    this.groceryItemService.getAll().subscribe((data) => {
      const filter = this.filterList();
      if (filter) {
        data = filter(data);
      }
      const list = data.map((item) => ({
        data: item,
        editing: false,
        initialValue: item.name || '',
      }));
      this.itemsList.set(list ?? []);
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
