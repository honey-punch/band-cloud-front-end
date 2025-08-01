interface ApiResponse<T> {
  result: T;
  page?: {
    totalCount: number;
    totalPage: number;
    currentPage: number;
    size: number;
  };
}
