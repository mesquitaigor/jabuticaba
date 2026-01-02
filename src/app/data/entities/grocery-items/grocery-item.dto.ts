export interface GroceryItemCreatePayload {
  name: string;
}

export interface GroceryItemResponse {
  created_at: string;
  deleted_at: string | null;
  name: string;
  missing: boolean;
  updated_at: string;
  uuid: string;
}
