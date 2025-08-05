import Main from '@/app/_component/Main';

export default function Home() {
  // async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  //   e.preventDefault();
  //   const response = await api.post('/api/auth/login', {
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ userId, password }),
  //   });
  //
  //   const result = await response.json();
  //
  //   console.log(result);
  // }

  return (
    <div>
      <Main />
    </div>
  );
}
