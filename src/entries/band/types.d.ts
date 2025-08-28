type Band = {
  id: string;
  name: string;
  createdDate: string;
  description?: string;
  isDeleted: boolean;
  leaderId: string;
};

type CreateBandBody = { name: string; leaderId: string; description?: string };
