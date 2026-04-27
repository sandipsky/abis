export interface FilterItem {
  field: string;
  value: string;
  displayValue: string;
}

export type FilterColumnType = 'text' | 'select' | 'search-select' | 'date';

export interface FilterColumnOption {
  id: string | number;
  name: string;
}

export interface FilterColumn {
  name: string;
  formcontrolName: string;
  type: FilterColumnType;
  data?: FilterColumnOption[];
  value?: string | number | null;
}
