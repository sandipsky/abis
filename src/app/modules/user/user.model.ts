export interface IUser {
  id: number;
  name: string;
  contact_number: string;
  gender: string;
  remarks: string;
  user_name: string;
  password: string;
  role_id: number;
  role_name: string;
  is_active: boolean;
  account_non_locked: boolean;
  login_status: boolean;
  profile_Picture_file_name: string;
}
