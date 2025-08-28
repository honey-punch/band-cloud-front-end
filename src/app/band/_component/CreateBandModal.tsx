import { ChangeEvent, FormEvent, useContext, useState } from 'react';
import TextInput from '@/components/TextInput';
import { MeContext } from '@/app/_component/MeProvider';
import { useCreateBand } from '@/hooks/band/useBand';
import { toast } from 'react-toastify';
import { useUpdateUser } from '@/hooks/user/useUser';

interface CreateBandModalProps {
  closeCreateBandModal: () => void;
}

type CreateBandValues = {
  name: string;
  description: string;
};

export default function CreateBandModal({ closeCreateBandModal }: CreateBandModalProps) {
  // context
  const { me } = useContext(MeContext);

  // states
  const [createBandValues, setCreateBandValues] = useState<CreateBandValues>({
    name: '',
    description: '',
  });

  // hooks
  const { updateUser } = useUpdateUser(me?.id || '');
  const { createBand } = useCreateBand((data) => {
    closeCreateBandModal();
    updateUser({ bandIds: [...(me?.bandIds || []), data.id] });
  });

  // functions
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!me) {
      toast('Please login first.');
      return;
    }

    if (!createBandValues.name) {
      toast('Please enter the band name.');
      return;
    }

    createBand({ ...createBandValues, leaderId: me.id });
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setCreateBandValues({ ...createBandValues, [name]: value });
  }

  return (
    <form
      onClick={(e) => {
        e.stopPropagation();
      }}
      onSubmit={handleSubmit}
      className="rounded bg-black w-[500px] flex flex-col gap-6 p-10"
    >
      <div className="text-4xl font-bold">Create your band!</div>

      <TextInput
        value={createBandValues.name}
        name="name"
        label="Band name"
        type="text"
        onChange={handleChange}
      />
      <TextInput
        value={createBandValues.description}
        name="description"
        label="Band description"
        type="text"
        onChange={handleChange}
      />

      <button
        type="submit"
        className="text-white bg-orange-500 cursor-pointer hover:bg-orange-600 active:bg-orange-700 transition-colors mt-5 w-[400px] py-[14px] rounded font-bold"
      >
        Submit
      </button>
    </form>
  );
}
