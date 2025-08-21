'use client';

import { useUserById } from '@/hooks/user/useUser';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserProps {
  userId: string;
}

export default function User({ userId }: UserProps) {
  // hooks
  const { user, isLoadingUser } = useUserById(userId);
  const router = useRouter();

  return (
    <div>
      <img src={`/file/avatar/${userId}`} alt="avatar" />
    </div>
  );
}
