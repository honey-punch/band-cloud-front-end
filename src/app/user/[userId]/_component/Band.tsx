import BandItem from '@/app/user/[userId]/_component/BandItem';

interface BandProps {
  bandIds: string[];
}

export default function Band({ bandIds }: BandProps) {
  return (
    <div>
      {bandIds.length === 0 && (
        <div className="text-lg font-semibold">No bands. Are you outsider?</div>
      )}
      {bandIds.length > 0 && (
        <div className="flex flex-wrap gap-6">
          {bandIds.map((id) => (
            <BandItem key={`band-item-${id}`} id={id} />
          ))}
        </div>
      )}
    </div>
  );
}
