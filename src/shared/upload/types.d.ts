interface UploadState {
  fileItems?: FileItem[];
  updateFiles: (files: FileItem[]) => void;
  updateUploadedSize: (assetId: string, size: number) => void;
}

interface FileItem {
  title: string;
  assetId: string;
  totalSize: number;
  uploadedSize: number;
}
