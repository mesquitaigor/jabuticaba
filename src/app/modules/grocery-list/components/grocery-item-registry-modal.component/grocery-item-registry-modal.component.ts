import { Component, effect, inject, input, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
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

@Component({
  selector: 'jbt-grocery-item-registry-modal',
  imports: [
    DialogModule,
    DataTestidDirective,
    ReactiveFormsModule,
    ButtonModule,
  ],
  templateUrl: './grocery-item-registry-modal.component.html',
})
export class GroceryItemRegistryModalComponent {
  private readonly messageService: MessageService = inject(MessageService);
  private readonly groceryItemService = inject(GroceryItemService);
  public readonly showDialog = input(false);
  public showDialogFlag = false;
  public readonly testIds = DataTestId.GroceryList;
  public readonly executing = signal(false);
  public readonly saveButtonDisabledStt = signal(true);
  public readonly itemNameControl = new FormControl<string | null>(null, {
    updateOn: 'change',
  });
  constructor() {
    effect(() => {
      this.showDialogFlag = this.showDialog();
    });
    this.itemNameControl.valueChanges.subscribe(() => {
      this.setAddButtonDisabledState();
    });

    toObservable(this.executing).subscribe(() => {
      this.setAddButtonDisabledState();
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
            this.itemNameControl.setValue('');
            this.showDialogFlag = false;
          },
          error: () => {
            console.log(this.messageService);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Não foi possível adicionar o item',
            });
          },
        });
    }
  }
}
