import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GroceryItemService } from '../../data/entities/grocery-items/grocery-item.service';
import { finalize } from 'rxjs';
import { GroceryListItem } from './resources/grocery-list-item.model';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { toObservable } from '@angular/core/rxjs-interop';
import { PopoverModule } from 'primeng/popover';
import {
  DataTestId,
  DataTestidDirective,
} from '../../shared/directives/data-testid';
import { Menu, MenuModule } from 'primeng/menu';
import GroceryItemModel from '../../data/entities/grocery-items/grocery-item.model';

@Component({
  selector: 'jbt-grocery-list',
  imports: [
    CommonModule,
    ButtonModule,
    CheckboxModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    ReactiveFormsModule,
    DataTestidDirective,
    PopoverModule,
    MenuModule,
  ],
  templateUrl: './grocery-list.component.html',
})
export class GroceryListComponent implements OnInit {
  private readonly groceryItemService: GroceryItemService =
    inject(GroceryItemService);
  private readonly messageService: MessageService = inject(MessageService);
  public groceryItems = signal<GroceryListItem[]>([]);
  public hasError = false;
  public loading = false;
  public showAddModal = false;
  public newItemName!: FormControl<string | null>;
  public readonly adding = signal(false);
  public readonly addButtonDisabledState = signal(true);
  public readonly testIds = DataTestId.GroceryList;
  constructor() {
    // Criar FormControl dentro do constructor
    this.newItemName = new FormControl('', { updateOn: 'change' });

    effect(() => {
      const items = this.groceryItemService.getGroceryList()();
      this.setListItems(items);
    });

    // Configurar valueChanges no constructor
    this.newItemName.valueChanges.subscribe(() => {
      this.setAddButtonDisabledState();
    });

    toObservable(this.adding).subscribe(() => {
      this.setAddButtonDisabledState();
    });
  }

  ngOnInit(): void {
    this.groceryItemService.getGroceryList();
    this.loadItems();
  }

  private deleteItem(item: GroceryItemModel, stopState: () => void): void {
    this.groceryItemService.delete(item.uuid!).subscribe({
      next: () => {
        stopState();
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Item excluído com sucesso',
        });
      },
      error: () => {
        stopState();
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível excluir o item',
        });
      },
    });
  }

  private setAddButtonDisabledState(): void {
    this.addButtonDisabledState.set(
      !this.newItemName.value?.trim().length || this.adding(),
    );
  }

  public loadItems(): void {
    if (!this.loading) {
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
  }

  private setListItems(items: GroceryItemModel[]): void {
    this.groceryItems.set(
      items.map((item) => {
        const groceryListItem = new GroceryListItem();
        groceryListItem.onDelete = (stopState: () => void): void =>
          this.deleteItem(item, stopState);
        return Object.assign(groceryListItem, item);
      }),
    );
  }

  public onMissingCheck(item: GroceryListItem): void {
    if (!item.changingMissing) {
      item.missing = !item.missing;
      item.changingMissing = true;
      this.groceryItemService
        .updateMissing(item)
        .pipe(finalize(() => (item.changingMissing = false)))
        .subscribe({
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Não foi possível atualizar o item',
            });
            item.missing = !item.missing;
          },
        });
    }
  }

  public onAdd(): void {
    this.showAddModal = true;
  }

  public saveNewItem(): void {
    if (!this.adding() && this.newItemName.value?.trim().length) {
      this.adding.set(true);
      this.groceryItemService
        .create(this.newItemName.value)
        .pipe(finalize(() => this.adding.set(false)))
        .subscribe({
          next: () => {
            this.newItemName.setValue('');
            this.showAddModal = false;
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Não foi possível adicionar o item',
            });
          },
        });
    }
  }

  public onShowPopover(event: Event, popover: Menu): void {
    event.stopPropagation();
    popover.toggle(event);
  }
}
