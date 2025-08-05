import api from '@/entries';

export async function getUserSearch() {
  const response = await api.get<ApiResponse<User[]>>(`/api/user/search?isDeleted=false`, {
    next: {
      tags: ['user', 'search'],
    },
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json().then((res) => res.result);
}

export async function getUserById(id: string) {
  const response = await api.get<ApiResponse<User>>(`/api/user/${id}`, {
    next: {
      tags: ['user', id],
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
