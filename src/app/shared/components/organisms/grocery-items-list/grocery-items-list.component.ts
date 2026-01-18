import { Component, inject, input, OnInit, signal } from '@angular/core';
import { GroceryTemplateItem } from '../../molecules/grocery-item-box/grocery-item-box.component';
import GroceryItemModel from '../../../../data/entities/grocery-items/grocery-item.model';
import { GroceryItemService } from '../../../../data/entities/grocery-items/grocery-item.service';
import { GroceryItemBoxCardComponent } from '../../molecules/grocery-item-box-card/grocery-item-box-card.component';

@Component({
  selector: 'jbt-grocery-items-list',
  imports: [GroceryItemBoxCardComponent],
  templateUrl: './grocery-items-list.component.html',
  styleUrl: './grocery-items-list.component.scss',
  host: { class: 'flex flex-wrap gap-4 p-4' },
})
export class GroceryItemsListComponent implements OnInit {
  private readonly groceryItemService: GroceryItemService =
    inject(GroceryItemService);
  public ableNameEdit = input<boolean>(true);
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

  public handleToggleMissing(groceryItem: GroceryItemModel): void {
    // Se saveMissingChanges está habilitado, salva no serviço
    if (this.saveMissingChanges()) {
      this.groceryItemService.updateMissing(groceryItem).subscribe();
    }

    // Atualiza a lista local para garantir que a mudança seja refletida
    const updatedList = this.itemsList().map((item) => {
      if (item.data.uuid === groceryItem.uuid) {
        return {
          ...item,
          data: { ...groceryItem },
        };
      }
      return item;
    });
    this.itemsList.set(updatedList);
  }
}
