import { inject, Injectable } from '@angular/core';
import { from, map, Observable, of, tap } from 'rxjs';
import { IGroceryItemApi } from './grocery-item.dto';
import { SupabaseService } from '@api/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class GroceryItemApiService {
  private readonly tableName = 'grocery_item';
  private readonly supabaseService: SupabaseService = inject(SupabaseService);
  public create(
    payload: Pick<IGroceryItemApi, 'name'>,
  ): Observable<IGroceryItemApi[] | null> {
    if (this.supabaseService.client) {
      const promise = this.supabaseService.insert<IGroceryItemApi>(
        payload,
        this.tableName,
      );
      return from(promise).pipe(
        tap((response) => {
          if (response?.error) {
            throw response.error;
          }
        }),
        map((response) => response?.data || null),
      );
    } else {
      return of(null);
    }
  }
  public updateRecord(
    uuid: string,
    payload: Partial<IGroceryItemApi>,
  ): Observable<IGroceryItemApi[] | null> {
    if (this.supabaseService.client) {
      const promise = this.supabaseService.update<IGroceryItemApi>(
        this.tableName,
        uuid,
        payload,
      );
      return from(promise).pipe(
        tap((response) => {
          if (response?.error) {
            throw response.error;
          }
        }),
        map((response) => response?.data || null),
      );
    } else {
      return of(null);
    }
  }
  public deleteRecord(uuid: string): Observable<null> {
    if (this.supabaseService.client) {
      const promise = this.supabaseService.delete(this.tableName, uuid);
      return from(promise).pipe(
        tap((response) => {
          if (response?.error) {
            throw response.error;
          }
        }),
        map((response) => response?.data || null),
      );
    } else {
      return of(null);
    }
  }
  public getAll(): Observable<IGroceryItemApi[] | null> {
    if (this.supabaseService.client) {
      const promise = this.supabaseService.select<IGroceryItemApi>(
        this.tableName,
      );
      return from(promise).pipe(
        map((response) => {
          if (response?.error) {
            throw response.error;
          }
          return response?.data || null;
        }),
      );
    } else {
      return of(null);
    }
  }
}
