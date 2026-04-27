export interface TableHeader {
  name: string;
  property: string;
  sort: boolean;
  sortBy?: string;
  align?: 'left' | 'right' | 'center';
  status?: boolean;
  editStatus?: boolean;
  special_status?: boolean;
  date?: boolean;
  amount?: boolean;
  linkUrl?: boolean;
}
