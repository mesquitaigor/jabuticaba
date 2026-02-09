import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { GroceryItemService } from '../../data/entities/grocery-items/grocery-item.service';

interface GroceryItem {
  id: number;
  name: string;
  icon: string;
  checked: boolean;
}

@Component({
  selector: 'jbt-grocery-list',
  imports: [CommonModule, ButtonModule, CheckboxModule, FormsModule],
  templateUrl: './grocery-list.component.html',
})
export class GroceryListComponent implements OnInit {
  private readonly groceryItemService: GroceryItemService =
    inject(GroceryItemService);
  groceryItems: GroceryItem[] = [
    { id: 1, name: 'Arroz', icon: 'pi pi-box', checked: false },
    { id: 2, name: 'Feijão', icon: 'pi pi-box', checked: false },
    { id: 3, name: 'Leite', icon: 'pi pi-shopping-cart', checked: false },
    { id: 4, name: 'Pão', icon: 'pi pi-shopping-bag', checked: false },
    { id: 5, name: 'Café', icon: 'pi pi-box', checked: false },
    { id: 6, name: 'Açúcar', icon: 'pi pi-box', checked: false },
    { id: 7, name: 'Ovos', icon: 'pi pi-shopping-cart', checked: false },
    { id: 8, name: 'Manteiga', icon: 'pi pi-box', checked: false },
  ];

  ngOnInit(): void {
    this.groceryItemService.getAll().subscribe((items) => {
      console.log(items);
    });
  }

  onEdit(): void {
    console.log('Edit clicked');
  }

  onAdd(): void {
    console.log('Add clicked');
  }

  onItemCheckChange(item: GroceryItem): void {
    console.log(`Item ${item.name} checked: ${item.checked}`);
  }
}
