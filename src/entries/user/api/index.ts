import api from '@/entries';

export async function getUser() {
  const response = await api.get(`/api/user`, {
    next: {
      tags: ['user'],
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
