import { Injectable } from '@angular/core';
import GroceryItemModel from './grocery-item.model';
import { safeStringify } from '../../../shared/utils/serialize';
import Debug from '../../../shared/utils/Debug';
import { IGroceryItemApi } from './grocery-item.dto';
import GroceryItemMapper from './grocery-item.mapper';

type StoredGroceryItem = Omit<IGroceryItemApi, 'icon'> & {
  icon?: { name: string } | null;
};

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
    if (!data) return [];
    try {
      const parsed = JSON.parse(data) as StoredGroceryItem[];
      return parsed.map((item) =>
        GroceryItemMapper.apiToModel({
          ...item,
          icon: item.icon?.name ?? null,
        }),
      );
    } catch (error) {
      Debug.error('Error parsing grocery items from localStorage', error);
      return [];
    }
  }
}
