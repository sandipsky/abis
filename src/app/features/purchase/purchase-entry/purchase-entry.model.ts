export interface IPurchaseEntry {
  id: number;
  purchase_no: string;
  posting_date: string;
  vendor_id: number;
  vendor_name: string | null;
  transaction_type: string;
  bill_no: string;
  bill_date: string;
  gross_amount: number;
  discount: number;
  tax_amount: number;
  net_amount: number;
}
