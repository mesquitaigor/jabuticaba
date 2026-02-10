import { MenuItem } from 'primeng/api';
import GroceryItemModel from '../../../data/entities/grocery-items/grocery-item.model';
import { signal } from '@angular/core';

export class GroceryListItem extends GroceryItemModel {
  public adding = false;
  public changingMissing = false;
  public deleting = false;
  public onDelete?: (stopState: () => void) => void;
  public onMissingCheck?: (item: GroceryListItem) => void;
  public readonly menu = signal<MenuItem[]>([
    { label: 'Editar', icon: 'pi pi-pencil' },
    { label: 'Esconder', icon: 'pi pi-eye' },
    {
      label: 'Marcar',
      icon: 'pi pi-check',
      command: (): void => this.onMissingCheck?.(this),
    },
    {
      label: 'Excluir',
      icon: 'pi pi-trash',
      disabled: this.deleting,
      styleClass: 'warning',
      command: (): void => {
        if (this.onDelete) {
          const menu = this.menu();
          menu[3].disabled = true;
          this.menu.set(menu);
          this.deleting = true;
          this.onDelete(() => {
            const menu = this.menu();
            menu[3].disabled = false;
            this.menu.set(menu);
            this.deleting = false;
          });
        }
      },
    },
  ]);
}
