export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  params: Record<string, any>;
  action_url: string | null;
  entity_type: string | null;
  entity_id: string | number | null;
  read_at: string | null;
  created_at: string;
}

export interface PaginatedNotifications {
  data: Notification[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
  };
}

export interface UnreadCountResponse {
  unread_count: number;
}
