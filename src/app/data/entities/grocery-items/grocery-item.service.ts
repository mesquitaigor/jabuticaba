import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
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
    );
  }
  public delete(uuid: string): Observable<null> {
    return this.groceryItemApiService.deleteRecord(uuid);
  }
}
