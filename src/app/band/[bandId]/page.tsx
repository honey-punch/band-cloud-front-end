import Band from '@/app/band/[bandId]/_component/Band';

export default async function Home({ params }: { params: Promise<{ bandId: string }> }) {
  const { bandId } = await params;

  return (
    <div className="p-8">
      <Band bandId={bandId} />
    </div>
  );
}
