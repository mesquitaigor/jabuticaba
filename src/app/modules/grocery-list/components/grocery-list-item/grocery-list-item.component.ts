import { Component, inject, input } from '@angular/core';
import { DataTestId, DataTestidDirective } from '@directives/data-testid';
import { GroceryItemIconComponent } from '../grocery-item-icon/grocery-item-icon.component';
import { Menu, MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { TemplateGroceryItem } from '../../resources/template-grocery-item.model';
import { GroceryItemService } from '@models/grocery-items';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';

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
  public readonly item = input.required<TemplateGroceryItem>();
  private readonly groceryItemService = inject(GroceryItemService);
  private readonly messageService = inject(MessageService);
  public readonly testIds = DataTestId.GroceryListItemComponent;
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
