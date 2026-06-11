export interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  role: 'customer' | 'driver' | 'admin';
  is_active?: boolean;
}
