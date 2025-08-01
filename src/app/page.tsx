'use client';

import { useUser } from '@/hooks/user/useUser';

export default function Home() {
  const { user } = useUser();

  console.log(user);

  return <div>zzz</div>;
}
