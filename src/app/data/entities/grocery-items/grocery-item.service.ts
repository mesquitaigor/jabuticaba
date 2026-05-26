import {
  effect,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import { map, Observable, tap, of } from 'rxjs';
import { GroceryItemApiService } from './grocery-item.api.service';
import ShoppingListItemMapper from './grocery-item.mapper';
import GroceryItem from './grocery-item.model';
import GroceryItemModel from './grocery-item.model';
import { IGroceryItemApi } from './grocery-item.dto';
import { GroceryItemStorageService } from './grocery-item.storage.service';

@Injectable({
  providedIn: 'root',
})
export class GroceryItemService {
  private readonly api: GroceryItemApiService = inject(GroceryItemApiService);
  private readonly storage: GroceryItemStorageService = inject(
    GroceryItemStorageService,
  );
  private readonly list$ = signal<GroceryItem[]>([]);
  constructor() {
    this.list$.set(this.storage.recover());
    effect(() => {
      this.storage.save(this.list$());
    });
  }
  public create(groceryItem: GroceryItemModel): Observable<GroceryItem | null> {
    if (
      !groceryItem?.name ||
      groceryItem.name.trim() === '' ||
      !groceryItem.icon?.name
    ) {
      return of(null);
    }
    return this.api
      .create({ name: groceryItem.name, icon: groceryItem.icon.name })
      .pipe(
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
            const currentItems = this.list$();
            this.list$.set([...currentItems, newItem]);
          }
        }),
      );
  }
  public getList(): WritableSignal<GroceryItem[]> {
    return this.list$;
  }
  public getAll(): Observable<GroceryItem[]> {
    const currentItems = this.list$();
    if (currentItems.length > 0) {
      return of(currentItems);
    }

    return this.api.getAll().pipe(
      map((response) => {
        if (response?.length) {
          return response.map((data) => {
            return ShoppingListItemMapper.apiToModel(data);
          });
        }
        return [];
      }),
      tap((items) => {
        this.list$.set(items);
      }),
    );
  }
  public updateName(item: GroceryItemModel): Observable<GroceryItem | null> {
    return this.updateModel(item.uuid || '', { name: item.name });
  }
  public updateMissing(item: GroceryItemModel): Observable<GroceryItem | null> {
    return this.updateModel(item.uuid || '', { missing: item.missing });
  }
  public updateHidden(item: GroceryItemModel): Observable<GroceryItem | null> {
    return this.updateModel(item.uuid || '', { hidden: item.hidden });
  }
  public editItem(item: GroceryItemModel): Observable<GroceryItem | null> {
    return this.updateModel(item.uuid || '', {
      icon: item.icon?.name,
      name: item.name,
    });
  }
  private updateModel(
    uuid: string,
    model: Partial<IGroceryItemApi>,
  ): Observable<GroceryItem | null> {
    return this.api.updateRecord(uuid, model).pipe(
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
          const currentItems = this.list$();
          const updatedItems = currentItems.map((item) =>
            item.uuid === updatedItem.uuid ? updatedItem : item,
          );
          this.list$.set(updatedItems);
        }
      }),
    );
  }
  public delete(uuid: string): Observable<null> {
    return this.api.deleteRecord(uuid).pipe(
      tap(() => {
        const currentItems = this.list$();
        const filteredItems = currentItems.filter((item) => item.uuid !== uuid);
        this.list$.set(filteredItems);
      }),
    );
  }
}
