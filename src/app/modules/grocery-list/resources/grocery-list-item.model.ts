import { MenuItem } from 'primeng/api';
import GroceryItemModel from '../../../data/entities/grocery-items/grocery-item.model';
import { signal } from '@angular/core';

export class GroceryListItem extends GroceryItemModel {
  public adding = false;
  public changingMissing = false;
  public deleting = false;
  public onDelete?: (stopState: () => void) => void;
  public onMissingCheck?: (
    item: GroceryListItem,
    stopState: () => void,
  ) => void;
  public readonly menu = signal<MenuItem[]>([
    { label: 'Editar', icon: 'pi pi-pencil' },
    { label: 'Esconder', icon: 'pi pi-eye' },
    {
      label: this.getMissingLabel(),
      icon: 'pi pi-check',
      command: (): void => {
        if (!this.changingMissing) {
          this.changeMissingState(true);
          this.missing = !this.missing;
          this.defineMissingLabel();
          this.onMissingCheck?.(this, () => {
            this.changeMissingState(false);
          });
        }
      },
    },
    {
      label: 'Excluir',
      icon: 'pi pi-trash',
      disabled: this.deleting,
      styleClass: 'warning',
      command: (): void => {
        if (this.onDelete) {
          this.changeDeletingState(true);
          this.onDelete(() => {
            this.changeDeletingState(false);
          });
        }
      },
    },
  ]);
  public parse({
    item,
    onDelete,
    onChangeMissing: onMissingCheck,
  }: {
    item: GroceryItemModel;
    onDelete?: (stopState: () => void) => void;
    onChangeMissing?: (item: GroceryListItem, stopState: () => void) => void;
  }): void {
    this.uuid = item.uuid;
    this.name = item.name;
    this.missing = item.missing;
    this.onDelete = onDelete;
    this.onMissingCheck = onMissingCheck;
    this.defineMissingLabel();
  }
  private defineMissingLabel(): void {
    const menu = this.menu();
    menu[2].label = this.getMissingLabel();
    this.menu.set(menu);
  }
  private getMissingLabel(): string {
    return !this.missing ? 'Marcar' : 'Desmarcar';
  }
  private changeDeletingState(stt: boolean): void {
    const menu = this.menu();
    menu[3].disabled = stt;
    this.menu.set(menu);
    this.deleting = stt;
  }
  private changeMissingState(stt: boolean): void {
    const menu = this.menu();
    menu[2].disabled = stt;
    this.menu.set(menu);
    this.changingMissing = stt;
  }
}
