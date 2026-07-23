export interface Miembro {
  id: string;
  nombre: string;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  is_guest: boolean;
}
