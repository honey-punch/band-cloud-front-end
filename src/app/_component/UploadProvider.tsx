'use client';

import { useState, ReactNode, useRef, createContext, useContext, useEffect } from 'react';
import { createAsset, upload } from '@/entries/asset/api';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { MeContext } from '@/app/_component/MeProvider';
import { FaRegTrashAlt } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa6';

type UploadContextType = {
  isDrawerOpen: boolean;
  setIsDrawerOpen(value: boolean): void;
};

export const UploadContext = createContext<UploadContextType>({
  isDrawerOpen: false,
  setIsDrawerOpen: (value: boolean) => {},
});

type Props = { children: ReactNode };

const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB

export default function UploadProvider({ children }: Props) {
  // refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const drawRef = useRef<HTMLDivElement>(null);

  // context
  const { me, setIsOpenLoginModal } = useContext(MeContext);

  // states
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // hooks
  const queryClient = useQueryClient();

  // effects
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (drawRef.current && !drawRef.current.contains(event.target as Node)) {
        setIsDrawerOpen(false);
      }
    }

    if (isDrawerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDrawerOpen]);

  // functions
  function hadleClickUpload() {
    fileInputRef.current?.click();
  }

  async function uploadFiles(files: File[]) {
    if (!me) {
      return;
    }

    for (const file of files) {
      const createdAsset = await createAsset({ userId: me.id, originalFileName: file.name });

      if (!createdAsset) {
        toast("Can't create asset.");
        return;
      }

      const chunks = Math.ceil(file.size / CHUNK_SIZE);

      for (let i = 0; i < file.size; i += CHUNK_SIZE) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const multipartFile = file.slice(start, end);

        const uploadResponse = await upload({ assetId: createdAsset.id, multipartFile });

        if (uploadResponse && i === chunks - 1) {
          //
        }
      }
    }

    queryClient.invalidateQueries({ queryKey: ['asset', 'search'] });
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files ? Array.from(e.target.files) : [];

    await uploadFiles(files);
  }

  // 드래깅
  async function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const audioFiles = droppedFiles.filter((file) => {
      const ext = file.name.toLowerCase().split('.').pop();
      return ext === 'wav' || ext === 'mp3';
    });

    if (audioFiles.length !== droppedFiles.length) {
      alert('mp3 또는 wav 형식의 오디오 파일만 업로드할 수 있습니다.');
    }

    await uploadFiles(audioFiles);
  }

  function handleDragEnter(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    console.log(1);
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();

    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function handleRemoveClick() {}

  function handlePlusClick() {}

  return (
    <UploadContext.Provider
      value={{
        isDrawerOpen,
        setIsDrawerOpen,
      }}
    >
      <div
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        className="w-full relative overflow-x-hidden transition-[filter]"
      >
        {isDragging && (
          <div className="pointer-events-none fixed left-0 top-0 z-[40] h-screen w-screen bg-white/20 backdrop-blur-sm" />
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/mpeg, audio/wav"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        {children}

        {/*drawer*/}
        <div
          ref={drawRef}
          className={`${isDrawerOpen ? 'right-0' : 'right-[-400px]'} p-6 border-l border-zinc-500 absolute h-full w-[400px] transition-[right] top-0 z-50 bg-zinc-900`}
        >
          <div className="flex items-center justify-between">
            <div className="font-semibold text-lg">Upload list</div>
            <div className="flex gap-2 items-center">
              <button
                onClick={handleRemoveClick}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-zinc-600 p-2 text-white transition-colors hover:bg-zinc-700 active:bg-zinc-800"
              >
                <FaRegTrashAlt className="h-3 w-3" />
              </button>

              <button
                onClick={handlePlusClick}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-zinc-600 p-2 text-white transition-colors hover:bg-zinc-700 active:bg-zinc-800"
              >
                <FaPlus className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {isDragging && (
          <div className="absolute right-0 top-0 h-full w-full z-40 bg-white/10 backdrop-blur-xs"></div>
        )}
      </div>
    </UploadContext.Provider>
  );
}
