import { AuthForm } from '@/components/auth-form';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <AuthForm />
    </main>
  );
}
