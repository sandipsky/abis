import { FilterItem } from "./filter.model";

export interface PaginatedRequest {
  filter: FilterItem[],
  pagination: {pageIndex: number, pageSize: number },
  sortDTO: {field: string, orderType: string}[]
}
