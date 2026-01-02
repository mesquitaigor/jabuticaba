import { Injectable } from '@angular/core';
import {
  createClient,
  SupabaseClient,
  PostgrestResponse,
  PostgrestSingleResponse,
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
  public async select<T>(
    tableName: string,
  ): Promise<PostgrestResponse<T> | undefined> {
    return await this.client?.from(tableName).select();
  }
  public async delete(
    tableName: string,
    uuid: string,
  ): Promise<PostgrestSingleResponse<null> | undefined> {
    return await this.client?.from(tableName).delete().eq('uuid', uuid);
  }
  public async update<T>(
    tableName: string,
    uuid: string,
    data: unknown,
  ): Promise<PostgrestResponse<T> | undefined> {
    return await this.client
      ?.from(tableName)
      .update(data)
      .eq('uuid', uuid)
      .select();
  }
}
