export interface IUser {
  id: number;
  name: string;
  contact: string;
  email: string;
  gender: string;
  remarks: string;
  username: string;
  password: string;
  role_id: number;
  role_name: string;
  is_active: boolean;
  account_non_locked: boolean;
  login_status: boolean;
  image_url: string;
}
