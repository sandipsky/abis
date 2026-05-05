export interface IMasterAccount {
  id: number;
  account_code: string;
  account_name: string;
  account_type: string;
  is_active: boolean;
  parent_account_name: string;
  parent_id: number;
  remarks: string;
}

export interface IAccountTypeGroup {
  heading: string;
  types: string[];
}

export interface IAccountTypeOption {
  id: string;
  name: string;
  group: string;
}

export interface IParentAccount {
  id: number;
  name: string;
}
