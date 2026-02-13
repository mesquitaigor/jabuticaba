import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { delay, finalize } from 'rxjs';
import { TemplateGroceryItem } from './resources/template-grocery-item.model';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { PopoverModule } from 'primeng/popover';
import {
  DataTestId,
  DataTestidDirective,
} from '../../shared/directives/data-testid';
import { Menu, MenuModule } from 'primeng/menu';
import GroceryItemModel from '../../data/entities/grocery-items/grocery-item.model';
import { LoadingComponent } from '../../shared/components/atoms/loading/loading.component';
import { GroceryItemIconComponent } from './components/grocery-item-icon/grocery-item-icon.component';
import { DialogService } from '../../core/layout/dialog/dialog.service';
import { GroceryItemRegistryDialog } from './components/grocery-item-registry-modal.component/grocery-item-registry.dialog';
import { GroceryItemRegistryDialogInput } from './components/grocery-item-registry-modal.component/grocery-item-registry.dialog.types';
import { GroceryItemService } from '@models/grocery-items';

@Component({
  selector: 'jbt-grocery-list',
  imports: [
    CommonModule,
    ButtonModule,
    CheckboxModule,
    FormsModule,
    InputTextModule,
    ToastModule,
    ReactiveFormsModule,
    DataTestidDirective,
    PopoverModule,
    MenuModule,
    LoadingComponent,
    GroceryItemIconComponent,
  ],
  templateUrl: './grocery-list.component.html',
  styleUrl: './grocery-list.component.scss',
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
      items
        .filter((item) => {
          const showAll = this.showAllItems();
          return showAll || !item.hidden;
        })
        .map((item) => {
          const groceryListItem = new TemplateGroceryItem();
          groceryListItem.parse({
            item,
            onDelete: (stopState: () => void): void => {
              this.deleteItem(item, stopState);
            },
            onChangeMissing: (
              item: TemplateGroceryItem,
              stopState: () => void,
            ): void => {
              this.changeMissing(item, stopState);
            },
            onEdit: (item: TemplateGroceryItem): void => {
              if (item.name) {
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
            },
            onChangeVisibility: (
              item: TemplateGroceryItem,
              stopState: () => void,
            ): void => {
              this.changeVisibility(item, stopState);
            },
          });
          return groceryListItem;
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

  public onMissingCheck(item: TemplateGroceryItem): void {
    if (!item.changingMissing) {
      item.missing = !item.missing;
      item.changingMissing = true;
      this.changeMissing(item);
    }
  }

  public onAdd(): void {
    this.dialogService.open({
      component: GroceryItemRegistryDialog,
      header: 'Cadastrar item',
      width: '90%',
    });
  }

  public onShowPopover(event: Event, popover: Menu): void {
    event.stopPropagation();
    popover.toggle(event);
  }
}
