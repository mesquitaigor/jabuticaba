import {
  Component,
  inject,
  signal,
  viewChild,
  AfterViewInit,
} from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { finalize } from 'rxjs';
import { MessageService } from 'primeng/api';
import { toObservable } from '@angular/core/rxjs-interop';
import { InputTextModule } from 'primeng/inputtext';
import GroceryItemModel from '../../../../data/entities/grocery-items/grocery-item.model';
import { GroceryItemIconComponent } from '../grocery-item-icon/grocery-item-icon.component';
import { GroceryItemRegistryDialogInput } from './grocery-item-registry.dialog.types';
import { GroceryItemService } from '@models/grocery-items';
import { DataTestId, DataTestidDirective } from '@directives/data-testid';
import { DialogService } from '@layout/dialog';
import { GroceryIconListSelectionDialog } from '../grocery-icon-list-selection/grocery-icon-list-selection.dialog';

@Component({
  selector: 'jbt-grocery-item-registry-dialog',
  imports: [
    DataTestidDirective,
    ReactiveFormsModule,
    ButtonModule,
    GroceryItemIconComponent,
    InputTextModule,
    GroceryIconListSelectionDialog,
  ],
  templateUrl: './grocery-item-registry.dialog.html',
})
export class GroceryItemRegistryDialog
  implements AfterViewInit, GroceryItemRegistryDialogInput
{
  private readonly messageService: MessageService = inject(MessageService);
  private readonly groceryItemService = inject(GroceryItemService);
  private readonly dialogService = inject(DialogService);
  public readonly item: GroceryItemModel | null = null;
  public readonly dialogComponent = viewChild(Dialog);
  public readonly testIds = DataTestId.GroceryItemRegistryDialog;
  public readonly executing = signal(false);
  public readonly saveButtonDisabledStt = signal(true);
  public readonly dialogHeader?: string;
  public readonly itemNameControl = new FormControl<string | null>(null, {
    updateOn: 'change',
  });
  constructor() {
    this.itemNameControl.valueChanges.subscribe(() => {
      this.setAddButtonDisabledState();
    });

    toObservable(this.executing).subscribe(() => {
      this.setAddButtonDisabledState();
    });
  }
  public ngAfterViewInit(): void {
    this.dialogComponent()?.onHide.subscribe(() => {
      this.resetState();
    });
    if (this.item) {
      this.itemNameControl.setValue(this.item.name || '');
    }
  }
  public openIconSelectionDialog(): void {
    this.dialogService.open<GroceryIconListSelectionDialog>({
      component: GroceryIconListSelectionDialog,
      header: 'Selecionar ícone',
      width: '90%',
    });
  }
  private setAddButtonDisabledState(): void {
    this.saveButtonDisabledStt.set(
      !this.itemNameControl.value?.trim().length || this.executing(),
    );
  }
  public exec(): void {
    if (!this.executing() && this.itemNameControl.value?.trim().length) {
      this.executing.set(true);
      this.groceryItemService
        .create(this.itemNameControl.value)
        .pipe(finalize(() => this.executing.set(false)))
        .subscribe({
          next: () => {
            this.resetState();
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
  public handleCancel(): void {
    this.resetState();
  }
  private resetState(): void {
    this.itemNameControl.reset();
    this.dialogService.close();
  }
}
