import { InputHTMLAttributes } from 'react';

export default function TextField({ ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type='text'
      className='w-full p-2 focus:outline-none focus:border-black hover:border-black border-2 rounded'
      placeholder='username'
      {...props}
    />
  );
}
