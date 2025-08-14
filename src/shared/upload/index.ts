import { BoundPersistState } from '@/shared/rootStore';

import { SlicePattern } from 'zustand';

export const createUploadSlice: SlicePattern<UploadState, BoundPersistState> = (set) => ({
  updateFiles: (files) =>
    set(
      (state: UploadState) => {
        state.fileItems = files;
      },
      false,
      {
        type: 'upload/updateFiles',
      },
    ),
  updateUploadedSize: (assetId, size) =>
    set(
      (state: UploadState) => {
        if (!state.fileItems) {
          return;
        }

        state.fileItems = state.fileItems.map((file) =>
          file.assetId === assetId ? { ...file, uploadedSize: size } : file,
        );
      },
      false,
      {
        type: 'upload/updateUploadedSize',
      },
    ),
});
