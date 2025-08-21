import User from './_component/User';

export default async function Home({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  return (
    <div>
      <User userId={userId} />
    </div>
  );
}
