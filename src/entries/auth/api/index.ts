import api from '@/entries';

export async function login(body: LoginBody) {
  const response = await api.post<ApiResponse<User>>(`/api/auth/login`, {
    next: {
      tags: ['auth', 'login'],
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

export async function logout() {
  const response = await api.post<ApiResponse<string>>(`/api/auth/logout`, {
    next: {
      tags: ['auth', 'logout'],
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

export async function getMe() {
  const response = await api.get<ApiResponse<User>>('/api/auth/me', {
    next: {
      tags: ['auth', 'me'],
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
