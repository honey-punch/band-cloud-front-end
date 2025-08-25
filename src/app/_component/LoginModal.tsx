import { useState, ChangeEvent, useContext } from 'react';
import { useLogin } from '@/hooks/auth/useAuth';
import { MeContext } from '@/app/_component/MeProvider';

interface LoginModalProps {
  closeLoginModal(): void;

  handleChangeMe(me: User | null): void;
}

interface LoginInputProps {
  type: 'text' | 'password';
  value: string;
  autoFocus?: boolean;

  onChange(e: ChangeEvent<HTMLInputElement>): void;
}

export default function LoginModal({ closeLoginModal, handleChangeMe }: LoginModalProps) {
  // hooks
  const { login } = useLogin((user) => {
    closeLoginModal();
    handleChangeMe(user);
  });

  // states
  const [userId, setUserId] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // functions
  function handleChangeId(e: ChangeEvent<HTMLInputElement>) {
    setUserId(e.target.value);
  }

  function handleChangePassword(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    login({ userId, password });
  }

  return (
    <form
      onClick={(e) => {
        e.stopPropagation();
      }}
      onSubmit={handleSubmit}
      className="rounded bg-black w-[500px] flex flex-col gap-10 p-10"
    >
      <div className="text-4xl font-bold">Welcome to sign in!</div>

      <div className="flex flex-col gap-4">
        <LoginInput type="text" value={userId} onChange={handleChangeId} autoFocus={true} />
        <LoginInput type="password" value={password} onChange={handleChangePassword} />
      </div>

      <button
        type="submit"
        className="bg-orange-500 font-bold text-2xl rounded text-white py-3 cursor-pointer"
      >
        Sign in
      </button>
    </form>
  );
}

function LoginInput({ type, value, onChange, autoFocus }: LoginInputProps) {
  return (
    <input
      type={type}
      placeholder={type === 'text' ? 'ID' : 'Password'}
      value={value}
      autoFocus={autoFocus}
      onChange={onChange}
      className="bg-white focus:outline-none text-black rounded p-3 text-lg font-semibold"
    />
  );
}
