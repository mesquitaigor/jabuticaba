import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
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
}
