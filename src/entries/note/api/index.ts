import api from '@/entries';

export async function getNoteByBandId(bandId: string, params: URLSearchParams) {
  const response = await api.get<ApiResponse<Note[]>>(`/api/note/${bandId}?${params}`, {
    next: {
      tags: ['note', bandId],
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

export async function createNote(bandId: string, body: CreateNoteBody) {
  const response = await api.post<ApiResponse<Note>>(`/api/note/${bandId}`, {
    next: {
      tags: ['note', 'create'],
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

export async function updateNote(noteId: string, body: UpdateNoteBody) {
  const response = await api.put<ApiResponse<Note>>(`/api/note/${noteId}`, {
    next: {
      tags: ['note', 'update', noteId],
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

export async function deleteNote(noteId: string) {
  const response = await api.delete<ApiResponse<Note>>(`/api/note/${noteId}`, {
    next: {
      tags: ['note', 'delete', noteId],
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
