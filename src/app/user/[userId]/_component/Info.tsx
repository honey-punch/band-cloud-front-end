import { ChangeEvent, useState } from 'react';
import { useUpdateUser } from '@/hooks/user/useUser';
import TextInput from '@/components/TextInput';
import { useStore } from '@/shared/rootStore';

interface InfoProps {
  user?: User;
  userId: string;
}

type Info = {
  name: string;
  userId: string;
  password: string;
};

export default function Info({ user, userId }: InfoProps) {
  // zustand
  const me = useStore((state) => state.me);
  const setMe = useStore((state) => state.setMe);

  // constants
  const isMe = me?.id === userId;
  const disabled = !me || !isMe;

  // hooks
  const { updateUser } = useUpdateUser(userId, (user) => {
    setMe(user);
  });

  // states
  const [info, setInfo] = useState<Info>({
    name: user?.name || '',
    userId: user?.userId || '',
    password: '',
  });

  // functions
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setInfo({ ...info, [name]: value });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    updateUser({
      ...(info.name && { name: info.name }),
      ...(info.userId && { userId: info.userId }),
      ...(info.password && { password: info.password }),
    });

    setInfo({ ...info, password: '' });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 items-center">
      <TextInput
        value={info.name}
        name="name"
        label="Name"
        disabled={disabled}
        type="text"
        onChange={handleChange}
      />
      <TextInput
        value={info.userId}
        name="userId"
        label="User ID"
        disabled={disabled}
        type="text"
        onChange={handleChange}
      />
      <TextInput
        value={info.password}
        name="password"
        label="Password"
        disabled={disabled}
        type="password"
        onChange={handleChange}
      />

      <button
        type="submit"
        className={`${disabled ? 'text-zinc-800 bg-zinc-600' : 'text-white bg-orange-500 cursor-pointer hover:bg-orange-600 active:bg-orange-700 transition-colors'} mt-5 w-[400px] py-[14px] rounded font-bold`}
      >
        Submit
      </button>
    </form>
  );
}
