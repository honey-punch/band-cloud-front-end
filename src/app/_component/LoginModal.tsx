import { useState, ChangeEvent, FormEvent } from 'react';
import { useLogin } from '@/hooks/auth/useAuth';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

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
  const { login, isLoadingLogin } = useLogin((user) => {
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

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!userId && !password) {
      toast('Please enter the ID and password.');
      return;
    }
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
        disabled={isLoadingLogin}
        className={`${isLoadingLogin ? 'bg-gray-500 text-gray-300' : 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700 transition-colors'} font-bold text-2xl rounded  py-3 cursor-pointer`}
      >
        {isLoadingLogin ? <ClipLoader size={24} /> : <span>Sign in</span>}
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
