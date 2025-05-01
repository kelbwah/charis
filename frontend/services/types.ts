export interface User {
  id: string;
  email: string;
  username: string;
  biography: string;
  created_at: string;
}

export interface Prayer {
  id: string;
  prayer_title: string;
  prayer_request: string;
  category: string;
  related_scripture?: string | null;
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
  user_id: string;
}

export interface AuthResponse {
  user_id: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  biography: string;
  username: string;
}
