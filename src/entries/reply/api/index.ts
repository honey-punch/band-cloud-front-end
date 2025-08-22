import api from '@/entries';

export async function getReplyByAssetId(assetId: string, params: URLSearchParams) {
  const response = await api.get<ApiResponse<Reply[]>>(`/api/reply/${assetId}?${params}`, {
    next: {
      tags: ['reply', assetId],
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

export async function createReply(assetId: string, body: CreateReplyBody) {
  const response = await api.post<ApiResponse<Reply>>(`/api/reply/${assetId}`, {
    next: {
      tags: ['reply', 'create'],
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

export async function updateReply(replyId: string, body: UpdateReplyBody) {
  const response = await api.put<ApiResponse<Reply>>(`/api/reply/${replyId}`, {
    next: {
      tags: ['reply', 'update', replyId],
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

export async function deleteReply(replyId: string) {
  const response = await api.delete<ApiResponse<Reply>>(`/api/reply/${replyId}`, {
    next: {
      tags: ['reply', 'delete', replyId],
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
