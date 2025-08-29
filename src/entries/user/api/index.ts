import api from '@/entries';

export async function getUserSearch(params: URLSearchParams) {
  const response = await api.get<ApiResponse<User[]>>('/api/user/search?' + params, {
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

export async function updateUserAvatar(body: AvatarUploadBody) {
  const { userId, multipartFile } = body;
  const formData = new FormData();

  formData.append('multipartFile', multipartFile);

  const response = await api.put<ApiResponse<User>>(`/api/user/${userId}/avatar`, {
    body: formData,
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json().then((res) => res.result);
}

export async function updateUser(id: string, body: UpdateUserBody) {
  const response = await api.put<ApiResponse<User>>(`/api/user/${id}`, {
    next: {
      tags: ['user', id],
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
