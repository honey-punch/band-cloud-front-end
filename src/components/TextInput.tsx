import { ChangeEvent } from 'react';

interface TextInputProps {
  value: string;
  name: string;
  label: string;
  disabled?: boolean;
  type: 'text' | 'password';
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function TextInput({
  value,
  label,
  name,
  disabled,
  type,
  onChange,
}: TextInputProps) {
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
