export interface masterModel {
  id: number,
  name: string,
  status: boolean,
  remarks: string,
  tax_rate: number,
  registration_no: string,
  contact_no: string,
  contact_person: string,
  email_address: string,
  address: string,
  product_code: string,
  unit_id: number,
  packing_id: number,
  sku: string,
  type: string,
  tax_type_id: number,
  bonus: number,
  discount: number,
  division_id: number,
  category_id: number,
  generic_name_id: number,
  company_id: number,
  category_name: string,
  company_name: string,
  division_name: string,
  generic_name: string,
  packing_name: string,
  tax_type_name: string,
  unit_name: string,
  isSelected?: boolean,
  discount_type?: string,
  apply_on?: string
}

export interface division extends masterModel {

}

export interface taxTypes extends masterModel {
  remarks: string,
  tax_rate: number,
}

export interface masterUser {
  id: number,
  name: string,
  status: boolean,
  registration_no: string,
  contact_no: string,
  mobile_no: string,
  contact_person: string,
  email_address: string,
  remarks: string,
  address: string,
  registration_id: string,
  taxType: string,
}

export interface masterProducts {
  id: number,
  name: string,
  product_code: string,
  unit_id: number,
  packing_id: number,
  sku: string,
  type: string,
  tax_type_id: number,
  bonus: number,
  discount: number,
  division_id: number,
  category_id: number,
  generic_name_id: number,
  company_id: number,
  remarks: string,
  status: boolean
  category_name: string,
  company_name: string,
  division_name: string,
  generic_name: string,
  packing_name: string,
  tax_type_name: string,
  unit_name: string,
  types: Array<string>,
  categories: Array<object>,
  image_name: string,
  cost_price: number,
  mrp: number,
  selling_price: number,
  trade_price: number,
}

export interface BonusInfo {
  id: number;
  min_quantity: string;
  bonus_quantity: string;
}

export interface Product {
  id: number;
  product_code: string;
  name: string;
  barcode: string;
  packing_id: number;
  hs_code: string;
  types: string[];
  product_type: string;
  image_name: string;
  status: boolean;
  bonus: number;
  discount: number;
  division_id: number;
  generic_name_id: number;
  remarks: string;
  discontinue_status: boolean;
  cost_price: number;
  mrp: number;
  selling_price: number;
  trade_price: number;
  primary_unit_id: number;
  primary_quantity: number;
  has_secondary_unit: boolean | null;
  secondary_unit_id: number;
  secondary_quantity: number;
  tax_type_id: number;
  delete_image: boolean;
  product_categories: Array<object>;
  unit_per_packing: number;
  product_group_id: number;
  max_stock: number;
  min_stock: number;
  reorder_level: number;
  reorder_quantity: number;
  purchase_account_master_id: number;
  purchase_return_account_master_id: number;
  sales_account_master_id: number;
  sales_return_account_master_id: number;
  valuation_method: string;
  is_batch_available: boolean | null;
  has_expiry_date: boolean | null;
  has_manufacturing_date: boolean | null;
  bonus_infos: BonusInfo[];
}


