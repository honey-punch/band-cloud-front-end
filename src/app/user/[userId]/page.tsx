import UserDetail from './_component/UserDetail';

export default async function Home({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  return (
    <div>
      <UserDetail userId={userId} />
    </div>
  );
}
