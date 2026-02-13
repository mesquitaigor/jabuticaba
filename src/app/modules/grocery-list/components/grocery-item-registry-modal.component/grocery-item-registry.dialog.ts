import {
  Component,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
  AfterViewInit,
  computed,
} from '@angular/core';
import { Dialog } from 'primeng/dialog';
import {
  DataTestId,
  DataTestidDirective,
} from '../../../../shared/directives/data-testid';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { finalize } from 'rxjs';
import { GroceryItemService } from '../../../../data/entities/grocery-items/grocery-item.service';
import { MessageService } from 'primeng/api';
import { toObservable } from '@angular/core/rxjs-interop';
import { InputTextModule } from 'primeng/inputtext';
import GroceryItemModel from '../../../../data/entities/grocery-items/grocery-item.model';
import { GroceryItemIconComponent } from '../grocery-item-icon/grocery-item-icon.component';

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
export class GroceryItemRegistryModalDialog implements AfterViewInit {
  private readonly messageService: MessageService = inject(MessageService);
  private readonly groceryItemService = inject(GroceryItemService);
  public readonly showDialog = input(false);
  public readonly item = input<GroceryItemModel | null>(null);
  public readonly hidded = output<void>();
  public readonly dialogComponent = viewChild(Dialog);
  public showDialogFlag = false;
  public readonly testIds = DataTestId.GroceryItemRegistryDialog;
  public readonly executing = signal(false);
  public readonly saveButtonDisabledStt = signal(true);
  public readonly dialogHeader = computed(() =>
    this.item() ? 'Editar Item' : 'Adicionar Item',
  );
  public readonly itemNameControl = new FormControl<string | null>(null, {
    updateOn: 'change',
  });
  constructor() {
    effect(() => {
      this.showDialogFlag = this.showDialog();
    });
    effect(() => {
      const item = this.item();
      if (item) {
        this.itemNameControl.setValue(item.name || '');
      }
    });
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
    this.hidded.emit();
    this.showDialogFlag = false;
  }
}
