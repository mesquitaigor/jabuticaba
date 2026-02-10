import { Component, inject, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { GroceryItemService } from '../../data/entities/grocery-items/grocery-item.service';
import GroceryItemModel from '../../data/entities/grocery-items/grocery-item.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'jbt-grocery-list',
  imports: [CommonModule, ButtonModule, CheckboxModule, FormsModule],
  templateUrl: './grocery-list.component.html',
})
export class GroceryListComponent implements OnInit {
  private readonly groceryItemService: GroceryItemService =
    inject(GroceryItemService);
  public groceryItems: Signal<GroceryItemModel[]> =
    this.groceryItemService.getGroceryList();
  public hasError = false;
  public loading = false;

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
    console.log('Add clicked');
  }

  public onItemCheckChange(item: GroceryItemModel): void {
    console.log(`Item ${item.name} checked: ${item.missing}`);
  }
}
