import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { GroceryItemService } from './data/entities/grocery-items/grocery-item.service';
import { SupabaseService } from './core/services/api/supabase.service';
import {
  GroceryItemBoxComponent,
  GroceryTemplateItem,
} from './shared/components/molecules/grocery-item-box/grocery-item-box.component';
import { FormsModule } from '@angular/forms';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, FormsModule, GroceryItemBoxComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent implements OnInit {
  private readonly groceryItemService: GroceryItemService =
    inject(GroceryItemService);
  private readonly supabaseService = inject(SupabaseService);
  public itemName = '';
  public itemsList = signal<GroceryTemplateItem[]>([]);
  ngOnInit(): void {
    this.supabaseService.init();
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
  public handleCreateNote(): void {
    this.groceryItemService.create(this.itemName).subscribe((data) => {
      const groceryItemList = this.itemsList();
      if (data) {
        groceryItemList.push({
          data,
          editing: false,
          initialValue: data.name || '',
        });
        this.itemsList.set(groceryItemList);
        this.itemName = '';
      }
    });
  }
}
