import { ChangeEvent, useContext, useState } from 'react';
import { useUpdateUser } from '@/hooks/user/useUser';
import { MeContext } from '@/app/_component/MeProvider';

interface InfoProps {
  user?: User;
  userId: string;
}

interface InputProps {
  value: string;
  name: string;
  label: string;
  disabled: boolean;
  type: 'text' | 'password';
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

type Info = {
  name: string;
  userId: string;
  password: string;
};

export default function Info({ user, userId }: InfoProps) {
  // context
  const { setMe, me } = useContext(MeContext);

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
      <Input
        value={info.name}
        name="name"
        label="Name"
        disabled={disabled}
        type="text"
        onChange={handleChange}
      />
      <Input
        value={info.userId}
        name="userId"
        label="User ID"
        disabled={disabled}
        type="text"
        onChange={handleChange}
      />
      <Input
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

function Input({ value, label, name, disabled, type, onChange }: InputProps) {
  return (
    <label className="flex flex-col gap-2 w-[400px]">
      <span className={`${disabled ? 'text-zinc-400' : 'text-white'} text-sm font-bold`}>
        {label}
      </span>

      <input
        type={type}
        value={value}
        name={name}
        onChange={onChange}
        disabled={disabled}
        className="bg-white text-black disabled:bg-zinc-400 disabled:text-zinc-600 font-semibold rounded p-3 text-lg focus:outline-none"
      />
    </label>
  );
}
