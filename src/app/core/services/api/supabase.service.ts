import { Injectable } from '@angular/core';
import {
  createClient,
  SupabaseClient,
  PostgrestResponse,
} from '@supabase/supabase-js';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabaseClient?: SupabaseClient;
  get client(): SupabaseClient | undefined {
    return this.supabaseClient;
  }
  public init(): void {
    this.supabaseClient = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
    );
  }
  public async insert<T>(
    data: unknown,
    tableName: string,
  ): Promise<PostgrestResponse<T> | undefined> {
    return await this.client?.from(tableName).insert(data).select();
  }
}
