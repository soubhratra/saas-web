import SignupForm from '@/app/(auth)/signup/signup-form';
import React from 'react';

export default function LoginPage() {

  return (
    <main className="flex items-center justify-center ">
      <div className="w-full p-0.5">
        <SignupForm />
      </div>
    </main>
  );
}
