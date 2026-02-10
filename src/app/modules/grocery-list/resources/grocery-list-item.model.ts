import { MenuItem } from 'primeng/api';
import GroceryItemModel from '../../../data/entities/grocery-items/grocery-item.model';

export class GroceryListItem extends GroceryItemModel {
  public adding = false;
  public changingMissing = false;
  public onDelete?: () => void;
  public readonly menu: MenuItem[] = [
    { label: 'Editar', icon: 'pi pi-pencil' },
    { label: 'Esconder', icon: 'pi pi-eye' },
    { label: 'Marcar', icon: 'pi pi-check' },
    {
      label: 'Excluir',
      icon: 'pi pi-trash',
      styleClass: 'warning',
      command: (): void => {
        if (this.onDelete) {
          this.onDelete();
        }
      },
    },
  ];
}
