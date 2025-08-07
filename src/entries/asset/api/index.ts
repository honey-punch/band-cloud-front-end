import api from '@/entries';

export async function getAssetSearch() {
  const response = await api.get<ApiResponse<Asset[]>>('api/asset/search?isDeleted=false', {
    next: {
      tags: ['asset', 'search'],
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json().then((res) => res.result);
}

export async function getAssetById(id: string) {
  const response = await api.get<ApiResponse<Asset>>(`/api/asset/${id}`, {
    next: {
      tags: ['asset', id],
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json().then((res) => res.result);
}
