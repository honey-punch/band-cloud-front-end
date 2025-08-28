import api from '@/entries';

export async function getBandById(id: string) {
  const response = await api.get<ApiResponse<Band>>(`/api/band/${id}`, {
    next: {
      tags: ['band', id],
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

export async function getBandSearch(params: URLSearchParams) {
  const response = await api.get<ApiResponse<Band[]>>(`/api/band/search?${params}`, {
    next: {
      tags: ['band', 'search'],
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json().then((res) => res);
}

export async function createBand(body: CreateBandBody) {
  const response = await api.post<ApiResponse<Band>>(`/api/band`, {
    next: {
      tags: ['band', 'create'],
    },
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json().then((res) => res.result);
}
