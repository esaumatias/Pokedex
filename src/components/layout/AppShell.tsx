import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

type Props = {
  children: React.ReactNode;
};

export function AppShell({ children }: Props) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}
