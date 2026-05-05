export interface IProductBonusInfo {
  id: number | null;
  min_quantity: number | null;
  bonus_quantity: number | null;
}

export interface IProduct {
  id: number;
  name: string;
  code: string;
  barcode: string | null;
  is_active: boolean;
  category_id: number;
  category_name: string | null;
  packing_id: number;
  packing_name: string | null;
  unit_id: number;
  unit_name: string | null;
  tax_type_id: number;
  tax_type_name: string | null;
  tax_rate: number;
  cost_price: number;
  selling_price: number;
  mrp: number;
  max_stock: number | null;
  min_stock: number | null;
  remarks: string | null;
  purchasable: boolean;
  sellable: boolean;
  service_item: boolean;
  valuation_method: string | null;
  is_batch_available: boolean;
  has_expiry_date: boolean;
  has_manufacturing_date: boolean;
  bonus_infos: IProductBonusInfo[];
}


