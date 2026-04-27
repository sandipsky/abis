export interface Product {
  id: number;
  name: string;
  code: string;
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
  purchasable: boolean;
  sellable: boolean;
  service_item: boolean;
}
