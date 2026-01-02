import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { GroceryItemService } from './data/entities/grocery-items/grocery-item.service';
import { SupabaseService } from './core/services/api/supabase.service';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import GroceryItemModel from './data/entities/grocery-items/grocery-item.model';
import { OnRenderDirective } from './shared/directives/on-render.directive';

interface GroceryTemplateItem {
  data: GroceryItemModel;
  editing: boolean;
  initialValue: string;
  inputRef?: HTMLInputElement;
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ButtonModule,
    InputTextModule,
    FormsModule,
    OnRenderDirective,
  ],
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
  public handleGetInputElement(
    event: HTMLElement,
    item: GroceryTemplateItem,
  ): void {
    event.focus();
    item.inputRef = event as HTMLInputElement;
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
  public handleEditItem(item: GroceryTemplateItem): void {
    item.editing = true;
    item.initialValue = item.data.name || '';
  }
  public handleFinalizeEditionItem(item: GroceryTemplateItem): void {
    if (item.editing && item.initialValue !== (item.inputRef?.value || '')) {
      item.editing = false;
      item.data.name = item.inputRef?.value || '';
      this.groceryItemService.update(item.data).subscribe(() => {
        item.initialValue = item.data.name || '';
      });
    }
  }
  public handleDeleteItem(uuid: string): void {
    this.groceryItemService.delete(uuid).subscribe(() => {
      const updatedList = this.itemsList().filter(
        (item) => item.data.uuid !== uuid,
      );
      this.itemsList.set(updatedList);
    });
  }
}
