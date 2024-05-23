import React from 'react';
import Link from 'next/link';

interface MessageComponentProps {
  title: string;
  message: string;
}

const PasswordChangeMessageComponent: React.FC<MessageComponentProps> = ({ title, message }) => (
  <main className="flex items-center justify-center ">
    <div className="w-full p-0.5">
      <form className='space-y-3'>
        <div className='flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8'>
          <h1>{title}</h1>
          <div className='w-full'>
            <div className='mt-4'>
              {message}
            </div>
          </div>
        </div>
      </form>
    </div>
  </main>
);

export default PasswordChangeMessageComponent;