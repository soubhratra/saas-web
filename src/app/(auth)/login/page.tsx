import LoginForm from '@/app/(auth)/login/login-form';

export default function LoginPage() {

  return (
    <main className="flex items-center justify-center ">
      <div className="w-full p-0.5">
        <LoginForm/>
      </div>
    </main>
  );
}