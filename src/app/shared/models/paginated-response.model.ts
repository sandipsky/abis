export interface IPaginatedResponse<T> {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: IPageable;
  size: number;
  sort: ISort;
  totalElements: number;
  totalPages: number;
}

export interface IPageable {
  pageNumber: number;
  pageSize: number;
  sort: ISort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface ISort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}
