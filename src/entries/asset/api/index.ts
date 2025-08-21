import api from '@/entries';

export async function getAssetSearch(params: URLSearchParams) {
  const response = await api.get<ApiResponse<Asset[]>>('/api/asset/search?' + params, {
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

  return response.json().then((res) => res);
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

export async function createAsset(body: CreateAssetBody) {
  const response = await api.post<ApiResponse<Asset>>(`/api/asset`, {
    next: {
      tags: ['asset', 'create'],
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

export async function upload(body: UploadBody) {
  const { assetId, multipartFile } = body;
  const formData = new FormData();

  formData.append('assetId', assetId);
  formData.append('multipartFile', multipartFile);

  const response = await api.post<ApiResponse<string>>(`/api/asset/upload`, {
    body: formData,
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json().then((res) => res.result);
}

export async function updateAssetThumbnail(body: UploadBody) {
  const { assetId, multipartFile } = body;
  const formData = new FormData();

  formData.append('multipartFile', multipartFile);

  const response = await api.put<ApiResponse<Asset>>(`/api/asset/${assetId}/thumbnail`, {
    body: formData,
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json().then((res) => res.result);
}
