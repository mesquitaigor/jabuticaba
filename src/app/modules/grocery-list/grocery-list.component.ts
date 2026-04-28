import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { delay, finalize } from 'rxjs';
import { TemplateGroceryItem } from './resources/template-grocery-item.model';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import GroceryItemModel from '../../data/entities/grocery-items/grocery-item.model';
import { GroceryItemRegistryDialog } from './components/grocery-item-registry/grocery-item-registry.dialog';
import { GroceryItemService } from '@models/grocery-items';
import { DataTestId, DataTestidDirective } from '@directives/data-testid';
import { DialogService } from '@layout/dialog';
import { LoadingComponent } from '@atoms/loading';
import { EmptyListStateComponent } from '@atoms/empty-list-state';
import { ErrorListStateComponent } from '@atoms/error-list-state';
import { GroceryListItemComponent } from './components/grocery-list-item/grocery-list-item.component';

@Component({
  selector: 'jbt-grocery-list',
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    ToastModule,
    DataTestidDirective,
    LoadingComponent,
    EmptyListStateComponent,
    ErrorListStateComponent,
    GroceryListItemComponent,
  ],
  templateUrl: './grocery-list.component.html',
  styleUrl: './grocery-list.component.scss',
  host: {
    class: 'w-full inline-block h-[100dvh]',
  },
})
export class GroceryListComponent implements OnInit {
  private readonly groceryItemService: GroceryItemService =
    inject(GroceryItemService);
  private readonly dialogService = inject(DialogService);
  private readonly messageService: MessageService = inject(MessageService);
  public groceryItems = signal<GroceryItemModel[]>([]);
  public hasError = false;
  public loading = false;
  public readonly testIds = DataTestId.GroceryList;
  public showAllItems = signal(false);
  private readonly loadDelay = 2000;
  constructor() {
    effect(() => {
      const items = this.groceryItemService.getGroceryList()();
      this.setListItems(items);
    });
  }

  ngOnInit(): void {
    this.groceryItemService.getGroceryList();
    this.loadItems();
  }

  public loadItems(): void {
    if (!this.loading) {
      this.loading = true;
      this.groceryItemService
        .getAll()
        .pipe(
          delay(this.loadDelay),
          finalize(() => (this.loading = false)),
        )
        .subscribe({
          error: () => {
            this.hasError = true;
          },
        });
    }
  }

  public onShowAllItems(): void {
    this.showAllItems.set(!this.showAllItems());
  }

  private setListItems(items: GroceryItemModel[]): void {
    this.groceryItems.set(
      items.filter((item) => {
        const showAll = this.showAllItems();
        return showAll || !item.hidden;
      }),
    );
  }

  public changeMissing(item: TemplateGroceryItem, stop?: () => void): void {
    this.groceryItemService
      .updateMissing(item)
      .pipe(
        finalize(() => {
          if (stop) {
            stop();
          } else {
            item.changingMissing = false;
          }
        }),
      )
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

  public onAdd(): void {
    this.dialogService.open({
      component: GroceryItemRegistryDialog,
      header: 'Cadastrar item',
      width: '90%',
    });
  }
}
