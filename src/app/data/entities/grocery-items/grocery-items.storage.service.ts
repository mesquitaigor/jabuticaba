import { Injectable } from '@angular/core';
import GroceryItemModel from './grocery-item.model';
import { safeStringify } from '../../../shared/utils/serialize';
import Debug from '../../../shared/utils/Debug';

@Injectable({
  providedIn: 'root',
})
export class GroceryItemsStorageService {
  private readonly storageKey = 'groceryItems';
  public save(list: GroceryItemModel[]): boolean {
    try {
      localStorage.setItem(this.storageKey, safeStringify(list));
      return true;
    } catch (error) {
      Debug.error('Error saving grocery items to localStorage', error);
      return false;
    }
  }
}
