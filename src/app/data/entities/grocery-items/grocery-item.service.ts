import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GroceryItemApiService } from './grocery-item.api.service';
import ShoppingListItemMapper from './grocery-item.mapper';
import GroceryItem from './grocery-item.model';
import GroceryItemModel from './grocery-item.model';

@Injectable({
  providedIn: 'root',
})
export class GroceryItemService {
  private readonly groceryItemApiService: GroceryItemApiService = inject(
    GroceryItemApiService,
  );
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
    );
  }
  public getAll(): Observable<GroceryItem[]> {
    return this.groceryItemApiService.getAll().pipe(
      map((response) => {
        if (response?.length) {
          return response.map((data) => {
            return ShoppingListItemMapper.apiToModel(data);
          });
        }
        return [];
      }),
    );
  }
  public update(item: GroceryItemModel): Observable<GroceryItem | null> {
    return this.groceryItemApiService
      .updateRecord(item.uuid || '', { name: item.name })
      .pipe(
        map((response) => {
          if (response?.length) {
            return response.map((data) => {
              return ShoppingListItemMapper.apiToModel(data);
            })[0];
          }
          return null;
        }),
      );
  }
  public delete(uuid: string): Observable<null> {
    return this.groceryItemApiService.deleteRecord(uuid);
  }
}
