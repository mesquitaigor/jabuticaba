import { Injectable } from '@angular/core';
import GroceryItemModel from './grocery-item.model';
import { safeStringify } from '../../../shared/utils/serialize';
import Debug from '../../../shared/utils/Debug';

@Injectable({
  providedIn: 'root',
})
export class GroceryItemStorageService {
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
  public recover(): GroceryItemModel[] {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      try {
        return JSON.parse(data) as GroceryItemModel[];
      } catch (error) {
        Debug.error('Error parsing grocery items from localStorage', error);
        return [];
      }
    }
    return [];
  }
}
