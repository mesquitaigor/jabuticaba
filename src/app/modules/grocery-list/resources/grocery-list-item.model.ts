import { MenuItem } from 'primeng/api';
import GroceryItemModel from '../../../data/entities/grocery-items/grocery-item.model';
import { signal } from '@angular/core';

export class GroceryListItem extends GroceryItemModel {
  public adding = false;
  public changingMissing = false;
  public changingVisibility = false;
  public deleting = false;
  public onDelete?: (stopState: () => void) => void;
  public onVisibilityChange?: (
    item: GroceryListItem,
    stopState: () => void,
  ) => void;
  public onMissingCheck?: (
    item: GroceryListItem,
    stopState: () => void,
  ) => void;
  public readonly menu = signal<MenuItem[]>([
    { label: 'Editar', icon: 'pi pi-pencil' },
    {
      label: 'Esconder',
      icon: 'pi pi-eye',
      command: (): void => {
        if (!this.changingVisibility) {
          this.changeVisibilityState(true);
          this.hidden = !this.hidden;
          this.defineVisibilityItem();
          this.onVisibilityChange?.(this, () => {
            this.changeVisibilityState(false);
          });
        }
      },
    },
    {
      label: this.getMissingLabel(),
      icon: 'pi pi-check',
      command: (): void => {
        if (!this.changingVisibility) {
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
    onChangeVisibility,
  }: {
    item: GroceryItemModel;
    onDelete?: (stopState: () => void) => void;
    onChangeMissing?: (item: GroceryListItem, stopState: () => void) => void;
    onChangeVisibility?: (item: GroceryListItem, stopState: () => void) => void;
  }): void {
    this.uuid = item.uuid;
    this.name = item.name;
    this.missing = item.missing;
    this.hidden = item.hidden;
    this.onDelete = onDelete;
    this.onMissingCheck = onMissingCheck;
    this.onVisibilityChange = onChangeVisibility;
    this.defineMissingLabel();
    this.defineMissingLabel();
  }
  private defineMissingLabel(): void {
    const menu = this.menu();
    menu[2].label = this.getMissingLabel();
    this.menu.set(menu);
  }
  private defineVisibilityItem(): void {
    const menu = this.menu();
    if (this.hidden) {
      menu[1].label = 'Mostrar';
      menu[1].icon = 'pi pi-eye-slash';
    } else {
      menu[1].label = 'Esconder';
      menu[1].icon = 'pi pi-eye';
    }
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
  private changeVisibilityState(stt: boolean): void {
    const menu = this.menu();
    menu[1].disabled = stt;
    this.menu.set(menu);
    this.changingVisibility = stt;
  }
}
