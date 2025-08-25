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
