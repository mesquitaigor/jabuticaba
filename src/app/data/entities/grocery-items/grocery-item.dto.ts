export interface IGroceryItemApi {
  created_at: string;
  deleted_at: string | null;
  name: string;
  missing: boolean;
  updated_at: string;
  uuid: string;
}
