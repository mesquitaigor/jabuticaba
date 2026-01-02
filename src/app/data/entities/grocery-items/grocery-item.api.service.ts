import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../../../core/services/api/supabase.service';
import { from, map, Observable, of } from 'rxjs';
import {
  GroceryItemResponse,
  GroceryItemCreatePayload,
} from './grocery-item.dto';

@Injectable({
  providedIn: 'root',
})
export class GroceryItemApiService {
  private readonly tableName = 'grocery_item';
  private readonly supabaseService: SupabaseService = inject(SupabaseService);
  public create(
    payload: GroceryItemCreatePayload,
  ): Observable<GroceryItemResponse[] | null> {
    if (this.supabaseService.client) {
      const promise = this.supabaseService.insert<GroceryItemResponse>(
        payload,
        this.tableName,
      );
      return from(promise).pipe(map((response) => response?.data || null));
    } else {
      return of(null);
    }
  }
}
