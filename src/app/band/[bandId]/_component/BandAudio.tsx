import { useState } from 'react';
import { useUserSearch } from '@/hooks/user/useUser';

interface BandAudioProps {
  bandId: string;
  band?: Band;
}

export default function BandAudio({ bandId, band }: BandAudioProps) {
  // states
  const [searchUserParams, setSearchUserParams] = useState<SearchParams>({
    bandId,
    page: 0,
    size: 9999,
    sort: 'createdDate,desc',
    limit: 9999,
  });

  // hooks
  const { userList } = useUserSearch(searchUserParams);

  return <div>BandAudio</div>;
}
