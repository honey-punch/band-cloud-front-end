'use client';

import { useState, useLayoutEffect, useEffect, useContext } from 'react';
import { useInfiniteBandSearch } from '@/hooks/band/useBand';
import BandItem from '@/app/user/[userId]/_component/BandItem';
import { ClipLoader } from 'react-spinners';
import { FaPlus } from 'react-icons/fa6';
import BackDrop from '@/components/BackDrop';
import CreateBandModal from '@/app/band/_component/CreateBandModal';
import { MeContext } from '@/app/_component/MeProvider';
import { toast } from 'react-toastify';

export default function Band() {
  // context
  const { me, setIsOpenLoginModal } = useContext(MeContext);

  // states
  const [searchBandParams, setSearchBandParams] = useState<SearchParams>({
    name: '',
    page: 0,
    size: 25,
    sort: 'createdDate,desc',
    limit: 9999,
  });
  const [name, setName] = useState<string>('');
  const [isOpenCreateBandModal, setIsOpenCreateBandModal] = useState<boolean>(false);

  // hooks
  const {
    bandList,
    isLoadingBandList,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isRefetching,
  } = useInfiniteBandSearch(searchBandParams);

  const bandResultList = bandList?.pages.flatMap((page) => page.result) ?? [];

  // effects
  useLayoutEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 1,
    });
    const observerTarget = document.getElementById('band-page-observer');

    if (observerTarget) {
      observer.observe(observerTarget);
    }
    return () => {
      observer.disconnect();
    };
  }, [isLoadingBandList]);

  // 검색 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchBandParams({
        ...searchBandParams,
        name,
      });
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [name]);

  // functions
  function handleObserver(entries: IntersectionObserverEntry[]) {
    const target = entries[0];

    if (target.isIntersecting && !isLoadingBandList && hasNextPage) {
      fetchNextPage();
    }
  }

  function closeCreateBandModal() {
    setIsOpenCreateBandModal(false);
  }

  return (
    <div>
      <div className="mb-8 flex items-center relative">
        <input
          type="text"
          className="bg-white text-black py-3 px-6 rounded-full focus:outline-none mx-auto"
          placeholder="Find band."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={() => {
            if (!me) {
              setIsOpenLoginModal(true);
              return;
            }
            setIsOpenCreateBandModal(true);
          }}
          className="absolute right-0 cursor-pointer bg-zinc-700 p-3 rounded-full hover:bg-zinc-600 active:bg-zinc-700 transition-colors"
        >
          <FaPlus />
        </button>
      </div>

      <div className="flex flex-wrap gap-6">
        {bandResultList &&
          bandResultList.map((band) => (
            <BandItem key={`band-list-item-key-${band.id}`} id={band.id} />
          ))}
      </div>

      {isFetchingNextPage ? (
        <div className="flex h-60 w-full items-center justify-center">
          <ClipLoader color={'#ffffff'} />
        </div>
      ) : (
        <div id="band-page-observer" className="h-2"></div>
      )}

      {isOpenCreateBandModal && (
        <BackDrop onClick={() => setIsOpenCreateBandModal(false)}>
          <CreateBandModal closeCreateBandModal={closeCreateBandModal} />
        </BackDrop>
      )}
    </div>
  );
}
