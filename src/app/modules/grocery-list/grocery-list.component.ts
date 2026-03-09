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
import { GroceryItemRegistryDialogInput } from './components/grocery-item-registry/grocery-item-registry.dialog.types';
import { GroceryItemService } from '@models/grocery-items';
import { DataTestId, DataTestidDirective } from '@directives/data-testid';
import { DialogService } from '@layout/dialog';
import { LoadingComponent } from '@atoms/loading';
import { EmptyListStateComponent } from '@atoms/empty-list-state';
import { ErrorListStateComponent } from '@atoms/error-list-state';
import { GroceryListItemComponent } from './components/grocery-list-item/grocery-list-item.component';
import TemplateGroceryItemMapper from './resources/template-grocery-item.mapper';
import { EmptyFn } from '@jbt-types/empty-fn';

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
  public groceryItems = signal<TemplateGroceryItem[]>([]);
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

  private changeVisibility(item: TemplateGroceryItem, stop?: () => void): void {
    this.groceryItemService
      .updateHidden(item)
      .pipe(
        finalize(() => {
          if (stop) {
            stop();
          } else {
            item.changingVisibility = false;
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
          item.hidden = !item.hidden;
        },
      });
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

  public loadItems(): void {
    if (!this.loading) {
      this.loading = true;
      this.groceryItemService
        .getAll()
        .pipe(
          delay(this.loadDelay),
          //finalize(() => (this.loading = false)),
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
      items
        .filter((item) => {
          const showAll = this.showAllItems();
          return showAll || !item.hidden;
        })
        .map((item) => {
          return TemplateGroceryItemMapper.toTemplateGroceryItem(item, {
            onDelete: (stopState: EmptyFn): void => {
              this.deleteItem(item, stopState);
            },
            onChangeMissing: (
              item: TemplateGroceryItem,
              stopState: EmptyFn,
            ): void => {
              this.changeMissing(item, stopState);
            },
            onChangeVisibility: (
              item: TemplateGroceryItem,
              stopState: EmptyFn,
            ): void => {
              this.changeVisibility(item, stopState);
            },
            onEdit: (item: TemplateGroceryItem): void => {
              if (item.name) {
                this.openEditDialog(item);
              }
            },
          });
        }),
    );
  }

  private openEditDialog(item: TemplateGroceryItem): void {
    this.dialogService.open<
      GroceryItemRegistryDialog,
      GroceryItemRegistryDialogInput
    >({
      component: GroceryItemRegistryDialog,
      header: 'Editar item',
      width: '90%',
      data: { item },
    });
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
