import {
  AfterViewInit,
  Component,
  computed,
  inject,
  signal,
  Signal,
} from '@angular/core';
import { GroceryItemIconComponent } from '../grocery-item-icon/grocery-item-icon.component';
import { ButtonModule } from 'primeng/button';
import { DataTestId, DataTestidDirective } from '@directives/data-testid';
import { dialogData, DialogRef, DialogService } from '@layout/dialog';
import { GroceryItemIconModel } from '@models/grocery-items';
export interface GroceryIconListSelectionDialogData {
  selectedIcon: GroceryItemIconModel | null;
}
export interface GroceryIconListSelectionDialogOutput {
  selectedIcon: GroceryItemIconModel | null;
}
@Component({
  selector: 'jbt-grocery-icon-list-selection',
  templateUrl: './grocery-icon-list-selection.dialog.html',
  imports: [GroceryItemIconComponent, ButtonModule, DataTestidDirective],
})
export class GroceryIconListSelectionDialog
  implements DialogRef<GroceryIconListSelectionDialogData>, AfterViewInit
{
  private readonly dialogService = inject(DialogService);
  public readonly testIds = DataTestId.GroceryIconListSelectionDialog;
  public readonly icons: Signal<GroceryItemIconModel[]> = signal([
    new GroceryItemIconModel('alvejante'),
    new GroceryItemIconModel('default-icon'),
    new GroceryItemIconModel('ketchup'),
    new GroceryItemIconModel('rice-sack'),
    new GroceryItemIconModel('picles'),
    new GroceryItemIconModel('oleo'),
  ]);
  public readonly selectedIcon = signal<GroceryItemIconModel | null>(
    GroceryItemIconModel.defaultIcon,
  );
  public readonly previewIcon = signal<GroceryItemIconModel | null>(null);
  public readonly showingIcon = computed(
    () =>
      this.previewIcon() ||
      this.selectedIcon() ||
      GroceryItemIconModel.defaultIcon,
  );
  public dialogData?: dialogData<GroceryIconListSelectionDialogData>;
  public ngAfterViewInit(): void {
    if (this.dialogData?.selectedIcon) {
      this.selectedIcon.set(this.dialogData.selectedIcon);
    }
  }
  public save(): void {
    this.dialogService.close<GroceryIconListSelectionDialogOutput>(
      this.dialogData?.id,
      { selectedIcon: this.selectedIcon() },
    );
  }
  public handleCancel(): void {
    this.dialogService.close(this.dialogData?.id);
  }
  public setPreviewIcon(icon: GroceryItemIconModel): void {
    this.previewIcon.set(icon);
  }
  public selectIcon(icon: GroceryItemIconModel): void {
    this.selectedIcon.set(icon);
  }
  public resetPreviewIcon(): void {
    this.previewIcon.set(null);
  }
}
