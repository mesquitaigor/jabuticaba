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
import { MenuItem, MessageService } from 'primeng/api';
import { toObservable } from '@angular/core/rxjs-interop';
import { PopoverModule } from 'primeng/popover';
import {
  DataTestId,
  DataTestidDirective,
} from '../../shared/directives/data-testid';
import { Menu, MenuModule } from 'primeng/menu';

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
  public items: MenuItem[] | undefined;
  constructor() {
    // Criar FormControl dentro do constructor
    this.newItemName = new FormControl('', { updateOn: 'change' });

    effect(() => {
      const items = this.groceryItemService.getGroceryList()();
      this.groceryItems.set(
        items.map((item) => {
          const groceryListItem = new GroceryListItem();
          return Object.assign(groceryListItem, item);
        }),
      );
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
    this.items = [
      { label: 'Editar', icon: 'pi pi-pencil' },
      { label: 'Esconder', icon: 'pi pi-eye' },
      { label: 'Marcar', icon: 'pi pi-check' },
      {
        label: 'Excluir',
        icon: 'pi pi-trash',
        styleClass: 'warning',
      },
    ];
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

  public onEdit(): void {
    console.log('Edit clicked');
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
