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
import {
  GroceryItemIconModel,
  GroceryItemService,
} from '@models/grocery-items';
import { DataTestId, DataTestidDirective } from '@directives/data-testid';
import { dialogData, DialogRef, DialogService } from '@layout/dialog';
import {
  GroceryIconListSelectionDialog,
  GroceryIconListSelectionDialogData,
} from '../grocery-icon-list-selection/grocery-icon-list-selection.dialog';

@Component({
  selector: 'jbt-grocery-item-registry-dialog',
  imports: [
    DataTestidDirective,
    ReactiveFormsModule,
    ButtonModule,
    GroceryItemIconComponent,
    InputTextModule,
  ],
  templateUrl: './grocery-item-registry.dialog.html',
})
export class GroceryItemRegistryDialog
  implements
    DialogRef<GroceryItemRegistryDialogInput>,
    AfterViewInit,
    GroceryItemRegistryDialogInput
{
  private readonly messageService: MessageService = inject(MessageService);
  private readonly groceryItemService = inject(GroceryItemService);
  private readonly dialogService = inject(DialogService);
  public item: GroceryItemModel | null = null;
  public readonly dialogComponent = viewChild(Dialog);
  public readonly testIds = DataTestId.GroceryItemRegistryDialog;
  public readonly executing = signal(false);
  public readonly saveButtonDisabledStt = signal(true);
  public readonly dialogHeader?: string;
  public dialogData?: dialogData<GroceryItemRegistryDialogInput>;
  public readonly itemNameControl = new FormControl<string | null>(null, {
    updateOn: 'change',
  });
  public readonly selectedIcon = signal<GroceryItemIconModel | null>(
    GroceryItemIconModel.defaultIcon,
  );
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
    this.item = this.dialogData?.item || null;
    if (this.item) {
      this.itemNameControl.setValue(this.item.name || '');
      this.selectedIcon.set(this.item.icon || GroceryItemIconModel.defaultIcon);
    }
  }
  public openIconSelectionDialog(): void {
    this.dialogService.open<
      GroceryIconListSelectionDialog,
      GroceryIconListSelectionDialogData
    >({
      component: GroceryIconListSelectionDialog,
      header: 'Selecionar ícone',
      width: '90%',
      data: {
        selectedIcon: this.selectedIcon(),
      },
      onClose: (output) => {
        console.log(output);
      },
    });
  }
  private setAddButtonDisabledState(): void {
    this.saveButtonDisabledStt.set(
      !this.itemNameControl.value?.trim().length || this.executing(),
    );
  }
  public create(): void {
    if (this.itemNameControl.value) {
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
  public update(): void {
    if (this.itemNameControl.value && this.item) {
      this.item.name = this.itemNameControl.value;

      this.groceryItemService
        .editItem(this.item)
        .pipe(finalize(() => this.executing.set(false)))
        .subscribe({
          next: () => {
            this.resetState();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Não foi possível atualizar o item',
            });
          },
        });
    }
  }
  public exec(): void {
    if (!this.executing() && this.itemNameControl.value?.trim().length) {
      this.executing.set(true);
      if (!this.item) {
        this.create();
      } else {
        this.update();
      }
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
