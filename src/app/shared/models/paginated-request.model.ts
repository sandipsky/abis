import { IFilterItem } from "./filter.model";

export interface IPaginatedRequest {
  filter: IFilterItem[],
  pagination: {pageIndex: number, pageSize: number },
  sortDTO: {field: string, orderType: string}[]
}
