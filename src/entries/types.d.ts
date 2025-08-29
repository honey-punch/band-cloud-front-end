interface ApiResponse<T> {
  result: T;
  page?: {
    totalCount: number;
    totalPage: number;
    currentPage: number;
    size: number;
  };
}

type SearchParams = {
  // 에셋
  userId?: string[];
  title?: string;

  // 밴드
  name?: string;
  bandId?: string;

  // 기본값
  page: number;
  size: number;
  sort: string;
  limit: number;
};
