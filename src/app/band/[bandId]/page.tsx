import BandDetail from '@/app/band/[bandId]/_component/BandDetail';

export default async function Home({ params }: { params: Promise<{ bandId: string }> }) {
  const { bandId } = await params;

  return (
    <div className="p-8">
      <BandDetail bandId={bandId} />
    </div>
  );
}
