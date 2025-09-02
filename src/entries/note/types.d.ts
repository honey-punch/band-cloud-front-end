type Note = {
  id: string;
  content: string;
  userId: string;
  bandId: string;
  createdDate: string;
  isDeleted: boolean;
};

type CreateNoteBody = { content: string; userId: string };
type UpdateNoteBody = { content: string };
