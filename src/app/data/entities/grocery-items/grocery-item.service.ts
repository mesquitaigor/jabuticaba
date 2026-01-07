import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap, of } from 'rxjs';
import { GroceryItemApiService } from './grocery-item.api.service';
import ShoppingListItemMapper from './grocery-item.mapper';
import GroceryItem from './grocery-item.model';
import GroceryItemModel from './grocery-item.model';
import { IGroceryItemApi } from './grocery-item.dto';

@Injectable({
  providedIn: 'root',
})
export class GroceryItemService {
  private readonly groceryItemApiService: GroceryItemApiService = inject(
    GroceryItemApiService,
  );

  private readonly groceryItemsSubject = new BehaviorSubject<GroceryItem[]>([]);
  public readonly groceryItems$ = this.groceryItemsSubject.asObservable();
  public create(name: string): Observable<GroceryItem | null> {
    return this.groceryItemApiService.create({ name: name }).pipe(
      map((response) => {
        if (response?.length) {
          return response.map((data) => {
            return ShoppingListItemMapper.apiToModel(data);
          })[0];
        }
        return null;
      }),
      tap((newItem) => {
        if (newItem) {
          const currentItems = this.groceryItemsSubject.value;
          this.groceryItemsSubject.next([...currentItems, newItem]);
        }
      }),
    );
  }
  public getAll(): Observable<GroceryItem[]> {
    // Only load from API if BehaviorSubject is empty
    const currentItems = this.groceryItemsSubject.value;
    if (currentItems.length > 0) {
      return of(currentItems);
    }

    return this.groceryItemApiService.getAll().pipe(
      map((response) => {
        if (response?.length) {
          return response.map((data) => {
            return ShoppingListItemMapper.apiToModel(data);
          });
        }
        return [];
      }),
      tap((items) => {
        this.groceryItemsSubject.next(items);
      }),
    );
  }
  public updateName(item: GroceryItemModel): Observable<GroceryItem | null> {
    return this.updateModel(item.uuid || '', { name: item.name });
  }
  public updateMissing(item: GroceryItemModel): Observable<GroceryItem | null> {
    return this.updateModel(item.uuid || '', { missing: item.missing });
  }
  private updateModel(
    uuid: string,
    model: Partial<IGroceryItemApi>,
  ): Observable<GroceryItem | null> {
    return this.groceryItemApiService.updateRecord(uuid, model).pipe(
      map((response) => {
        if (response?.length) {
          return response.map((data) => {
            return ShoppingListItemMapper.apiToModel(data);
          })[0];
        }
        return null;
      }),
      tap((updatedItem) => {
        if (updatedItem) {
          const currentItems = this.groceryItemsSubject.value;
          const updatedItems = currentItems.map((item) =>
            item.uuid === updatedItem.uuid ? updatedItem : item,
          );
          this.groceryItemsSubject.next(updatedItems);
        }
      }),
    );
  }
  public delete(uuid: string): Observable<null> {
    return this.groceryItemApiService.deleteRecord(uuid).pipe(
      tap(() => {
        const currentItems = this.groceryItemsSubject.value;
        const filteredItems = currentItems.filter((item) => item.uuid !== uuid);
        this.groceryItemsSubject.next(filteredItems);
      }),
    );
  }
}
