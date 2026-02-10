import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { GroceryItemService } from '../../data/entities/grocery-items/grocery-item.service';
import GroceryItemModel from '../../data/entities/grocery-items/grocery-item.model';
import { finalize } from 'rxjs';
import { GroceryListItem } from './resources/grocery-list-item.model';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'jbt-grocery-list',
  imports: [
    CommonModule,
    ButtonModule,
    CheckboxModule,
    FormsModule,
    DialogModule,
    InputTextModule,
  ],
  templateUrl: './grocery-list.component.html',
})
export class GroceryListComponent implements OnInit {
  private readonly groceryItemService: GroceryItemService =
    inject(GroceryItemService);
  public groceryItems = signal<GroceryListItem[]>([]);
  public hasError = false;
  public loading = false;
  public showAddModal = false;
  public newItemName = '';

  constructor() {
    effect(() => {
      const items = this.groceryItemService.getGroceryList()();
      this.groceryItems.set(
        items.map((item) => {
          const groceryListItem = new GroceryListItem();
          return Object.assign(groceryListItem, item);
        }),
      );
    });
  }

  ngOnInit(): void {
    this.groceryItemService.getGroceryList();
    this.loadItems();
  }

  public loadItems(): void {
    this.loading = true;
    this.groceryItemService
      .getAll()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        error: () => {
          this.hasError = true;
        },
      });
  }

  public onEdit(): void {
    console.log('Edit clicked');
  }

  public onAdd(): void {
    this.showAddModal = true;
  }

  public saveNewItem(): void {
    console.log('sabe');
  }

  public onItemCheckChange(item: GroceryItemModel): void {
    console.log(`Item ${item.name} checked: ${item.missing}`);
  }
}
