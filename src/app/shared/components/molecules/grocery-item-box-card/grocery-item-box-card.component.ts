import {
  Component,
  Input,
  Output,
  EventEmitter,
  input,
  signal,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import GroceryItemModel from '../../../../data/entities/grocery-items/grocery-item.model';

@Component({
  selector: 'jbt-grocery-item-box-card',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    CheckboxModule,
  ],
  templateUrl: './grocery-item-box-card.component.html',
  styleUrl: './grocery-item-box-card.component.scss',
})
export class GroceryItemBoxCardComponent {
  @ViewChild('nameInput') nameInput?: ElementRef<HTMLInputElement>;

  public readonly groceryItem = input.required<GroceryItemModel>();
  @Input() iconUrl?: string;
  @Output() delete = new EventEmitter<GroceryItemModel>();
  @Output() edit = new EventEmitter<GroceryItemModel>();
  @Output() toggleMissing = new EventEmitter<GroceryItemModel>();

  public readonly isEditing = signal(false);
  public editableName = signal('');

  onEdit(): void {
    this.editableName.set(this.groceryItem().name || '');
    this.isEditing.set(true);
    this.edit.emit(this.groceryItem());

    // Focus the input after view updates
    setTimeout(() => {
      this.nameInput?.nativeElement.focus();
    }, 0);
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
