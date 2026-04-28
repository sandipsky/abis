export interface IFilterItem {
  field: string;
  value: string;
  displayValue: string;
}

export type IFilterColumnType = 'text' | 'select' | 'search-select' | 'date';

export interface IFilterColumnOption {
  id: string | number;
  name: string;
}

export interface IFilterColumn {
  name: string;
  formcontrolName: string;
  type: IFilterColumnType;
  data?: IFilterColumnOption[];
  value?: string | number | null;
}
