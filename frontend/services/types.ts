export interface User {
  id: string;
  clerk_id: string;
  email: string;
  username: string;
  avatar_src: string;
  created_at: string;
  updated_at: string;
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
  