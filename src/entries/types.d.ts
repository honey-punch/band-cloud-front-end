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
  // isPulic확인할 아이디
  currentUserId?: string;
  // 에셋
  userId?: string[];
  title?: string;
  isPublic?: boolean;
  belongBandId?: string;

  // 밴드
  name?: string;
  bandId?: string;

  // 기본값
  page: number;
  size: number;
  sort: string;
  limit: number;
};
