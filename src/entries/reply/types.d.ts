type Reply = {
  id: string;
  content: string;
  userId: string;
  assetId: string;
  createdDate: string;
  isDeleted: boolean;
};

type CreateReplyBody = { content: string; userId: string };
type UpdateReplyBody = { content: string };
