type User = {
  id: string;
  userId: string;
  name: string;
  bandIds: string[];
  createdDate: string;
  isDeleted: boolean;
};

type AvatarUploadBody = {
  userId: string;
  multipartFile: Blob;
};
