import {
  Component,
  Input,
  Output,
  EventEmitter,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import GroceryItemModel from '../../../../data/entities/grocery-items/grocery-item.model';

@Component({
  selector: 'jbt-grocery-item-box-card',
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: './grocery-item-box-card.component.html',
  styleUrl: './grocery-item-box-card.component.scss',
})
export class GroceryItemBoxCardComponent {
  public readonly groceryItem = input.required<GroceryItemModel>();
  @Input() iconUrl?: string;
  @Output() delete = new EventEmitter<GroceryItemModel>();
  @Output() edit = new EventEmitter<GroceryItemModel>();
  @Output() toggleMissing = new EventEmitter<GroceryItemModel>();

  public readonly isEditing = signal(false);

  onEdit(): void {
    this.isEditing.set(true);
    this.edit.emit(this.groceryItem());
  }

  onDelete(): void {
    this.delete.emit(this.groceryItem());
    this.isEditing.set(false);
  }

  onCancelEdit(): void {
    this.isEditing.set(false);
  }

  toggleMissingStatus(): void {
    const item = this.groceryItem();
    item.missing = !item.missing;
    this.toggleMissing.emit(item);
  }

  getIconUrl(): string {
    return this.iconUrl || '/assets/icons/default.svg';
  }
}
