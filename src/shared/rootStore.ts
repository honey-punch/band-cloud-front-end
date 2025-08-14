import { createUploadSlice } from '@/shared/upload';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

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

export type BoundPersistState = UploadState;
