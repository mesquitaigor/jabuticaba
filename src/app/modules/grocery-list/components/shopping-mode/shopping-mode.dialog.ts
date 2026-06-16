import { Component, inject, signal, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import GroceryItemModel from '../../../../data/entities/grocery-items/grocery-item.model';
import { GroceryItemIconComponent } from '../grocery-item-icon/grocery-item-icon.component';
import { ShoppingModeDialogInput } from './shopping-mode.dialog.types';
import { GroceryItemService } from '@models/grocery-items';
import { dialogData, DialogRef, DialogService } from '@layout/dialog';

@Component({
  selector: 'jbt-shopping-mode-dialog',
  imports: [ButtonModule, GroceryItemIconComponent],
  templateUrl: './shopping-mode.dialog.html',
})
export class ShoppingModeDialog
  implements DialogRef<ShoppingModeDialogInput>, OnInit, ShoppingModeDialogInput
{
  private readonly groceryItemService = inject(GroceryItemService);
  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);

  public items: GroceryItemModel[] = [];
  public dialogData?: dialogData<ShoppingModeDialogInput>;

  public readonly checkedItems = signal<Set<string>>(new Set());

  public ngOnInit(): void {
    this.items = [...(this.dialogData?.items ?? [])];
    const alreadyChecked = new Set(
      this.items
        .filter((item) => item.missing && item.uuid)
        .map((item) => item.uuid!),
    );
    this.checkedItems.set(alreadyChecked);
  }

  public isChecked(uuid: string | undefined): boolean {
    return !!uuid && this.checkedItems().has(uuid);
  }

  public onCheck(item: GroceryItemModel): void {
    const { uuid } = item;
    if (!uuid) return;
    this.toggleChecked(uuid, !this.isChecked(uuid));
  }

  public confirm(): void {
    const checked = this.checkedItems();
    const changedItems = this.items.filter(
      (item) => item.uuid && checked.has(item.uuid) !== item.missing,
    );

    if (changedItems.length === 0) {
      this.dialogService.close();
      return;
    }

    changedItems.forEach((item) => {
      item.missing = checked.has(item.uuid!);
    });

    const requests = changedItems.map((item) =>
      this.groceryItemService.updateMissing(item).pipe(
        catchError(() => {
          item.missing = !item.missing;
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível atualizar o item',
          });
          return of(null);
        }),
      ),
    );

    forkJoin(requests)
      .pipe(finalize(() => this.dialogService.close()))
      .subscribe();
  }

  private toggleChecked(uuid: string, checked: boolean): void {
    const set = new Set(this.checkedItems());
    if (checked) {
      set.add(uuid);
    } else {
      set.delete(uuid);
    }
    this.checkedItems.set(set);
  }
}
