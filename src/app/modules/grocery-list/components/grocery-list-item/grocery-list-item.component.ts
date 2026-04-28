import { Component, effect, inject, input, signal } from '@angular/core';
import { DataTestId, DataTestidDirective } from '@directives/data-testid';
import { GroceryItemIconComponent } from '../grocery-item-icon/grocery-item-icon.component';
import { Menu, MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { TemplateGroceryItem } from '../../resources/template-grocery-item.model';
import { GroceryItemService } from '@models/grocery-items';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import TemplateGroceryItemMapper from '../../resources/template-grocery-item.mapper';
import { EmptyFn } from '@jbt-types/empty-fn';
import GroceryItemModel from '@models/grocery-items/grocery-item.model';
import { DialogService } from '@layout/dialog';
import { GroceryItemRegistryDialogInput } from '../grocery-item-registry/grocery-item-registry.dialog.types';
import { GroceryItemRegistryDialog } from '../grocery-item-registry/grocery-item-registry.dialog';

@Component({
  selector: 'jbt-grocery-list-item',
  imports: [
    CommonModule,
    DataTestidDirective,
    GroceryItemIconComponent,
    ButtonModule,
    MenuModule,
  ],
  templateUrl: './grocery-list-item.component.html',
  styleUrl: './grocery-list-item.component.scss',
})
export class GroceryListItemComponent {
  public readonly item = input.required<GroceryItemModel>();
  public readonly templateItem = signal<TemplateGroceryItem | null>(null);
  private readonly groceryItemService = inject(GroceryItemService);
  private readonly messageService = inject(MessageService);
  private readonly dialogService = inject(DialogService);
  public readonly testIds = DataTestId.GroceryListItemComponent;
  constructor() {
    effect(() => {
      const templateItem = TemplateGroceryItemMapper.toTemplateGroceryItem(
        this.item(),
        {
          onDelete: (stopState: EmptyFn): void => {
            this.deleteItem(this.item(), stopState);
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
        },
      );
      this.templateItem.set(templateItem);
    });
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
  public onShowPopover(event: Event, popover: Menu): void {
    event.stopPropagation();
    popover.toggle(event);
  }
  public onMissingCheck(item: TemplateGroceryItem): void {
    if (!item.changingMissing) {
      item.missing = !item.missing;
      item.changingMissing = true;
      this.changeMissing(item);
    }
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
}
