export type ApiResponse<T> = {
  message: string;
  status: string;
  data: T;
};

export interface PagingInterface {
  totalRow: number;
  totalPage: number;
  page: number;
  perPage: number;
  hasNext: boolean;
  hasPrev: boolean;
  pages: number[];
}

export type ApiPaginationResponse<T> = {
  message: string;
  status: string;
  data: T;
  paging: PagingInterface;
};

export type DataArray<T> = T[];

export type DataObject<T> = T;
