type Asset = {
  id: string;
  title: string;
  assetPath: string;
  thumbnailPath: string;
  originalFileName: string;
  userId: string;
  createdDate: string;
  isPublic: boolean;
  description?: string;
  isDeleted: boolean;
  belongBandId?: string;
};

type CreateAssetBody = {
  userId: string;
  originalFileName: string;
  belongBandId?: string;
};

type UploadBody = {
  assetId: string;
  multipartFile: Blob;
};
