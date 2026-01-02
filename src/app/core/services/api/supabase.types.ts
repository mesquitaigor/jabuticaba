import { PostgrestError } from '@supabase/supabase-js';

export interface ISupabaseResponse<T> {
  count: number | null;
  data: T | null;
  error: PostgrestError | null;
  status: number;
  statusText: string;
}
