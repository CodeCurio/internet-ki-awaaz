import { TopUtilityBar } from '@/components/public/layout/TopUtilityBar';
import { Masthead } from '@/components/public/layout/Masthead';
import { StickyNav } from '@/components/public/layout/StickyNav';
import { BreakingNewsTicker } from '@/components/public/layout/BreakingNewsTicker';
import { Footer } from '@/components/public/layout/Footer';
import { getActiveBreakingNews } from '@/lib/actions/breaking-news.actions';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const breakingNews = await getActiveBreakingNews();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <TopUtilityBar />
      <Masthead />
      <StickyNav />
      <BreakingNewsTicker initialItems={breakingNews} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
