import { Providers } from '@/components/public/Providers';
import LoginForm from '@/components/auth/LoginForm';

export default function Home() {
    return (
        <Providers>
            <main className="flex min-h-screen flex-col items-center justify-center p-24">
                <h1 className="text-4xl font-bold mb-8">Paris Janitor Admin</h1>
                <LoginForm />
            </main>
        </Providers>
    );
}