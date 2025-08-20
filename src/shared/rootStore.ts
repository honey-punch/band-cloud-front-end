import { createUploadSlice } from '@/shared/upload';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createCurrentAssetSlice } from '@/shared/currentAsset';

export const useStore = create<BoundState>()(
  devtools(
    immer((...a) => ({
      ...createCurrentAssetSlice(...a),
    })),
    {
      name: 'band-cloud',
      enabled: process.env.NODE_ENV !== 'production',
    },
  ),
);

export const usePersistStore = create<BoundPersistState>()(
  devtools(
    persist(
      immer((...a) => ({
        ...createUploadSlice(...a),
      })),
      {
        name: 'band-cloud-persist',
      },
    ),
    {
      name: 'band-cloud-persist',
      enabled: process.env.NODE_ENV !== 'production',
    },
  ),
);

export type BoundState = CurrentAssetState;
export type BoundPersistState = UploadState;
